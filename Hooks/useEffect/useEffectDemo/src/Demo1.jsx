import { useState , useEffect } from "react";

function Demo1() {
  const [resourceType, setResourceType] = useState("post");


  useEffect(() => {
    console.log("Resource type changed to:", resourceType);
    fetch(`https://jsonplaceholder.typicode.com/${resourceType}`)
      .then(response => response.json())
      .then(json => console.log(json))
  }, [resourceType]); // in [] we provide the values whenever the effect should re-run, e.g if player died, if amount changed etc

  return (
    <>
      <div>
        <button onClick={() => setResourceType("posts")}>Post</button>
        <button onClick={() => setResourceType("users")}>Users</button>
        <button onClick={() => setResourceType("comments")}>Comment</button>
      </div>

      <h1>{resourceType}</h1>
    </>
  );
}

export default Demo1;