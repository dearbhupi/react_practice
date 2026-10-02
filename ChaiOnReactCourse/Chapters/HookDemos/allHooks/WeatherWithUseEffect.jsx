import { useEffect, useState } from "react";

const weatherByCity = {
  Toronto: { temperature: 18, condition: "Cloudy ☁️" },
  Paris: { temperature: 22, condition: "Sunny ☀️" },
  Tokyo: { temperature: 27, condition: "Rainy 🌧️" },
};

function fetchWeather(city, signal) {
  return new Promise((resolve, reject) => {
    const timerId = window.setTimeout(() => {
      resolve({ city, ...weatherByCity[city] });
    }, 700);

    const cancel = () => {
      window.clearTimeout(timerId);
      reject(new DOMException("Request cancelled", "AbortError"));
    };

    if (signal.aborted) cancel();
    else signal.addEventListener("abort", cancel, { once: true });
  });
}

function WeatherWithUseEffect() {
  const [city, setCity] = useState("Toronto");
  const [weather, setWeather] = useState(null);
  const [requestError, setRequestError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchWeather(city, controller.signal)
      .then(setWeather)
      .catch((requestError) => {
        if (requestError.name !== "AbortError") {
          setRequestError({ city, message: requestError.message });
        }
      });

    return () => controller.abort();
  }, [city]);

  const error = requestError?.city === city ? requestError.message : "";
  const loading = !error && weather?.city !== city;
  const changeCitySomewhereElse = () => {
    setCity((currentCity) => (currentCity === "Tokyo" ? "Paris" : "Tokyo"));
  };

  return (
    <section style={panelStyle}>
      <h2>File 1: With useEffect</h2>
      <p>Choose a city. Weather loads whenever the city state changes.</p>
      <label>
        City: {" "}
        <select value={city} onChange={(event) => setCity(event.target.value)}>
          {Object.keys(weatherByCity).map((name) => <option key={name}>{name}</option>)}
        </select>
      </label>{" "}
      <button onClick={changeCitySomewhereElse}>Change city another way</button>
      <WeatherResult city={city} weather={weather} loading={loading} error={error} />
      <p>
        The extra button changes city state without calling fetch itself. The
        effect notices the change and loads the matching weather anyway.
      </p>
    </section>
  );
}

export function WeatherResult({ city, weather, loading, error }) {
  if (error) return <p role="alert">Could not load weather: {error}</p>;
  if (loading) return <p role="status">Loading {city} weather...</p>;
  if (!weather) return <p>Weather is not loaded yet.</p>;

  return (
    <div style={{ padding: 12, background: "#eff6ff", borderRadius: 8 }}>
      <h3>{weather.city}</h3>
      <p>{weather.temperature}°C — {weather.condition}</p>
    </div>
  );
}

const panelStyle = {
  padding: 20,
  margin: "24px auto",
  maxWidth: 760,
  border: "2px solid #16a34a",
  borderRadius: 12,
  fontFamily: "sans-serif",
};

export default WeatherWithUseEffect;
