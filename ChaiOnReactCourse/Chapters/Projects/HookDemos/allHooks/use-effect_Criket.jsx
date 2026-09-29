import React, { useState, useEffect } from "react";

// Array of 11 Team India players
const players = [
  "Suryakumar Yadav", "Abhishek Sharma", "Tilak Varma", "Sanju Samson", "Shivam Dube", 
  "Ishan Kishan", "Hardik Pandya", "Jasprit Bumrah", "Varun Chakaravarthy", "Kuldeep Yadav", 
  "Arshdeep Singh"
];

function UseEffectCricket() {
    const [playerScores, setPlayerScores] = useState(Array(players.length).fill(0));
    const [out, setOut] = useState(0); // Current batter index / total outs

    const totalScore = playerScores.reduce((sum, runs) => sum + runs, 0);

    // Game is over when all 11 players are out
    const isGameOver = out >= players.length -1;

    useEffect(() => {
        if (!isGameOver) {
            console.log(`Current player: ${players[out]}`);
        } else {
            console.log("All players are out!");
        }
    }, [out, isGameOver]);

    const handleAddScore = () => {
        // Prevent adding runs if the game is over
        if (!isGameOver) {
            setPlayerScores((prevScores) => {
                const updatedScores = [...prevScores];
                updatedScores[out] += 1;
                return updatedScores;
            });
        }
    };

    const handleRestart = () => {
        setPlayerScores(Array(players.length).fill(0));
        setOut(0);
    };

    const currentPlayerName = isGameOver ? "Game Over - All Out!" : players[out];

    return (
        <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
            <h2>Team (Score): {totalScore} / {out}</h2>
            
            <h1>{currentPlayerName}</h1>

            {/* Last Player Dismissed Banner */}
            {out > 0 && (
                <div style={{ 
                    marginBottom: "15px", 
                    padding: "10px", 
                    backgroundColor: "#f0f0f0", 
                    borderRadius: "5px",
                    display: "inline-block"
                }}>
                    <strong>Last Player Dismissed:</strong> {players[out - 1]} — {playerScores[out - 1]} run(s)
                </div>
            )}
            
            <div style={{ marginBottom: "20px" }}>
                {/* Score button disabled when game is over */}
                <button onClick={handleAddScore} disabled={isGameOver}>
                    +1 Run (Score)
                </button>
                {" "}
                {/* Out button disabled when game is over */}
                <button onClick={() => setOut(out + 1)} disabled={isGameOver}>
                    Player Out
                </button>
                {" "}
                <button onClick={handleRestart}>Restart Game</button>
            </div>

            {/* Scorecard Component */}
            <h3>Scorecard</h3>
            <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", maxWidth: "500px" }}>
                <thead>
                    <tr style={{ backgroundColor: "#f2f2f2", textAlign: "left" }}>
                        <th>#</th>
                        <th>Player Name</th>
                        <th>Runs</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map((name, index) => {
                        let status = "Yet to Bat";
                        if (index < out) {
                            status = "Out";
                        } else if (index === out) {
                            status = "Batting";
                        }

                        return (
                            <tr key={index} style={{ backgroundColor: index === out && !isGameOver ? "#e6f7ff" : "transparent" }}>
                                <td>{index + 1}</td>
                                <td>{name}</td>
                                <td>{playerScores[index]}</td>
                                <td><strong>{status}</strong></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default UseEffectCricket;