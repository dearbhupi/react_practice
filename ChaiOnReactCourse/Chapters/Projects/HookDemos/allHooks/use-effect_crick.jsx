import React, { useState, useEffect } from "react";

// Array of 11 Team India players
const players = [
  "Suryakumar Yadav", "Abhishek Sharma", "Tilak Varma", "Sanju Samson", "Shivam Dube", 
  "Ishan Kishan", "Hardik Pandya", "Jasprit Bumrah", "Varun Chakaravarthy", "Kuldeep Yadav", 
  "Arshdeep Singh"
];

function UseEffectCricket() {
    const [playerScore, setPlayerScore] = useState(0); // Total team score
    const [playerout, setPlayerOut] = useState(0);    // Total outs / current player index

    useEffect(() => {
        if (playerout < players.length) {
            console.log(`Current player: ${players[playerout]}`);
        } else {
            console.log("All players are out!");
        }
    }, [playerout]);

    // Reset game state
    const handleRestart = () => {
        setPlayerScore(0);
        setPlayerOut(0);
    };

    // Display current player or Game Over message
    const currentPlayerName = playerout < players.length-1 ? players[playerout] : "Game Over - All Out!";

    return (
        <div>
            <p>Team (Score/out): {playerScore}/{playerout}</p>
            
            {/* H1 displays current player name */}
            <h1>{currentPlayerName}</h1>
            
            <button onClick={() => setPlayerScore(playerScore + 1)}>TeamScore</button>
            
            <button 
                onClick={() => setPlayerOut(playerout + 1)}
                disabled={playerout >= players.length}
            >
                PlayerOut
            </button>

            <button onClick={handleRestart}>Restart Game</button>
        </div>
    );
};

export default UseEffectCricket;