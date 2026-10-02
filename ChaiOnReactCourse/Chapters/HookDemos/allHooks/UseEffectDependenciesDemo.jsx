import { useEffect, useState } from "react";

const examples = [
  {
    title: "No dependency array",
    code: `useEffect(() => {
  console.log("runs after every render");
});`,
    description: "Runs after every render of this component.",
    color: "#b45309",
  },
  {
    title: "Empty dependency array",
    code: `useEffect(() => {
  console.log("runs after mount");
}, []);`,
    description: "Runs when the component mounts. Cleanup runs when it unmounts.",
    color: "#047857",
  },
  {
    title: "One state dependency",
    code: `useEffect(() => {
  console.log(count);
}, [count]);`,
    description: "Runs after the first render, then when count changes.",
    color: "#1d4ed8",
  },
  {
    title: "State and prop dependencies",
    code: `useEffect(() => {
  console.log(userName, city);
}, [userName, city]);`,
    description: "Runs after the first render, then when either userName or city changes.",
    color: "#9d174d",
  },
];

function StateAndPropExample({ userName }) {
  const [city, setCity] = useState("Toronto");

  useEffect(() => {
    console.log(`State and prop dependencies: ${city}, ${userName}`);
  }, [city, userName]);

  return (
    <section style={{ marginTop: 16, padding: 16, borderLeft: "4px solid #9d174d", background: "#fdf2f8" }}>
      <h3>Child component: effect watches a prop and its own state</h3>
      <p>Parent-provided name prop: <strong>{userName}</strong></p>
      <label>
        Child's city state: {" "}
        <select value={city} onChange={(event) => setCity(event.target.value)}>
          <option>Toronto</option>
          <option>Paris</option>
          <option>Tokyo</option>
        </select>
      </label>
      <p>Changing either the name or city runs the child's effect.</p>
    </section>
  );
}

function UseEffectDependenciesDemo() {
  const [count, setCount] = useState(0);
  const [userName, setUserName] = useState("Alex");

  useEffect(() => {
    console.log("No dependency array: ran after this render");
  });

  useEffect(() => {
    console.log("Empty array: mounted (and cleaned up on unmount)");
    return () => console.log("Empty array: cleanup on unmount");
  }, []);

  useEffect(() => {
    console.log(`One state dependency: count is ${count}`);
  }, [count]);

  const changeUserName = () => {
    setUserName((currentName) => currentName === "Alex" ? "Sam" : "Alex");
  };

  return (
    <main style={{ maxWidth: 1000, margin: "32px auto", padding: 20, fontFamily: "sans-serif", color: "#172033" }}>
      <h1>useEffect Dependency Explorer</h1>
      <p>
        A dependency array tells React when an effect needs to run again. Try
        the controls, then look at the browser console to see the matching logs.
      </p>

      <section style={{ padding: 18, background: "#f1f5f9", borderRadius: 8 }}>
        <h2>Change some values</h2>
        <p>Count state: <strong>{count}</strong></p>
        <button onClick={() => setCount((currentCount) => currentCount + 1)}>
          Increase count
        </button>
        <p>Parent state used as the child's name prop: <strong>{userName}</strong></p>
        <button onClick={changeUserName}>Change name prop</button>
      </section>

      <StateAndPropExample userName={userName} />

      <h2>Four dependency patterns</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: 12 }}>
        {examples.map((example) => (
          <section key={example.title} style={{ padding: 16, borderTop: `4px solid ${example.color}`, background: "white", boxShadow: "0 1px 4px #0002" }}>
            <h3>{example.title}</h3>
            <pre style={{ overflowX: "auto", padding: 12, background: "#172033", color: "#f8fafc", borderRadius: 6 }}>
              <code>{example.code}</code>
            </pre>
            <p>{example.description}</p>
          </section>
        ))}
      </div>

      <section style={{ marginTop: 18, padding: 18, background: "#fff7ed", borderRadius: 8, lineHeight: 1.6 }}>
        <h2>How to read this example</h2>
        <ul>
          <li>Increase count: the no-array effect and the <code>[count]</code> effect run.</li>
          <li>Change the child's city: the <code>[city, userName]</code> effect runs.</li>
          <li>Change the parent's name prop: the child's <code>[city, userName]</code> effect runs.</li>
          <li>The empty-array effect does not run again for these updates.</li>
        </ul>
        <p>
          Effects run after React renders and commits the UI. On the first mount,
          all four effects run. In this project, <code>StrictMode</code> is on, so
          React may run effect setup an extra time in development to help find
          missing cleanup. This extra check does not happen in production.
        </p>
      </section>
    </main>
  );
}

export default UseEffectDependenciesDemo;
