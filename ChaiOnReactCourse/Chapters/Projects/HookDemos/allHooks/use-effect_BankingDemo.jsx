import { useEffect, useState } from "react";

// A local mock API: it behaves like a slow bank server without using real account data.
function fetchDemoBankAccount(signal) {
  return new Promise((resolve, reject) => {
    const timerId = window.setTimeout(() => {
      resolve({
        owner: "Alex Example",
        balance: 2480.75,
        transactions: [
          { id: 1, title: "Game shop", amount: -12.5 },
          { id: 2, title: "Allowance", amount: 50 },
          { id: 3, title: "Snacks", amount: -4.25 },
        ],
      });
    }, 900);

    if (signal) {
      const cancelRequest = () => {
        window.clearTimeout(timerId);
        reject(new DOMException("Request cancelled", "AbortError"));
      };

      if (signal.aborted) {
        cancelRequest();
      } else {
        signal.addEventListener("abort", cancelRequest, { once: true });
      }
    }
  });
}

function AccountDetails({ account }) {
  if (!account) return null;

  return (
    <div style={{ marginTop: 14, padding: 14, background: "#f8fafc", borderRadius: 10 }}>
      <p><strong>Account:</strong> {account.owner}</p>
      <p style={{ fontSize: 24, color: "#047857" }}>
        <strong>Balance: ${account.balance.toFixed(2)}</strong>
      </p>
      <h3>Recent activity</h3>
      <ul>
        {account.transactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.title}: {transaction.amount < 0 ? "-" : "+"}${Math.abs(transaction.amount).toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

const panelStyle = {
  flex: "1 1 300px",
  padding: 18,
  border: "1px solid #cbd5e1",
  borderRadius: 12,
  background: "white",
};

function AutomaticBankPanel() {
  const [account, setAccount] = useState(null);
  const [message, setMessage] = useState("Connecting to the demo bank...");

  useEffect(() => {
    const controller = new AbortController();

    fetchDemoBankAccount(controller.signal)
      .then((data) => {
        setAccount(data);
        setMessage("Loaded automatically when the dashboard opened.");
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setMessage("Could not load the demo account.");
        }
      });

    // If this panel closes before the response arrives, cancel the request.
    return () => controller.abort();
  }, []);

  return (
    <section style={panelStyle}>
      <h2>Dashboard A: with useEffect</h2>
      <p>Opens the account automatically when the dashboard appears.</p>
      <p role="status" aria-live="polite">{message}</p>
      <AccountDetails account={account} />
    </section>
  );
}

function ManualBankPanel() {
  const [account, setAccount] = useState(null);
  const [message, setMessage] = useState("The account has not been requested yet.");
  const [requestCount, setRequestCount] = useState(0);

  const handleCheckBalance = async () => {
    setMessage("Checking balance...");
    setRequestCount((count) => count + 1);

    try {
      const data = await fetchDemoBankAccount();
      setAccount(data);
      setMessage("Balance loaded after your button click.");
    } catch {
      setMessage("Could not load the demo account.");
    }
  };

  return (
    <section style={panelStyle}>
      <h2>Dashboard B: without useEffect</h2>
      <p>It waits until you ask to check the balance.</p>
      <button onClick={handleCheckBalance}>Check balance</button>
      <p>Button-started requests: {requestCount}</p>
      <p role="status" aria-live="polite">{message}</p>
      <AccountDetails account={account} />
    </section>
  );
}

function RenderFetchProblemDemo() {
  const [screenUpdates, setScreenUpdates] = useState(0);
  const hypotheticalRequests = screenUpdates + 1;

  return (
    <section style={{ ...panelStyle, flexBasis: "100%", background: "#fff7ed" }}>
      <h2>The banking bug to avoid: fetch during render</h2>
      <p>
        Safely simulate a dashboard re-render. No requests are sent by this
        simulation; it shows how many requests the bad pattern could start.
      </p>
      <button onClick={() => setScreenUpdates((count) => count + 1)}>
        Simulate a dashboard update
      </button>
      <p>Simulated updates: {screenUpdates}</p>
      <p>
        If fetch were placed directly in the component body, it could start
        about <strong>{hypotheticalRequests} request(s)</strong> across these
        simulated renders. In the real bad pattern, a response that updates
        state causes another render, which can start another request again.
      </p>
      <pre style={{ overflowX: "auto", padding: 12, background: "#1e293b", color: "white", borderRadius: 8 }}>
        <code>{`// Do not do this in a component body:
function BankDashboard() {
  fetchBalance().then(setBalance); // runs on every render
  return <div>...</div>;
}`}</code>
      </pre>
    </section>
  );
}

function BankingUseEffectDemo() {
  return (
    <main style={{ maxWidth: 1000, margin: "32px auto", padding: 20, fontFamily: "sans-serif", color: "#172033" }}>
      <h1>Banking App: Why useEffect Helps</h1>
      <p>
        This is a pretend bank account with sample data only—no real bank,
        account, or password is used.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <AutomaticBankPanel />
        <ManualBankPanel />
        <RenderFetchProblemDemo />
      </div>

      <section style={{ marginTop: 20, padding: 18, background: "#eff6ff", borderRadius: 12, lineHeight: 1.6 }}>
        <h2>The real-life version</h2>
        <p>
          Imagine opening your banking app. You expect your balance to load
          automatically. <strong>useEffect</strong> is like telling the app:
          “After this account screen appears, ask the bank for the balance.”
          When the response arrives, React updates the screen.
        </p>
        <p>
          Without an effect, the balance does not automatically load unless
          you start the request from an event, like the Check balance button.
          That button approach is correct when the user chooses the action.
        </p>
        <p>
          The dangerous approach is starting the request in the component body.
          A response updates state, state causes a render, and that render starts
          another request. This can waste requests, hit API limits, and make
          loading confusing. The effect runs for the screen lifecycle instead,
          and its cleanup cancels a request if the screen goes away.
        </p>
      </section>
    </main>
  );
}

export default BankingUseEffectDemo;