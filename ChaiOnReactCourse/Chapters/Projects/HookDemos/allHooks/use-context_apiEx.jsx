import React, { useState, useEffect, createContext, useContext } from 'react';

// 1. Create the VIP Wristband (Context)
const UserContext = createContext();

function UseContextAppAPI() {
  const [user, setUser] = useState(null);

  // Use the effect hook we learned earlier to fetch data from our "API"
  useEffect(() => {
    // We use setTimeout to fake a 2-second API loading delay
    setTimeout(() => {
      // The API returns this user data!
      setUser({
        name: "CaptainCoder",
        avatar: "🚀",
        coins: 500
      });
    }, 10000); 
  }, []); // Empty array means this fetch only happens once when the app starts

  return (
    // 2. Put the fetched user data inside the VIP Wristband (Provider)
    <UserContext.Provider value={user}>
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>Pixel Theme Park</h1>
        
        {/* Notice we are NOT passing user={user} to NavBar or ArcadeRoom! */}
        <NavBar />
        <ArcadeRoom />
      </div>
    </UserContext.Provider>
  );
}

// --- CHILD COMPONENT 1 ---
function NavBar() {
  // 3. Reach into the Context to see if the user is loaded
  const user = useContext(UserContext);

  return (
    <nav style={{ background: '#333', color: 'white', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
      <strong>Theme Park Map</strong>
      {/* If the API hasn't loaded yet, user is null, so we show "Logging in..." */}
      <span>{user ? `${user.avatar} Welcome, ${user.name}` : "Logging in..."}</span>
    </nav>
  );
}

// --- CHILD COMPONENT 2 ---
function ArcadeRoom() {
  return (
    <div style={{ marginTop: '20px', padding: '20px', background: '#f0f0f0', borderRadius: '10px' }}>
      <h2>🕹️ The Arcade Room</h2>
      <p>Step right up to play!</p>
      
      {/* ArcadeRoom doesn't need the user data, but the GameMachine inside it does! */}
      <GameMachine />
    </div>
  );
}

// --- GRANDCHILD COMPONENT ---
function GameMachine() {
  // 3. Tap the VIP Wristband again! We can grab the user deep inside the app.
  const user = useContext(UserContext);

  // Don't let them play if the API hasn't finished loading!
  if (!user) {
    return <p>Please wait at the gate...</p>;
  }

  return (
    <div style={{ padding: '15px', background: 'gold', borderRadius: '8px', display: 'inline-block', border: '3px solid orange' }}>
      <h3>Space Invaders 👾</h3>
      <p><strong>Current Player:</strong> {user.name}</p>
      <p><strong>Arcade Coins:</strong> {user.coins} 🪙</p>
      <button style={{ padding: '10px', background: 'red', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
        Insert Coin
      </button>
    </div>
  );
}

export default UseContextAppAPI;




// Imagine going to a giant theme park like Disney World. When you walk through the front gates, you scan your ticket and they give you a Magic VIP Wristband.

// Instead of showing your paper ticket to the security guard at every single ride, restaurant, or gift shop (which is like prop drilling in React), you just tap your wristband. Every ride automatically knows your name, your fast-passes, and how many arcade coins you have.

// In this example, our API is the front gate (fetching your user profile), and useContext is the Magic VIP Wristband that lets any component in the app know who you are without passing props down the chain.

// Here is how we use useEffect to fetch a user from an API, and useContext to share that user everywhere:
// Why this is so powerful for APIs:
// The Fetch Happens Once: The App component acts like the front gate. It runs useEffect one time to talk to the API and get the user data.

// Skipping the Middleman: Look at the ArcadeRoom component. It doesn't care about the user data at all, so we don't have to give it any props!

// Instant Updates: GameMachine and NavBar both use useContext(UserContext). For the first 2 seconds, they both see null and show loading messages. The exact second the API finishes and setUser updates the state, the VIP Wristband lights up, and both components instantly redraw themselves to show CaptainCoder's name and coins!