import { useEffect, useState } from "react";

function UseEffectResizeDemo() {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
    const updateViewportWidth = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", updateViewportWidth);

    return () => {
      window.removeEventListener("resize", updateViewportWidth);
    };
  }, []);

  const isCompact = viewportWidth < 600;
  const layoutName = isCompact ? "Compact" : "Wide";
  const cardStyle = {
    maxWidth: isCompact ? 320 : 600,
    margin: "20px auto",
    padding: 20,
    borderRadius: 12,
    backgroundColor: isCompact ? "#fff1c2" : "#dff5e1",
    color: "#222",
    textAlign: "center",
    transition: "all 200ms ease",
  };

  return (
    <section
      style={{
        maxWidth: 900,
        margin: "32px auto",
        padding: 20,
        fontFamily: "sans-serif",
      }}
    >
      <h1>useEffect Example: Live Window Resize</h1>
      <p>Resize the browser window and watch the demo respond.</p>

      <div style={cardStyle}>
        <h2>{layoutName} layout</h2>
        <p>Current viewport width: {viewportWidth}px</p>
        <p>{isCompact ? "The demo is using a compact layout." : "The demo is using a wide layout."}</p>
      </div>

      <aside
        style={{
          padding: 16,
          borderLeft: "4px solid #2563eb",
          backgroundColor: "#f3f4f6",
          lineHeight: 1.6,
        }}
      >
        <h2>Why useEffect helps here</h2>
        <p>
          The browser's resize event is outside React. The effect subscribes to
          that event when this component appears, then updates React state so
          the UI shows the latest width and layout.
        </p>
        <p>
          The cleanup function removes the event listener when the component
          goes away. This prevents an unused listener from remaining active.
        </p>
        <p>
          Without the effect and listener, reading <code>window.innerWidth</code>
          during render would not make React re-render when the browser is
          resized.
        </p>
      </aside>
    </section>
  );
}

export default UseEffectResizeDemo;
