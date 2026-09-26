import { useState } from "react";

function Demo1() {
  const [resourceType, setResourceType] = useState("post");

  return (
    <>
      <div>
        <button onClick={() => setResourceType("post")}>Post</button>
        <button onClick={() => setResourceType("users")}>Users</button>
        <button onClick={() => setResourceType("comment")}>Comment</button>
      </div>

      <h1>{resourceType}</h1>
    </>
  );
}

export default Demo1;