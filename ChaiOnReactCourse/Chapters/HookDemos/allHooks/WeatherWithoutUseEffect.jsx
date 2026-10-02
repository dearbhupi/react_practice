import { useState } from "react";

const weatherByCity = {
  Toronto: { temperature: 18, condition: "Cloudy ☁️" },
  Paris: { temperature: 22, condition: "Sunny ☀️" },
  Tokyo: { temperature: 27, condition: "Rainy 🌧️" },
};

function fetchWeather(city) {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve({ city, ...weatherByCity[city] });
    }, 700);
  });
}

function WeatherWithoutUseEffect() {
  const [city, setCity] = useState("Toronto");
  const [weather, setWeather] = useState(null);
  const [loadingCity, setLoadingCity] = useState("");
  const [error, setError] = useState("");

  // Without useEffect, this event handler must update the city AND fetch its weather.
  const handleCitySelection = async (nextCity) => {
    setCity(nextCity);
    setLoadingCity(nextCity);
    setError("");

    try {
      const result = await fetchWeather(nextCity);
      setWeather(result);
    } catch {
      setError("Could not load weather.");
    } finally {
      setLoadingCity("");
    }
  };

  // This represents another place in the app changing the city state.
  // It does not call handleCitySelection, so it does not fetch new weather.
  const changeCityFromAnotherPlace = () => {
    setCity((currentCity) => (currentCity === "Tokyo" ? "Paris" : "Tokyo"));
  };

  const loading = loadingCity === city;
  const weatherIsOutOfDate = weather && weather.city !== city && !loading;

  return (
    <section style={panelStyle}>
      <h2>File 2: Without useEffect</h2>
      <p>The dropdown's event handler must remember to fetch weather.</p>
      <label>
        City: {" "}
        <select
          value={city}
          onChange={(event) => handleCitySelection(event.target.value)}
        >
          {Object.keys(weatherByCity).map((name) => <option key={name}>{name}</option>)}
        </select>
      </label>{" "}
      <button onClick={changeCityFromAnotherPlace}>Change city another way</button>

      <p>Selected city: <strong>{city}</strong></p>
      {loading && <p role="status">Loading {city} weather...</p>}
      {error && <p role="alert">{error}</p>}
      {weather && (
        <div style={{ padding: 12, background: "#eff6ff", borderRadius: 8 }}>
          <h3>Weather result for {weather.city}</h3>
          <p>{weather.temperature}°C — {weather.condition}</p>
        </div>
      )}
      {weatherIsOutOfDate && (
        <p style={{ color: "#b45309" }}>
          The selected city changed, but this code path did not fetch again. The
          displayed weather is stale.
        </p>
      )}

      <details style={{ marginTop: 12 }}>
        <summary>Why does this version need more care?</summary>
        <p>
          Every place that changes the city must call the fetch handler. If a
          new button or another component changes city state directly, the
          weather can become stale. Fast repeated selections can also let an
          older request finish last and overwrite newer weather; preventing
          that requires extra request-cancellation code.
        </p>
      </details>
    </section>
  );
}

const panelStyle = {
  padding: 20,
  margin: "24px auto",
  maxWidth: 760,
  border: "2px solid #f59e0b",
  borderRadius: 12,
  fontFamily: "sans-serif",
};

export default WeatherWithoutUseEffect;
