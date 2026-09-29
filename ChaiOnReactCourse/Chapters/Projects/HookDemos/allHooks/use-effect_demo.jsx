import React, { useState, useEffect } from "react";

// Array of 11 Team India players
const players = [
  "Suryakumar Yadav", "Abhishek Sharma", "Tilak Varma", "Sanju Samson", "Shivam Dube", 
  "Ishan Kishan", "Hardik Pandya", "Jasprit Bumrah", "Varun Chakaravarthy", "Kuldeep Yadav", 
  "Arshdeep Singh"
];

function UseEffectCricket() {
    const [score, setScore] = useState(0); // Total team score
    const [out, setOut] = useState(0);    // Total outs / current player index

    useEffect(() => {
        if (out < players.length) {
            console.log(`Current player: ${players[out]}`);
        } else {
            console.log("All players are out!");
        }
    }, [out]);

    // Reset game state
    const handleRestart = () => {
        setScore(0);
        setOut(0);
    };

    // Display current player or Game Over message
    const currentPlayerName = out < players.length-1 ? players[out] : "Game Over - All Out!";

    return (
        <div>
            <p>Team (Score): {score}/{out}</p>
            
            {/* H1 displays current player name */}
            <h1>{currentPlayerName}</h1>
            
            <button onClick={() => setScore(score + 1)}>TeamScore</button>
            
            <button 
                onClick={() => setOut(out + 1)}
                disabled={out >= players.length}
            >
                PlayerOut
            </button>

            <button onClick={handleRestart}>Restart Game</button>
        </div>
    );
};

export default UseEffectCricket;