import { useEffect, useState } from "react";

function AutoSaveDemo() {
  const [effectDraft, setEffectDraft] = useState("");
  const [effectSaved, setEffectSaved] = useState("");
  const effectStatus = !effectDraft
    ? "Waiting for input"
    : effectSaved === effectDraft
      ? "Saved automatically"
      : "Saving...";

  const [manualDraft, setManualDraft] = useState("");
  const [manualSaved, setManualSaved] = useState("");

  useEffect(() => {
    if (!effectDraft) return;

    const timer = window.setTimeout(() => {
      setEffectSaved(effectDraft);
    }, 800);

    return () => window.clearTimeout(timer);
  }, [effectDraft]);

  const handleEffectChange = (event) => {
    setEffectDraft(event.target.value);
  };

  const handleManualChange = (event) => {
    setManualDraft(event.target.value);
  };

  return (
    <main style={{ maxWidth: 900, margin: "24px auto", padding: 20 }}>
      <h1>useEffect: Auto-save vs. Manual Save</h1>
      <p>Type into both boxes and compare how each one saves.</p>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <section style={{ flex: "1 1 350px", border: "1px solid #aaa", padding: 16 }}>
          <h2>With useEffect</h2>
          <p>Draft saves automatically after you stop typing.</p>
          <textarea
            value={effectDraft}
            onChange={handleEffectChange}
            placeholder="Type a message..."
            rows={4}
            style={{ width: "100%" }}
          />
          <p>Status: {effectStatus}</p>
          <p>Saved text: {effectSaved || "(nothing saved yet)"}</p>
        </section>

        <section style={{ flex: "1 1 350px", border: "1px solid #aaa", padding: 16 }}>
          <h2>Without useEffect</h2>
          <p>Draft only saves when you click the button.</p>
          <textarea
            value={manualDraft}
            onChange={handleManualChange}
            placeholder="Type a message..."
            rows={4}
            style={{ width: "100%" }}
          />
          <button onClick={() => setManualSaved(manualDraft)}>Save</button>
          <p>Saved text: {manualSaved || "(nothing saved yet)"}</p>
        </section>
      </div>
    </main>
  );
}

export default AutoSaveDemo;