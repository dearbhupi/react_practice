import React from "react";

function UseContextvsuseEffect() {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        lineHeight: "1.7",
        fontSize: "18px",
        color: "#1f2937",
      }}
    >
      <p>
        The easiest way to remember the difference is that{" "}
        <strong>useEffect is for DOING things</strong>, and{" "}
        <strong>useContext is for SHARING things.</strong>
      </p>

      <p>Here is how to think about them side-by-side:</p>

      <h3>useEffect: The Action Robot 🤖</h3>
      <p>
        <strong>useEffect</strong> is like a tiny robot that watches your app and
        waits for a specific moment to trigger an action (a "side effect").
      </p>

      <ul>
        <li>
          <strong>What it does:</strong> It runs background tasks.
        </li>
        <li>
          <strong>When you use it:</strong> When you need to talk to the outside
          world.
        </li>
        <li>
          <strong>Real-life example:</strong> "When the clock strikes 7:00 AM,
          turn on the coffee maker."
        </li>
        <li>
          <strong>Coding example:</strong> "When this component loads, fetch the
          user's high score from the database," or "Every time the timer counts
          down, play a ticking sound."
        </li>
      </ul>

      <h3>useContext: The Magic Walkie-Talkie 📻</h3>
      <p>
        <strong>useContext</strong> does not perform actions or run background
        tasks. It is purely a teleportation device for your data.
      </p>

      <ul>
        <li>
          <strong>What it does:</strong> It shares data anywhere in your app
          without passing it down step-by-step (prop drilling).
        </li>
        <li>
          <strong>When you use it:</strong> When lots of different components
          need to know the same piece of information.
        </li>
        <li>
          <strong>Real-life example:</strong> A school principal speaking over
          the intercom. Everyone in every classroom can hear the announcement at
          the same time.
        </li>
        <li>
          <strong>Coding example:</strong> "The user logged in. Let the NavBar
          show their avatar, let the GameRoom load their coins, and let the
          Settings page show their email."
        </li>
      </ul>

      <h3>The Quick Summary</h3>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #d1d5db", padding: "8px" }}>Feature</th>
            <th style={{ border: "1px solid #d1d5db", padding: "8px" }}>
              useEffect (The Robot)
            </th>
            <th style={{ border: "1px solid #d1d5db", padding: "8px" }}>
              useContext (The Walkie-Talkie)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #d1d5db", padding: "8px" }}>
              Main Job
            </td>
            <td style={{ border: "1px solid #d1d5db", padding: "8px" }}>
              Runs code in the background when things change.
            </td>
            <td style={{ border: "1px solid #d1d5db", padding: "8px" }}>
              Shares data across the whole app.
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #d1d5db", padding: "8px" }}>
              Action vs Data
            </td>
            <td style={{ border: "1px solid #d1d5db", padding: "8px" }}>
              Action (Fetching data, setting timers, changing the title).
            </td>
            <td style={{ border: "1px solid #d1d5db", padding: "8px" }}>
              Data (Holding the theme, user profile, or language).
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #d1d5db", padding: "8px" }}>
              Does it run loops?
            </td>
            <td style={{ border: "1px solid #d1d5db", padding: "8px" }}>
              Yes, it can run intervals and timers.
            </td>
            <td style={{ border: "1px solid #d1d5db", padding: "8px" }}>
              No, it just holds a value.
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{ marginTop: "20px" }}>
        Often, they work together! You might use <strong>useEffect</strong> to
        <strong> fetch</strong> a user's data from an API, and then put that data
        into <strong>useContext</strong> so the rest of your app can{" "}
        <strong>share</strong> it.
      </p>
    </div>
  );
}

export default UseContextvsuseEffect;