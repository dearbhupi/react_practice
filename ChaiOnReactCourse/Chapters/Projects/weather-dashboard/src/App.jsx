import { useEffect, useState } from "react";
import "./App.css";

const initialLocation = {
  name: "Toronto",
  admin1: "Ontario",
  country: "Canada",
  latitude: 43.6532,
  longitude: -79.3832,
};

function describeWeather(code) {
  if (code === 0) return { label: "Clear sky", icon: "☀️" };
  if (code === 1) return { label: "Mainly clear", icon: "🌤️" };
  if (code === 2) return { label: "Partly cloudy", icon: "⛅" };
  if (code === 3) return { label: "Overcast", icon: "☁️" };
  if ([45, 48].includes(code)) return { label: "Fog", icon: "🌫️" };
  if ([51, 53, 55, 56, 57].includes(code)) return { label: "Drizzle", icon: "🌦️" };
  if ([61, 63, 65, 66, 67].includes(code)) return { label: "Rain", icon: "🌧️" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: "Snow", icon: "❄️" };
  if ([80, 81, 82].includes(code)) return { label: "Rain showers", icon: "🌦️" };
  if ([95, 96, 99].includes(code)) return { label: "Thunderstorm", icon: "⛈️" };
  return { label: "Weather conditions", icon: "🌡️" };
}

function convertTemperature(celsius, unit) {
  return Math.round(unit === "F" ? (celsius * 9) / 5 + 32 : celsius);
}

