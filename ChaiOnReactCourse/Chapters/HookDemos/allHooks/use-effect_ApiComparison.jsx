import { useEffect, useState } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/users/1";

async function fetchUser(signal) {
  const response = await fetch(API_URL, { signal });
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return response.json();
}

function UserDetails({ user }) {
  if (!user) return <p>No user data loaded yet.</p>;

  return (
    <div style={{ marginTop: 12, padding: 12, background: "#f1f5f9", borderRadius: 8 }}>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>City:</strong> {user.address.city}</p>
    </div>
  );
}

function AutoFetchPanel() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("Loading user...");

  useEffect(() => {
    const controller = new AbortController();

    fetchUser(controller.signal)
      .then((data) => {
        setUser(data);
        setMessage("User loaded automatically when this panel appeared.");
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setMessage(`Could not load user: ${error.message}`);
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <section style={panelStyle}>
      <h2>With useEffect: load automatically</h2>
      <p>The request starts when this panel appears.</p>
      <p role="status" aria-live="polite">{message}</p>
      <UserDetails user={user} />
    </section>
  );
}

function ClickToFetchPanel() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("Click the button to request a user.");

  const handleFetchUser = async () => {
    setMessage("Loading user...");
    try {
      const data = await fetchUser();
      setUser(data);
      setMessage("User loaded after your button click.");
    } catch (error) {
      setMessage(`Could not load user: ${error.message}`);
    }
  };

  return (
    <section style={panelStyle}>
      <h2>Without useEffect: load on click</h2>
      <p>This request happens only when you choose to start it.</p>
      <button onClick={handleFetchUser}>Fetch user</button>
      <p role="status" aria-live="polite">{message}</p>
      <UserDetails user={user} />
    </section>
  );
}

const panelStyle = {
  flex: "1 1 320px",
  padding: 18,
  border: "1px solid #cbd5e1",
  borderRadius: 12,
  backgroundColor: "white",
};

function UseEffectApiComparison() {
  return (
    <main style={{ maxWidth: 950, margin: "32px auto", padding: 20, fontFamily: "sans-serif" }}>
      <h1>Fetching API Data: With and Without useEffect</h1>
      <p>
        Both examples request the same sample user from JSONPlaceholder. Try the
        button in the right panel and compare it with the automatic request on
        the left.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <AutoFetchPanel />
        <ClickToFetchPanel />
      </div>

      <section style={{ marginTop: 20, padding: 18, background: "#fff7ed", borderRadius: 12, lineHeight: 1.6 }}>
        <h2>What problem can happen without useEffect?</h2>
        <p>
          If data should load when a component first appears, putting fetch
          directly in the component body is a bad idea. The body runs again on
          every render. When the response updates state, React renders again,
          which can start another request and repeat the cycle.
        </p>
        <pre style={{ overflowX: "auto", padding: 12, background: "#1e293b", color: "white", borderRadius: 8 }}>
          <code>{`// Avoid fetching directly during render
function UserPanel() {
  fetch(API_URL).then(setUser); // runs on every render
  return <div>...</div>;
}`}</code>
        </pre>
        <p>
          <strong>Simple rule:</strong> useEffect is useful when a request should
          happen because the component appeared or some watched value changed.
          If a user clicks a button to request something, fetching in that click
          handler—as shown on the right—is appropriate; you do not need an effect
          for every API request.
        </p>
        <p>
          The left example also cancels its request during cleanup, such as if
          the panel is removed before the response arrives.
        </p>
      </section>
    </main>
  );
}

export default UseEffectApiComparison;
