const effectExample = `// Fetch again whenever the selected city changes
useEffect(() => {
  const controller = new AbortController();

  fetchWeather(city, controller.signal)
    .then(setWeather)
    .catch((error) => {
      if (error.name !== "AbortError") {
        setError(error.message);
      }
    });

  return () => controller.abort();
}, [city]);`;

const noEffectExample = `// Fetch only when this event handler runs
const handleCitySelection = async (nextCity) => {
  setCity(nextCity);
  setLoading(true);

  try {
    const result = await fetchWeather(nextCity);
    setWeather(result);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

<select
  value={city}
  onChange={(event) => handleCitySelection(event.target.value)}
/>`;

const panelStyle = {
  flex: "1 1 360px",
  minWidth: 0,
  padding: 18,
  border: "1px solid #cbd5e1",
  borderRadius: 10,
  background: "#fff",
};

const codeStyle = {
  overflowX: "auto",
  padding: 14,
  borderRadius: 8,
  background: "#172033",
  color: "#f8fafc",
  fontSize: 14,
  lineHeight: 1.5,
};

function WeatherCodeComparison() {
  return (
    <main style={{ maxWidth: 1000, margin: "32px auto", padding: 20, fontFamily: "sans-serif", color: "#172033" }}>
      <h1>Weather Example: Compare the Code</h1>
      <p>
        These are the two approaches used in the separate weather demos. Both
        can fetch weather; they start the request in different places.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <section style={panelStyle}>
          <h2>With useEffect</h2>
          <pre style={codeStyle}><code>{effectExample}</code></pre>
          <p>
            The effect watches <code>city</code>. Any code that changes that
            state causes the effect to fetch matching weather. Cleanup cancels
            a request made for an old city.
          </p>
        </section>

        <section style={panelStyle}>
          <h2>Without useEffect</h2>
          <pre style={codeStyle}><code>{noEffectExample}</code></pre>
          <p>
            The dropdown handler changes the city and fetches weather. If
            another button or component changes the city directly, it must also
            remember to fetch weather or the displayed result can be outdated.
          </p>
        </section>
      </div>

      <section style={{ marginTop: 18, padding: 18, background: "#eff6ff", borderRadius: 10, lineHeight: 1.6 }}>
        <h2>How much more code without useEffect?</h2>
        <p>
          For one dropdown, the handler approach can be shorter. But every place
          that changes the city must also handle loading, errors, and the fetch.
          As the app grows, this work may be repeated in more handlers. The
          effect keeps the rule “when city changes, load its weather” in one
          place.
        </p>
        <p>
          <strong>Important:</strong> useEffect is not always better. If a
          request should happen only after a specific action, such as pressing
          a “Search” button, fetching in that button's handler is often the
          clearest choice. Use an effect when you want to synchronize something
          with the component's current state, such as weather for the selected
          city.
        </p>
      </section>
    </main>
  );
}

export default WeatherCodeComparison;
