import React, { useState, useEffect } from "react";

function UseEffectDemo() {
  const [timeRemaining, setTimeRemaining] = useState(10);
  const gameState = timeRemaining <= 0 ? "Game Over!" : "Playing";

  useEffect(() => {
    if (timeRemaining <= 0) {
      return;
    }

    const countdown = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(countdown);
    };
  }, [timeRemaining]); // here timeRemaining is the dependency, when it changes to zero, the interval is cleared and the game over state is triggered   



  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>useEffect Demo</h1>
      <h2>Status: {gameState}</h2>
      <h1>{timeRemaining}</h1>
    <button onClick={() => setTimeRemaining(timeRemaining - 1)}>-</button>
      <button onClick={() => setTimeRemaining(0)}>Reset</button>
      <button onClick={() => setTimeRemaining(timeRemaining + 1)}>+</button>

      {timeRemaining > 0 ? (
        <p>Defeat the boss before time runs out!</p>
      ) : (
        <p>You failed.</p>
      )}

    </div>
  );
}

export default UseEffectDemo;

// How this applies to a game:
// The Background Loop: Games rely on loops running in the background. setInterval acts as our game tick, updating the time every second. useEffect is the proper place to house these side effects so they don't block the React rendering process.

// The Cleanup Function (return () => clearInterval(...)): This is essential in game development. If the player navigates away from this level to the main menu, the GameLevel component unmounts. Without the cleanup function, the interval would keep ticking in the background forever, causing errors and draining performance.

// The Dependency Array ([timeRemaining]): Every time the timer ticks down, React updates the state, re-renders the UI, and then checks this array. Seeing that timeRemaining is a new number, it cleans up the old interval and starts a fresh one for the next second.