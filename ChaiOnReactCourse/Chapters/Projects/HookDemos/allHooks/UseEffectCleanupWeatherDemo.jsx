import { useEffect, useState } from "react";

const weather = {
  Toronto: { temperature: 18, condition: "Cloudy ☁️", delay: 1400 },
  Paris: { temperature: 22, condition: "Sunny ☀️", delay: 500 },
  Tokyo: { temperature: 27, condition: "Rainy 🌧️", delay: 800 },
};

function requestWeather(city, signal) {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      resolve({ city, ...weather[city] });
    }, weather[city].delay);

    if (!signal) return;

    const cancelRequest = () => {
      window.clearTimeout(timer);
      reject(new DOMException("Request cancelled", "AbortError"));
    };

    if (signal.aborted) {
      cancelRequest();
    } else {
      signal.addEventListener("abort", cancelRequest, { once: true });
    }
  });
}

const panelStyle = {
  flex: "1 1 320px",
  minWidth: 0,
  padding: 18,
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  background: "white",
};

function CityPicker({ city, setCity }) {
  return (
    <label>
      Choose city: {" "}
      <select value={city} onChange={(event) => setCity(event.target.value)}>
        {Object.keys(weather).map((name) => <option key={name}>{name}</option>)}
      </select>
    </label>
  );
}

function WeatherDisplay({ selectedCity, result }) {
  const isStale = result && result.city !== selectedCity;

  return (
    <div aria-live="polite" style={{ marginTop: 14, padding: 12, background: "#f1f5f9", borderRadius: 6 }}>
      <p>City you selected: <strong>{selectedCity}</strong></p>
      {!result && <p>Waiting for the first weather result...</p>}
      {result && (
        <>
          <p>Weather data received for: <strong>{result.city}</strong></p>
          <p>{result.temperature}°C — {result.condition}</p>
        </>
      )}
      {isStale && (
        <p style={{ color: "#b45309", fontWeight: "bold" }}>
          This result is out of date. The selected city and weather do not match.
        </p>
      )}
    </div>
  );
}

function WithCleanupPanel() {
  const [city, setCity] = useState("Tokyo");
  const [result, setResult] = useState(null);
  const [raceId, setRaceId] = useState(0);

  const runRace = () => {
    setCity("Toronto");
    setRaceId((currentRaceId) => currentRaceId + 1);
    window.setTimeout(() => setCity("Paris"), 150);
  };

  useEffect(() => {
    const controller = new AbortController();

    requestWeather(city, controller.signal)
      .then(setResult)
      .catch((error) => {
        if (error.name !== "AbortError") console.error(error);
      });

    return () => controller.abort();
  }, [city, raceId]);

  return (
    <section style={{ ...panelStyle, borderTop: "4px solid #15803d" }}>
      <h2>Effect with cleanup</h2>
      <p>Click to request slow Toronto, then fast Paris.</p>
      <button onClick={runRace}>Run Toronto then Paris</button>
      <CityPicker city={city} setCity={setCity} />
      <WeatherDisplay selectedCity={city} result={result} />
    </section>
  );
}

function WithoutCleanupPanel() {
  const [city, setCity] = useState("Tokyo");
  const [result, setResult] = useState(null);
  const [raceId, setRaceId] = useState(0);

  const runRace = () => {
    setCity("Toronto");
    setRaceId((currentRaceId) => currentRaceId + 1);
    window.setTimeout(() => setCity("Paris"), 150);
  };

  useEffect(() => {
    requestWeather(city).then(setResult);
  }, [city, raceId]);

  return (
    <section style={{ ...panelStyle, borderTop: "4px solid #b91c1c" }}>
      <h2>Effect without cleanup</h2>
      <p>Click the same demo button to start the same two requests.</p>
      <button onClick={runRace}>Run Toronto then Paris</button>
      <CityPicker city={city} setCity={setCity} />
      <WeatherDisplay selectedCity={city} result={result} />
    </section>
  );
}

function UseEffectCleanupWeatherDemo() {
  return (
    <main style={{ maxWidth: 950, margin: "32px auto", padding: 20, fontFamily: "sans-serif", color: "#172033" }}>
      <h1>Weather Requests: Why Cleanup Matters</h1>
      <p>
        This demo uses pretend weather and network delays. Click
        <strong> Run Toronto then Paris </strong>in each panel. Toronto is
        deliberately slower than Paris.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <WithCleanupPanel />
        <WithoutCleanupPanel />
      </div>

      <section style={{ marginTop: 18, padding: 18, background: "#eff6ff", borderRadius: 8, lineHeight: 1.6 }}>
        <h2>What to notice</h2>
        <p>
          With cleanup, the Paris request cancels the still-loading Toronto
          request, so Paris stays on screen. Without cleanup, Paris appears
          first, then the older Toronto result arrives and replaces it. The
          warning shows when displayed weather no longer matches your selection.
        </p>
        <p>
          In this pretend API, cleanup cancels the timer. With a real web request,
          an <code>AbortController</code> can cancel the browser's request, though
          it cannot always undo work the server has already started.
        </p>
      </section>
    </main>
  );
}

export default UseEffectCleanupWeatherDemo;