function App() {
  const [theme, setTheme] = useState(() => window.localStorage.getItem("fieldnote-theme") || "light");
  const [temperatureUnit, setTemperatureUnit] = useState(() => window.localStorage.getItem("fieldnote-temperature-unit") || "C");
  const [now, setNow] = useState(() => new Date());
  const [location, setLocation] = useState(initialLocation);
  const [citySkyline, setCitySkyline] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weatherError, setWeatherError] = useState("");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchIsSuggestion, setSearchIsSuggestion] = useState(false);
  const [cityNews, setCityNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState("");
  const [newsScope, setNewsScope] = useState("city");
  const [cityInfo, setCityInfo] = useState(null);
  const [cityInfoLoading, setCityInfoLoading] = useState(false);

  useEffect(() => {
    window.localStorage.setItem("fieldnote-theme", theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem("fieldnote-temperature-unit", temperatureUnit);
  }, [temperatureUnit]);

  useEffect(() => {
    const clock = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(clock);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCitySkyline() {
      try {
        const searchImages = async (searchTerm) => {
          const params = new URLSearchParams({
            action: "query",
            generator: "search",
            gsrsearch: searchTerm,
            gsrnamespace: "6",
            gsrlimit: "10",
            prop: "imageinfo",
            iiprop: "url",
            iiurlwidth: "1800",
            format: "json",
            origin: "*",
          });
          const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
            signal: controller.signal,
          });
          if (!response.ok) throw new Error("City image search failed");
          const data = await response.json();
          return Object.values(data.query?.pages ?? {}).filter((item) => item.imageinfo?.[0]);
        };

        const skylineScore = (title) => {
          const normalizedTitle = title.toLowerCase();
          return ["skyline", "cityscape", "panorama", "panoramic", "skyscraper", "high-rise", "downtown"].reduce(
            (score, keyword) => score + (normalizedTitle.includes(keyword) ? 1 : 0),
            0,
          );
        };

        const cityTerms = [location.name, location.admin1, location.country].filter(Boolean);
        const skylineSearches = [
          `${location.name} ${location.admin1 ?? ""} skyline`,
          `${location.name} ${location.country} skyline`,
          `${location.name} skyline`,
          `${location.name} cityscape`,
        ];
        let pages = [];

        for (const searchTerm of skylineSearches) {
          const results = await searchImages(searchTerm);
          const matches = results.filter((item) => skylineScore(item.title) > 0);
          if (matches.length > 0) {
            pages = matches;
            break;
          }
          if (pages.length === 0) pages = results;
        }

        let imageType = "City skyline";
        if (pages.length === 0 || !pages.some((item) => skylineScore(item.title) > 0)) {
          imageType = "City landmark";
          const landmarkSearches = [
            `${location.name} ${location.admin1 ?? ""} landmark`,
            `${location.name} ${location.country} landmark architecture`,
            `${location.name} landmark`,
          ];
          for (const searchTerm of landmarkSearches) {
            const results = await searchImages(searchTerm);
            if (results.length > 0) {
              pages = results;
              break;
            }
          }
        }

        const page = pages.sort((first, second) => skylineScore(second.title) - skylineScore(first.title))[0];
        const imageInfo = page?.imageinfo?.[0];

        if (!controller.signal.aborted && imageInfo) {
          setCitySkyline({
            key: `${location.name}-${cityTerms.at(-1)}`,
            imageUrl: imageInfo.thumburl ?? imageInfo.url,
            sourceUrl: imageInfo.descriptionurl,
            title: page.title,
            imageType,
          });
        } else if (!controller.signal.aborted) {
          setCitySkyline(null);
        }
      } catch (error) {
        if (error.name !== "AbortError") setCitySkyline(null);
      }
    }

    loadCitySkyline();
    return () => controller.abort();
  }, [location.name, location.country]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadWeather() {
      setLoading(true);
      setWeatherError("");
      const params = new URLSearchParams({
        latitude: String(location.latitude),
        longitude: String(location.longitude),
        current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,uv_index",
        hourly: "temperature_2m,precipitation_probability,weather_code",
        daily: "temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max",
        forecast_days: "7",
        timezone: "auto",
      });

      try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Weather service is unavailable. Please try again.");
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setWeatherError(error.message || "Could not load weather data.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadWeather();
    return () => controller.abort();
  }, [location]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCityNews() {
      setNewsLoading(true);
      setNewsError("");
      setCityNews([]);
      setNewsScope("city");

      const searchArticles = async (searchPhrase) => {
        const params = new URLSearchParams({
          query: searchPhrase,
          mode: "ArtList",
          format: "json",
          maxrecords: "6",
          timespan: "30d",
          sort: "HybridRel",
        });
        const response = await fetch(`https://api.gdeltproject.org/api/v2/doc/doc?${params}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Local headlines are temporarily unavailable.");
        const data = await response.json();
        return (data.articles ?? []).filter((article) => article.title && article.url);
      };

      try {
        const searchLevels = [
          { scope: "city", phrase: `${location.name} ${location.country}` },
          location.admin1 && { scope: "state", phrase: `${location.admin1} ${location.country}` },
          { scope: "country", phrase: location.country },
        ].filter((level, index, levels) => level && levels.findIndex((item) => item?.phrase === level.phrase) === index);
        let articles = [];
        let lastSearchError;

        for (const level of searchLevels) {
          try {
            articles = await searchArticles(level.phrase);
            if (articles.length > 0) {
              setNewsScope(level.scope);
              break;
            }
          } catch (error) {
            if (error.name === "AbortError" || controller.signal.aborted) throw error;
            lastSearchError = error;
          }
        }

        setCityNews(articles);
        if (articles.length === 0) {
          setNewsError(lastSearchError?.message || `No recent headlines found for ${location.name}, ${location.admin1 || "the state"}, or ${location.country}.`);
        }
      } catch (error) {
        if (error.name !== "AbortError" && !controller.signal.aborted) {
          setCityNews([]);
          setNewsError(error.message || "Could not load local headlines.");
        }
      } finally {
        if (!controller.signal.aborted) setNewsLoading(false);
      }
    }

    loadCityNews();
    return () => controller.abort();
  }, [location.name, location.admin1, location.country]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCityInfo() {
      setCityInfoLoading(true);
      const pageName = encodeURIComponent(location.name.replaceAll(" ", "_"));

      try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${pageName}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("City profile unavailable");
        const data = await response.json();
        if (!controller.signal.aborted) {
          setCityInfo({
            description: data.description,
            extract: data.extract,
            url: data.content_urls?.desktop?.page,
          });
        }
      } catch (error) {
        if (error.name !== "AbortError" && !controller.signal.aborted) setCityInfo(null);
      } finally {
        if (!controller.signal.aborted) setCityInfoLoading(false);
      }
    }

    loadCityInfo();
    return () => controller.abort();
  }, [location.name]);

  const handleSearch = async (event) => {
    event.preventDefault();
    const searchTerm = query.trim();
    if (!searchTerm) return;

    setSearchLoading(true);
    setSearchError("");
    setSearchResults([]);
    setSearchIsSuggestion(false);

    try {
      const params = new URLSearchParams({ name: searchTerm, count: "5", language: "en", format: "json" });
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);
      if (!response.ok) throw new Error("City search is unavailable. Please try again.");
      const data = await response.json();
      if (!data.results?.length) {
        const suggestionParams = new URLSearchParams({ q: searchTerm, limit: "5", lang: "en" });
        const suggestionResponse = await fetch(`https://photon.komoot.io/api/?${suggestionParams}`);
        if (!suggestionResponse.ok) throw new Error("Similar city search is unavailable. Please try again.");

        const suggestionData = await suggestionResponse.json();
        const suggestions = (suggestionData.features ?? [])
          .filter((feature) => feature.properties?.name && feature.geometry?.coordinates?.length === 2)
          .map((feature, index) => {
            const [longitude, latitude] = feature.geometry.coordinates;
            const properties = feature.properties;
            return {
              id: `photon-${properties.osm_type}-${properties.osm_id ?? index}`,
              name: properties.city ?? properties.name,
              admin1: properties.state ?? properties.county,
              country: properties.country,
              latitude,
              longitude,
            };
          });

        if (suggestions.length) {
          setSearchResults(suggestions);
          setSearchIsSuggestion(true);
        } else {
          setSearchError("No similar cities found. Check the spelling and try again.");
        }
      } else {
        setSearchResults(data.results);
      }
    } catch (error) {
      setSearchError(error.message || "Could not search for that city.");
    } finally {
      setSearchLoading(false);
    }
  };

  const selectLocation = (place) => {
    setLocation({
      name: place.name,
      admin1: place.admin1,
      country: place.country,
      latitude: place.latitude,
      longitude: place.longitude,
    });
    setQuery("");
    setSearchResults([]);
  };

  const current = weather?.current;
  const citySkylineKey = `${location.name}-${location.country}`;
  const currentCitySkyline = citySkyline?.key === citySkylineKey ? citySkyline : null;
  const currentConditions = current ? describeWeather(current.weather_code) : null;
  const heroWeatherIcon = current?.is_day === 0 && [0, 1, 2].includes(current.weather_code)
    ? "☾"
    : currentConditions?.icon ?? "◌";
  const hourly = weather?.hourly;
  const currentHourIndex = hourly?.time.findIndex((time) => time >= current.time) ?? -1;
  const forecastStart = Math.max(currentHourIndex, 0);
  const nextHours = hourly
    ? hourly.time.slice(forecastStart, forecastStart + 12).map((time, index) => {
        const hourIndex = forecastStart + index;
        const hourOfDay = Number(time.slice(11, 13));
        return {
          time: index === 0 ? "Now" : `${hourOfDay % 12 || 12}${hourOfDay < 12 ? "AM" : "PM"}`,
          temperature: convertTemperature(hourly.temperature_2m[hourIndex], temperatureUnit),
          rain: hourly.precipitation_probability[hourIndex],
          icon: describeWeather(hourly.weather_code[hourIndex]).icon,
        };
      })
    : [];
  const currentRainChance = nextHours[0]?.rain ?? 0;
  const humidityAdvice = !current || loading
    ? "Updating now"
    : current.relative_humidity_2m >= 80 && current.temperature_2m >= 37.8
      ? "Avoid strenuous walks"
      : current.relative_humidity_2m >= 80
        ? "Air feels muggy"
        : current.relative_humidity_2m <= 30
          ? "Dry air today"
          : "Comfortable humidity";
  const windAdvice = !current || loading
    ? "Updating now"
    : current.wind_speed_10m >= 50
      ? "Very windy outdoors"
      : current.wind_speed_10m >= 30
        ? "Breezy outside"
        : "Light winds today";
  const precipitationAdvice = !current || loading
    ? "Updating now"
    : current.precipitation > 0.1
      ? "Rain falling now"
      : currentRainChance >= 60
        ? "Rain likely soon"
        : currentRainChance >= 25
          ? "Carry an umbrella"
          : "Low rain chance";
  const currentUvIndex = current?.uv_index;
  const uvAdvice = !current || loading || currentUvIndex == null
    ? "UV data unavailable"
    : currentUvIndex >= 11
      ? "Avoid midday sun"
      : currentUvIndex >= 8
        ? "Seek shade outdoors"
        : currentUvIndex >= 6
          ? "Use sun protection"
          : currentUvIndex >= 3
            ? "Apply sunscreen today"
            : "Low UV exposure";
  const hourlyTemperatures = nextHours.map((hour) => hour.temperature);
  const hourlyMinimum = Math.min(...hourlyTemperatures);
  const hourlyMaximum = Math.max(...hourlyTemperatures);
  const hourlyLinePoints = nextHours.map((hour, index) => {
    const horizontalPosition = nextHours.length === 1 ? 500 : ((index + 0.5) * 1000) / nextHours.length;
    const verticalPosition = 84 - ((hour.temperature - hourlyMinimum) / (hourlyMaximum - hourlyMinimum || 1)) * 58;
    return { horizontalPosition, verticalPosition };
  });
  const hourlyLinePath = hourlyLinePoints
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.horizontalPosition} ${point.verticalPosition}`)
    .join(" ");
  const hourlyAreaPath = hourlyLinePoints.length
    ? `${hourlyLinePath} L ${hourlyLinePoints.at(-1).horizontalPosition} 108 L ${hourlyLinePoints[0].horizontalPosition} 108 Z`
    : "";
  const daily = weather?.daily;
  const nextSevenDays = daily
    ? daily.time.map((date, index) => ({
        date,
        day: index === 0 ? "Today" : new Intl.DateTimeFormat("en", {
          weekday: "short",
          timeZone: weather.timezone,
        }).format(new Date(`${date}T12:00:00`)),
        minimum: convertTemperature(daily.temperature_2m_min[index], temperatureUnit),
        maximum: convertTemperature(daily.temperature_2m_max[index], temperatureUnit),
        rainChance: Math.round(daily.precipitation_probability_max?.[index] ?? 0),
        icon: describeWeather(daily.weather_code[index]).icon,
      }))
    : [];
  const dailyMinimum = Math.min(...nextSevenDays.map((day) => day.minimum));
  const dailyMaximum = Math.max(...nextSevenDays.map((day) => day.maximum));
  const localTimeParts = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
    timeZone: weather?.timezone ?? "UTC",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now).map(({ type, value }) => [type, value]));
  const localHour = Number(localTimeParts.hour);
  const localClockHour = String(localHour % 12 || 12).padStart(2, "0");
  const localPeriod = localHour === 0
    ? "Midnight"
    : localHour < 12
      ? "Morning"
      : localHour < 17
        ? "Afternoon"
        : "Evening";
  const localDate = new Intl.DateTimeFormat(undefined, {
    timeZone: weather?.timezone ?? "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(now);

  return (
    <main
      className="weather-app"
      data-theme={theme}
      data-time-of-day={current ? (current.is_day ? "day" : "night") : "day"}
    >
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Fieldnote Weather home">
          <span className="brand-mark">F</span>
          <span>fieldnote<span className="brand-light"> / weather</span></span>
        </a>
        <div className="topbar-actions">
          <span className="data-note"><span className="live-dot" /> Open-Meteo forecast data</span>
          <div className="temperature-units" role="group" aria-label="Temperature units">
            <button
              type="button"
              aria-pressed={temperatureUnit === "C"}
              onClick={() => setTemperatureUnit("C")}
            >
              °C
            </button>
            <button
              type="button"
              aria-pressed={temperatureUnit === "F"}
              onClick={() => setTemperatureUnit("F")}
            >
              °F
            </button>
          </div>
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setTheme((currentTheme) => currentTheme === "light" ? "dark" : "light")}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
            {theme === "light" ? "Dark" : "Light"}
          </button>
        </div>
      </header>

      <section className="weather-shell" id="top">
        <div className="page-heading">
          <div>
            <p className="eyebrow">LOCAL FORECAST</p>
            <h1>{location.name} Weather</h1>
          </div>
          <div className="local-clock" aria-label={`Local time in ${location.name}`}>
            <div className="clock-copy">
              <span className="clock-label">LOCAL TIME · {location.name.toUpperCase()}</span>
              <time className="clock-time" dateTime={now.toISOString()}>
                <span className="clock-digits">
                  {current ? `${localClockHour}:${localTimeParts.minute}:${localTimeParts.second}` : "--:--:--"}
                </span>
              </time>
              {current && <span className="clock-period">{localPeriod}</span>}
              <time className="clock-date" dateTime={now.toISOString()}>
                {current ? localDate : "Loading local time"}
              </time>
            </div>
          </div>
        </div>

        <form className="search-form" onSubmit={handleSearch}>
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a city or town"
              aria-label="Search a city or town"
            />
          </label>
          <button className="search-button" type="submit" disabled={searchLoading || !query.trim()}>
            {searchLoading ? "Searching…" : "Find city"}
          </button>
        </form>

        {searchError && <p className="inline-message error-message" role="alert">{searchError}</p>}
        {searchResults.length > 0 && (
          <div>
            {searchIsSuggestion && (
              <p className="inline-message">No exact city match. Did you mean one of these?</p>
            )}
            <div className="search-results" aria-label={searchIsSuggestion ? "Similar city suggestions" : "City search results"}>
              {searchResults.map((place) => (
                <button className="result-row" key={`${place.id}-${place.latitude}`} onClick={() => selectLocation(place)} type="button">
                  <span>{place.name}<small>{[place.admin1, place.country].filter(Boolean).join(", ")}</small></span>
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
            {searchIsSuggestion && <p className="inline-message">Suggestions powered by Photon and OpenStreetMap.</p>}
          </div>
        )}

        <div className="location-line">
          <span>{[location.admin1, location.country].filter(Boolean).join(", ")}</span>
          <span className="location-separator" aria-hidden="true">·</span>
          <span>As of {localClockHour}:{localTimeParts.minute} {localPeriod}</span>
          <a className="location-precision" href="#map">Improve location precision</a>
        </div>

        {weatherError && (
          <section className="error-panel" role="alert">
            <p>{weatherError}</p>
            <button className="text-button" onClick={() => setLocation({ ...location })}>Try again</button>
          </section>
        )}

        <section
          className="current-weather"
          aria-live="polite"
          style={currentCitySkyline ? { "--skyline-image": `url("${currentCitySkyline.imageUrl}")` } : undefined}
        >
          <div className="current-main">
            <div className="current-temperature-copy">
              <div className="temperature">
                {loading ? "--" : convertTemperature(current?.temperature_2m, temperatureUnit)}<span>°{temperatureUnit}</span>
              </div>
              <p className="hero-weather-details">
                <span>Feels like <strong>{loading ? "--" : `${convertTemperature(current.apparent_temperature, temperatureUnit)}°`}</strong></span>
                <span>High <strong>{nextSevenDays[0]?.maximum ?? "--"}°</strong></span>
                <span>Low <strong>{nextSevenDays[0]?.minimum ?? "--"}°</strong></span>
              </p>
              <p className="hero-rain-details">
                Chance of rain <strong>{nextHours[0]?.rain ?? 0}%</strong>
                <span aria-hidden="true">·</span>
                <strong>{loading ? "--" : `${current.precipitation} mm`}</strong> precipitation
              </p>
            </div>
          </div>
          <div className="condition-summary">
            <div className="condition-icon" aria-hidden="true">{heroWeatherIcon}</div>
            <span className="summary-text">{loading ? "Loading" : currentConditions?.label}</span>
          </div>
        </section>
        {currentCitySkyline && (
          <p className="skyline-caption">
            {currentCitySkyline.imageType}: {currentCitySkyline.title.replace("File:", "")} ·{" "}
            <a href={currentCitySkyline.sourceUrl} target="_blank" rel="noreferrer">
              View source and license
            </a>
          </p>
        )}

        <section className="metrics" aria-label="Current weather details">
          <article className="metric metric-humidity">
            <span className="metric-icon" aria-hidden="true">◌</span>
            <span className="metric-label">Humidity</span>
            <strong>{loading ? "--" : `${current.relative_humidity_2m}%`}</strong>
            <span className="metric-advice">{humidityAdvice}</span>
          </article>
          <article className="metric metric-wind">
            <span className="metric-icon" aria-hidden="true">↗</span>
            <span className="metric-label">Wind</span>
            <strong>{loading ? "--" : `${Math.round(current.wind_speed_10m)} km/h`}</strong>
            <span className="metric-advice">{windAdvice}</span>
          </article>
          <article className="metric metric-precipitation">
            <span className="metric-icon" aria-hidden="true">☂</span>
            <span className="metric-label">Precipitation</span>
            <strong>{loading ? "--" : `${current.precipitation} mm`}</strong>
            <span className="metric-advice">{precipitationAdvice}</span>
          </article>
          <article className="metric metric-uv">
            <span className="metric-icon" aria-hidden="true">☼</span>
            <span className="metric-label">UV Index</span>
            <strong>{loading || currentUvIndex == null ? "--" : currentUvIndex.toFixed(1)}</strong>
            <span className="metric-advice">{uvAdvice}</span>
          </article>
        </section>

        <section className="hourly-section" id="outlook">
          <div className="section-heading">
            <div><p className="eyebrow">TODAY'S OUTLOOK</p><h2>12-hour forecast</h2></div>
            <span className="timezone-label">Local time · {weather?.timezone ?? "—"} · °{temperatureUnit}</span>
          </div>
          {weatherError ? (
            <p className="inline-message">Hourly forecast is unavailable.</p>
          ) : (
            <>
              <p className="outlook-summary">
                Today's high is {nextSevenDays[0]?.maximum ?? "--"}°, with a low of {nextSevenDays[0]?.minimum ?? "--"}°. Rain chance in the next hour: {nextHours[0]?.rain ?? 0}%.
              </p>
              <div className="hourly-forecast-card">
                <div className="hourly-list" aria-live="polite">
                  {loading ? <p className="loading-hours">Loading hourly forecast…</p> : nextHours.map((hour, index) => (
                    <article
                      className={index === 0 ? "hour hour-current" : "hour"}
                      key={`${location.name}-${temperatureUnit}-${hour.time}`}
                      aria-current={index === 0 ? "time" : undefined}
                      style={{ animationDelay: `${index * 35}ms` }}
                    >
                      <span className="hour-time">{hour.time}</span>
                      <span className="hour-icon" aria-hidden="true">{hour.icon}</span>
                      <strong>{hour.temperature}°</strong>
                      <span className="hour-rain">{hour.rain ?? 0}% rain</span>
                    </article>
                  ))}
                </div>
                {!loading && (
                  <svg key={`${location.name}-${temperatureUnit}`} className="hourly-temperature-line" viewBox="0 0 1000 110" preserveAspectRatio="none" role="img" aria-label={`Hourly temperatures in degrees ${temperatureUnit}`}>
                    <defs>
                      <linearGradient id="hourly-area-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ee8a2f" stopOpacity="0.24" />
                        <stop offset="100%" stopColor="#ee8a2f" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path className="hourly-line-area" d={hourlyAreaPath} />
                    <path className="hourly-line-shadow" d={hourlyLinePath} pathLength="1" />
                    <path className="hourly-line" d={hourlyLinePath} pathLength="1" />
                    {hourlyLinePoints.map((point, index) => (
                      <circle key={`${location.name}-point-${index}`} className={index === 0 ? "hourly-line-point hourly-line-point-current" : "hourly-line-point"} cx={point.horizontalPosition} cy={point.verticalPosition} r={index === 0 ? 5 : 3.5} />
                    ))}
                  </svg>
                )}
              </div>
            </>
          )}
        </section>

        <div className="forecast-grid">
          <section className="daily-section">
          <div className="section-heading">
            <div><p className="eyebrow">THE WEEK AHEAD</p><h2>7-day temperature</h2></div>
            <span className="timezone-label">Daily low and high · °{temperatureUnit}</span>
          </div>
          {weatherError ? (
            <p className="inline-message">Daily forecast is unavailable.</p>
          ) : loading ? (
            <p className="loading-hours">Loading 7-day forecast…</p>
          ) : (
            <div className="daily-forecast-list" aria-label="Seven-day forecast">
              {nextSevenDays.map((day, index) => {
                const lowPosition = ((day.minimum - dailyMinimum) / (dailyMaximum - dailyMinimum || 1)) * 100;
                const highPosition = ((day.maximum - dailyMinimum) / (dailyMaximum - dailyMinimum || 1)) * 100;
                return (
                  <article
                    className={index === 0 ? "daily-forecast-row daily-row-today" : "daily-forecast-row"}
                    key={`${location.name}-${temperatureUnit}-${day.date}`}
                    aria-current={index === 0 ? "date" : undefined}
                    style={{ animationDelay: `${index * 55}ms` }}
                  >
                    <span className="daily-row-day">{day.day}</span>
                    <div className="daily-row-condition">
                      <span className="daily-row-icon" aria-hidden="true">{day.icon}</span>
                      {day.rainChance > 0 && <span className="daily-rain-chance">{day.rainChance}%</span>}
                    </div>
                    <span className="daily-row-low">{day.minimum}°</span>
                    <div className="daily-range-track" title={`${day.day}: low ${day.minimum}°${temperatureUnit}, high ${day.maximum}°${temperatureUnit}`}>
                      <div
                        className="daily-range-fill"
                        style={{
                          left: `${lowPosition}%`,
                          width: `${Math.max(highPosition - lowPosition, 8)}%`,
                          animationDelay: `${index * 55 + 120}ms`,
                        }}
                      />
                    </div>
                    <strong className="daily-row-high">{day.maximum}°</strong>
                  </article>
                );
              })}
            </div>
          )}
          </section>

            <section className="city-news-section" aria-label={`${location.name} city brief`}>
              <div className="section-heading">
                <div><p className="eyebrow">CITY BRIEF</p><h2>{location.name} guide</h2></div>
              </div>
              <div className="city-profile">
                <span className="city-news-source">ABOUT {location.name.toUpperCase()}</span>
                {cityInfoLoading ? (
                  <p className="news-state" role="status">Loading city information…</p>
                ) : cityInfo?.extract ? (
                  <>
                    {cityInfo.description && <strong className="city-profile-description">{cityInfo.description}</strong>}
                    <p className="city-profile-extract">{cityInfo.extract}</p>
                    {cityInfo.url && <a className="news-search-link" href={cityInfo.url} target="_blank" rel="noreferrer">Read city profile ↗</a>}
                  </>
                ) : (
                  <p className="news-state">No city profile is available for this location.</p>
                )}
              </div>

              <div className="city-quick-links">
                <a
                  className="news-search-link"
                  href={`https://www.google.com/search?q=${encodeURIComponent(`${location.name} ${location.admin1 ?? ""} upcoming events`)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Upcoming events ↗
                </a>
                <a
                  className="news-search-link"
                  href={`https://x.com/search?q=${encodeURIComponent(`${location.name} ${location.admin1 ?? ""}`)}&src=typed_query&f=live`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Live X posts ↗
                </a>
              </div>

              <p className="news-window">Recent headlines · past month</p>
              {!newsLoading && newsScope !== "city" && (
                <p className="news-scope-fallback">
                  {newsScope === "state"
                    ? `No city stories found; showing ${location.admin1} state news instead.`
                    : `No city or state stories found; showing ${location.country} news instead.`}
                </p>
              )}
              {newsLoading ? (
                <p className="news-state" role="status">Finding recent stories about {location.name}…</p>
              ) : newsError ? (
                <p className="news-state">{newsError}</p>
              ) : (
                <div className="city-news-list">
                  {cityNews.map((article) => (
                    <a className="city-news-item" href={article.url} key={article.url} target="_blank" rel="noreferrer">
                      <span className="city-news-source">{article.domain || article.sourcecountry || "Local source"}</span>
                      <strong>{article.title}</strong>
                    </a>
                  ))}
                </div>
              )}
              <p className="news-attribution">Headlines via GDELT · City profile via Wikipedia.</p>
            </section>
          </div>

        <section className="map-section" id="map">
          <div className="section-heading">
            <div><p className="eyebrow">EXPLORE THE AREA</p><h2>Location map</h2></div>
            <a
              className="map-link"
              href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
              target="_blank"
              rel="noreferrer"
            >
              Open in Google Maps ↗
            </a>
          </div>
          <iframe
            className="map-frame"
            title={`Google Map showing ${location.name}, ${location.country}`}
            src={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=11&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <p className="map-note">Map centered on {location.name}. Google controls the embedded map's colors.</p>
        </section>

        <footer className="app-footer">
          <span>Weather forecasts powered by Open-Meteo</span>
          <span>Conditions are model-based and may update periodically.</span>
        </footer>
      </section>
    </main>
  );
}

export default App;
