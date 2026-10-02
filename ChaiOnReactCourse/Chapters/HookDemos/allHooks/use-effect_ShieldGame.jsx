import { useEffect, useState } from "react";

const panelStyle = {
  flex: "1 1 280px",
  padding: 20,
  border: "2px solid #cbd5e1",
  borderRadius: 14,
  backgroundColor: "white",
};

function AutoShieldGame() {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft === 0) return;

    const timerId = window.setTimeout(() => {
      setSecondsLeft((seconds) => seconds - 1);
    }, 1000);

    // Cancel this tick before starting another one or leaving the game.
    return () => window.clearTimeout(timerId);
  }, [secondsLeft]);

  const shieldIsOn = secondsLeft > 0;

  return (
    <section style={panelStyle}>
      <h2>Game A: Auto shield (with useEffect)</h2>
      <p style={{ fontSize: 42, margin: "12px 0" }}>
        {shieldIsOn ? "🧍🛡️" : "🧍"}
      </p>
      <p>Shield: {shieldIsOn ? "ON" : "OFF"}</p>
      <p>Time left: {secondsLeft} seconds</p>
      <button onClick={() => setSecondsLeft(5)}>Collect 5-second shield</button>
      <p>The shield turns off by itself when the timer reaches zero.</p>
    </section>
  );
}

function ManualShieldGame() {
  const [shieldIsOn, setShieldIsOn] = useState(false);

  return (
    <section style={panelStyle}>
      <h2>Game B: Manual shield (without useEffect)</h2>
      <p style={{ fontSize: 42, margin: "12px 0" }}>
        {shieldIsOn ? "🧍🛡️" : "🧍"}
      </p>
      <p>Shield: {shieldIsOn ? "ON" : "OFF"}</p>
      <button onClick={() => setShieldIsOn(true)}>Collect shield</button>{" "}
      <button onClick={() => setShieldIsOn(false)} disabled={!shieldIsOn}>
        Turn shield off
      </button>
      <p>This shield stays on until you turn it off yourself.</p>
    </section>
  );
}

function UseEffectShieldGame() {
  return (
    <main
      style={{
        maxWidth: 900,
        margin: "32px auto",
        padding: 20,
        fontFamily: "sans-serif",
        color: "#172033",
      }}
    >
      <h1>Learn useEffect with a Game Shield</h1>
      <p>
        Try both games. The difference is that Game A has a timer that turns the
        shield off for you.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <AutoShieldGame />
        <ManualShieldGame />
      </div>

      <section
        style={{
          marginTop: 20,
          padding: 20,
          borderRadius: 14,
          backgroundColor: "#eff6ff",
          lineHeight: 1.6,
        }}
      >
        <h2>Think of useEffect as the game's clock ⏱️</h2>
        <ol>
          <li>You collect the shield, and React stores 5 seconds in state.</li>
          <li>useEffect notices the timer state and schedules one second to pass.</li>
          <li>The timer updates state; React redraws the countdown.</li>
          <li>When it reaches zero, the shield turns off automatically.</li>
        </ol>
        <p>
          <strong>Why is this useful?</strong> The button handles the player's
          action (collecting a shield). useEffect handles the background timer.
          Its cleanup cancels the old timer before the next tick, preventing
          stray timers from running.
        </p>
        <p>
          The UI changes because React state changes. useEffect is useful here
          because it starts and cleans up the timer that changes that state.
        </p>
      </section>
    </main>
  );
}

export default UseEffectShieldGame;
