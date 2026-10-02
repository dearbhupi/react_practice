import { useState, useEffect } from 'react';

function ApiDataFetcher() {
  const [resourceType, setResourceType] = useState('posts');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleResourceChange = (nextResourceType) => {
    setIsLoading(true);
    setResourceType(nextResourceType);
  };

  useEffect(() => {
    // Fetch data from the API based on the current resourceType
    fetch(`https://jsonplaceholder.typicode.com/${resourceType}`)
      .then(response => response.json())
      .then(data => {
        setItems(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });

  }, [resourceType]); // The effect re-runs whenever resourceType changes

  return (

    <>
    <h1>API Data Fetcher useEffect Demo</h1>
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => handleResourceChange('users')}>Users</button>
        <button onClick={() => handleResourceChange('posts')}>Posts</button>
        <button onClick={() => handleResourceChange('comments')}>Comments</button>
      </div>

      <h2>Current Resource: {resourceType.toUpperCase()}</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {items.slice(0, 10).map((item) => (
            <li key={item.id} style={{ marginBottom: '10px' }}>
              {/* Users use 'name', Posts and Comments use 'title' or 'name' */}
              <strong>{item.name || item.title}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
    </>
  );
}

export default ApiDataFetcher;

// How the data fetch cycle works
// State Drives the Fetch: The component holds a piece of state called resourceType. When a user clicks a button, setResourceType changes this string to 'users', 'posts', or 'comments'.

// The Dependency Trigger: The useEffect hook has [resourceType] in its dependency array. React sees that resourceType changed from 'posts' to 'users', so it fires the effect function again.

// The API Request: Inside the effect, the string literal [https://jsonplaceholder.typicode.com/$](https://jsonplaceholder.typicode.com/$){resourceType} dynamically injects the current state into the URL, requesting the correct endpoint.

// Updating the UI: Once the data returns, setItems(data) updates the component's data array, causing React to re-render the list on the screen to show the new items.