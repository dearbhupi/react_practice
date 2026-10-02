import { useEffect, useState } from "react";

function GameDemo({ useEffectVersion }) {
  const [game, setGame] = useState({
    status: "Not started",
    health: 100,
    power: 0,
    eventId: 0,
    lastEvent: "",
  });

  useEffect(() => {
    if (!useEffectVersion || game.eventId === 0) return;

    // Side effect: respond after game state changes.
    console.log(`[useEffect] ${game.lastEvent}`);
  }, [game.eventId, game.lastEvent, useEffectVersion]);

  const runAction = (action) => {
    // Without useEffect, each event handler performs the side effect itself.
    if (!useEffectVersion) {
      console.log(`[Without useEffect] ${action}`);
    }

    setGame((previousGame) => {
      switch (action) {
        case "startNewGame":
          return {
            status: "Playing",
            health: 100,
            power: 0,
            eventId: previousGame.eventId + 1,
            lastEvent: "New game started",
          };

        case "playerDied":
          if (previousGame.status !== "Playing") return previousGame;
          return {
            ...previousGame,
            status: "Game Over",
            health: 0,
            eventId: previousGame.eventId + 1,
            lastEvent: "Player died",
          };

        case "playerGetPower":
          if (previousGame.status !== "Playing") return previousGame;
          return {
            ...previousGame,
            power: previousGame.power + 1,
            eventId: previousGame.eventId + 1,
            lastEvent: "Player got power",
          };

        default:
          return previousGame;
      }
    });
  };

  return (
    <section style={{ border: "1px solid #aaa", padding: 16, margin: 12 }}>
      <h2>{useEffectVersion ? "With useEffect" : "Without useEffect"}</h2>
      <p>Status: {game.status}</p>
      <p>Health: {game.health}</p>
      <p>Power-ups: {game.power}</p>

      <button onClick={() => runAction("startNewGame")}>Start New Game</button>{" "}
      <button
        onClick={() => runAction("playerDied")}
        disabled={game.status !== "Playing"}
      >
        Player Died
      </button>{" "}
      <button
        onClick={() => runAction("playerGetPower")}
        disabled={game.status !== "Playing"}
      >
        Get Power
      </button>
    </section>
  );
}

function UseEffectGame() {
  return (
    <main style={{ maxWidth: 800, margin: "20px auto", padding: 16 }}>
      <h1>Game Events: With and Without useEffect</h1>

      <p>
        <strong>With useEffect:</strong> event handlers update game state.
        useEffect watches for changes and then logs the event.
      </p>
      <p>
        <strong>Without useEffect:</strong> event handlers update game state
        and log the event directly.
      </p>
      <p>
        In this example, logging represents a side effect. useEffect is useful
        when an effect should happen in response to state changes, rather than
        being repeated in multiple event handlers.
      </p>

      <GameDemo useEffectVersion={true} />
      <GameDemo useEffectVersion={false} />
    </main>
  );
}

export default UseEffectGame;