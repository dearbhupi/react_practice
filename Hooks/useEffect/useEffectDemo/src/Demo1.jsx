import { useState, useEffect } from "react";

function Demo1() {
  const [resourceType, setResourceType] = useState("posts");
  const [data, setData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);

  const updateResourceType = (type) => {
    setResourceType(type);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    console.log("Resource type changed to:", resourceType);

    fetch(`https://jsonplaceholder.typicode.com/${resourceType}`)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setData(json);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      });
  }, [resourceType]);

  return (
    <>
      <div>
        <p>Window width: {windowWidth}</p>
        <button onClick={() => updateResourceType("posts")}>Post</button>
        <button onClick={() => updateResourceType("users")}>Users</button>
        <button onClick={() => updateResourceType("comments")}>Comment</button>
      </div>

      <h1>{resourceType}</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id ?? `${resourceType}}`}>
            {JSON.stringify(item)}
          </li>
        ))}
      </ul>
    </>
  );
}

export default Demo1;