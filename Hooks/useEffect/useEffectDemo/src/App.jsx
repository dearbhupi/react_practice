import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

function App() {
  const [kill, setKill] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);

  function startNewGame() {
    console.log("game started");
  }
  //startGame(); move this function inside useEffect to avoid calling it on every render

  useEffect(() => {
    console.log("useEffect called when played died only Not when player score");
    startNewGame();
  }, [kill]); // this useEffect will only run when the 'kill' state changes, not when 'playerScore' changes


  return (
    <div className="App">
      <h1>useEffect Demo</h1>
      <button onClick={() => setKill(kill + 1)}>
        Player Died {kill}
      </button>

        <button onClick={() => setPlayerScore(playerScore + 1)}>
        Player Score {playerScore}
      </button>
    </div>
  );
}
export default App;
