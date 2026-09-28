// // // // // import { useState, createContext, useContext } from 'react';

// // // // // // 1. Create the Magic Backpack (Context)
// // // // // // We set it up outside the components so everyone can see it.
// // // // // const ThemeContext = createContext();

// // // // // function UseContextApp() {
// // // // //   const [theme, setTheme] = useState("☀️ Day Mode");

// // // // //   return (
// // // // //     // 2. Put our data inside the backpack using the "Provider"
// // // // //     <ThemeContext.Provider value={theme}>
// // // // //       <div style={{ padding: '20px', border: '5px solid blue' }}>
// // // // //         <h1>My Awesome App</h1>
        
// // // // //         <button onClick={() => setTheme(theme === "☀️ Day Mode" ? "🌙 Night Mode" : "☀️ Day Mode")}>
// // // // //           Flip the Light Switch!
// // // // //         </button>
        
// // // // //         {/* Notice how we are NOT passing the theme to the SecretRoom! */}
// // // // //         <SecretRoom />
// // // // //       </div>
// // // // //     </ThemeContext.Provider>
// // // // //   );
// // // // // }

// // // // // function SecretRoom() {
// // // // //   // 3. Reach into the Magic Backpack to grab the data!
// // // // //   const currentTheme = useContext(ThemeContext);

// // // // //   return (
// // // // //     <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'lightgray' }}>
// // // // //       <h2>Welcome to the Secret Room!</h2>
// // // // //       {/* We can use the theme even though App never handed it to us directly! */}
// // // // //       <p>The current magic theme is: <strong>{currentTheme}</strong></p>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // export default UseContextApp;


// // // // // // The 3 Steps to Context Magic:

// // // // // // Imagine you want to pass a secret note to your friend on the other side of the classroom. Normally, you have to hand the note to the kid next to you, who passes it to the next kid, until it finally reaches your friend. In React, this is called "prop drilling," and if you have a lot of components, it gets really annoying!

// // // // // // useContext is like having a magic teleporting backpack. You put your data (like a color theme, a user's name, or a score) into the backpack at the very top of your app. Then, any component anywhere in your app can just reach into the backpack and grab it.

// // // // // // Here is how you use the magic backpack to share a "Day" or "Night" theme:
// // // // // // createContext(): This is where you actually sew the magic backpack. We called ours ThemeContext.

// // // // // // <ThemeContext.Provider value="{...}">: This is you zipping the backpack closed with your data inside. Anything wrapped inside this Provider (like our SecretRoom) is allowed to open the backpack.

// // // // // // useContext(ThemeContext): This is the spell you cast inside SecretRoom to open the backpack and pull out whatever is inside value. If you click the button in App to change the theme, the SecretRoom instantly updates to show the new value!


// // // // import React, { useState, createContext, useContext } from 'react';

// // // // // 1. Create the Magic Backpack (Context)
// // // // const ThemeContext = createContext();

// // // // function UseDarkModeApp() {
// // // //   // Let's use simple words for our theme this time
// // // //   const [theme, setTheme] = useState("light");

// // // //   return (
// // // //     // 2. Put the theme inside the backpack
// // // //     <ThemeContext.Provider value={theme}>
// // // //       <div style={{ padding: '20px', border: '5px solid blue' }}>
// // // //         <h1>My Awesome App</h1>
        
// // // //         {/* If it's light, change to dark. If it's dark, change to light! */}
// // // //         <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
// // // //           Flip the Light Switch!
// // // //         </button>
        
// // // //         <SecretRoom />
// // // //       </div>
// // // //     </ThemeContext.Provider>
// // // //   );
// // // // }

// // // // function SecretRoom() {
// // // //   // 3. Reach into the Magic Backpack to grab the theme!
// // // //   const currentTheme = useContext(ThemeContext);

// // // //   // Set up our styles based on the theme
// // // //   const roomStyle = {
// // // //     marginTop: '20px',
// // // //     padding: '20px',
// // // //     borderRadius: '10px',
// // // //     // If the theme is "dark", make the background dark gray. Otherwise, make it a sunny yellow!
// // // //     backgroundColor: currentTheme === "dark" ? "#333333" : "#FFFACD",
// // // //     // If the theme is "dark", make the text white. Otherwise, make it black!
// // // //     color: currentTheme === "dark" ? "white" : "black",
// // // //     // This makes the color change look super smooth instead of instantly blinking
// // // //     transition: "all 0.4s ease" 
// // // //   };

// // // //   return (
// // // //     <div style={roomStyle}>
// // // //       <h2>Welcome to the Secret Room!</h2>
// // // //       <p>
// // // //         The lights are currently <strong>{currentTheme === "dark" ? "OFF 🌙" : "ON ☀️"}</strong>!
// // // //       </p>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default UseDarkModeApp;


// // // // // How the colors change:
// // // // // The Style Object: Inside SecretRoom, we created a dictionary of CSS rules called roomStyle.

// // // // // The Ternary Operator (? :): This is a mini if/else statement. When we write currentTheme === "dark" ? "#333333" : "#FFFACD", we are telling React: "Is the backpack theme dark? If yes, use #333333 (dark gray). If no, use #FFFACD (light yellow)."

// // // // // Applying the Style: We attach those rules to the room by adding style={roomStyle} to the div. Now, whenever the button in App is clicked, the SecretRoom instantly grabs the new theme from the backpack and recalculates its colors!


// // // import React, { useState, createContext, useContext } from 'react';

// // // // 1. Create the Magic Backpack (Context)
// // // const ThemeContext = createContext();

// // // function UseDarkModeApp() {
// // //   const [theme, setTheme] = useState("light");

// // //   // Let's create a special style dictionary just for our button!
// // //   const buttonStyle = {
// // //     padding: '10px 20px',
// // //     fontSize: '16px',
// // //     borderRadius: '8px',
// // //     cursor: 'pointer',
// // //     border: 'none',
// // //     fontWeight: 'bold',
// // //     // If the theme is dark, make the button white. If it's light, make it dark gray!
// // //     backgroundColor: theme === "dark" ? "white" : "#333333",
// // //     // If the theme is dark, make the text dark. If it's light, make it white!
// // //     color: theme === "dark" ? "#333333" : "white",
// // //     // Makes the color change smooth
// // //     transition: "all 0.4s ease" 
// // //   };

// // //   return (
// // //     // 2. Put the theme inside the backpack
// // //     <ThemeContext.Provider value={theme}>
// // //       <div style={{ padding: '20px', border: '5px solid blue', borderRadius: '10px' }}>
// // //         <h1>My Awesome App</h1>
        
// // //         {/* We add our new buttonStyle here. We also use the mini if/else to change the text! */}
// // //         <button 
// // //           style={buttonStyle} 
// // //           onClick={() => setTheme(theme === "light" ? "dark" : "light")}
// // //         >
// // //           {theme === "light" ? "Switch to Dark Mode 🌙" : "Switch to Light Mode ☀️"}
// // //         </button>
        
// // //         <SecretRoom />
// // //       </div>
// // //     </ThemeContext.Provider>
// // //   );
// // // }

// // // function SecretRoom() {
// // //   // 3. Reach into the Magic Backpack to grab the theme!
// // //   const currentTheme = useContext(ThemeContext);

// // //   const roomStyle = {
// // //     marginTop: '20px',
// // //     padding: '20px',
// // //     borderRadius: '10px',
// // //     backgroundColor: currentTheme === "dark" ? "#333333" : "#FFFACD",
// // //     color: currentTheme === "dark" ? "white" : "black",
// // //     transition: "all 0.4s ease" 
// // //   };

// // //   return (
// // //     <div style={roomStyle}>
// // //       <h2>Welcome to the Secret Room!</h2>
// // //       <p>
// // //         The lights are currently <strong>{currentTheme === "dark" ? "OFF 🌙" : "ON ☀️"}</strong>!
// // //       </p>
// // //     </div>
// // //   );
// // // }

// // // export default UseDarkModeApp;

// // import React, { useState, createContext, useContext } from 'react';


// //   // 1. Create the Magic Backpack
// // const ThemeContext = createContext();

// // function UseDarkModeApp() {
// //   const [theme, setTheme] = useState("light");

// //   // NEW: Let's create a style for the WHOLE app, not just the Secret Room!
// //   const appStyle = {
// //     padding: '40px',
// //     minHeight: '100vh', // This tells the box to fill the whole height of the screen
// //     // If dark mode, make the background super dark gray. If light, make it a nice light blue!
// //     backgroundColor: theme === "dark" ? "#1a1a1a" : "#f0f8ff",
// //     // If dark mode, text is white. If light mode, text is black!
// //     color: theme === "dark" ? "white" : "black",
// //     transition: "all 0.5s ease" 
// //   };

// //   // The track (the oval background of the switch)
// //   const trackStyle = {
// //     width: '60px',
// //     height: '30px',
// //     borderRadius: '15px',
// //     backgroundColor: theme === "dark" ? "#4CAF50" : "#ccc", 
// //     display: 'flex',
// //     alignItems: 'center',
// //     padding: '0 5px',
// //     cursor: 'pointer',
// //     transition: 'background-color 0.4s ease'
// //   };

// //   // The slider (the white circle inside)
// //   const circleStyle = {
// //     width: '20px',
// //     height: '20px',
// //     borderRadius: '50%',
// //     backgroundColor: 'white',
// //     transform: theme === "dark" ? 'translateX(30px)' : 'translateX(0px)',
// //     transition: 'transform 0.4s ease'
// //   };

// //   return (
// //     <ThemeContext.Provider value={theme}>
// //       {/* We apply our new appStyle right here to the very first div! */}
// //       <div style={appStyle}>
// //         <h1>My Awesome App</h1>
        
// //         <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
// //           <strong>Switch Theme:</strong>
          
// //           <div 
// //             style={trackStyle} 
// //             onClick={() => setTheme(theme === "light" ? "dark" : "light")}
// //           >
// //             <div style={circleStyle}></div>
// //           </div>
// //         </div>
        
// //         <SecretRoom />
// //       </div>
// //     </ThemeContext.Provider>
// //   );
// // }

// // function SecretRoom() {
// //   // 3. Reach into the Magic Backpack to grab the theme!
// //   const currentTheme = useContext(ThemeContext);

// //   const roomStyle = {
// //     marginTop: '30px',
// //     padding: '20px',
// //     borderRadius: '10px',
// //     // The Secret Room has its own special colors so it stands out!
// //     backgroundColor: currentTheme === "dark" ? "#333333" : "#FFFACD",
// //     color: currentTheme === "dark" ? "white" : "black",
// //     border: currentTheme === "dark" ? "2px solid #555" : "2px solid #ffcc00",
// //     transition: "all 0.4s ease" 
// //   };

// //   return (
// //     <div style={roomStyle}>
// //       <h2>Welcome to the Secret Room!</h2>
// //       <p>
// //         The lights are currently <strong>{currentTheme === "dark" ? "OFF 🌙" : "ON ☀️"}</strong>!
// //       </p>
// //     </div>
// //   );
// // }

// // export default UseDarkModeApp;


// import React, { useState, createContext, useContext } from "react";

// // 1. Create the Magic Backpack
// const ThemeContext = createContext();

// function UseDarkModeApp() {
//   const [theme, setTheme] = useState("light");

//   const appStyle = {
//     padding: "40px",
//     minHeight: "100px",
//     backgroundColor: theme === "dark" ? "#1a1a1a" : "#f0f8ff",
//     color: theme === "dark" ? "white" : "black",
//     transition: "all 0.5s ease",
//   };

//   const trackStyle = {
//     width: "60px",
//     height: "30px",
//     borderRadius: "15px",
//     backgroundColor: theme === "dark" ? "#4CAF50" : "#ccc",
//     display: "flex",
//     alignItems: "center",
//     padding: "0 5px",
//     cursor: "pointer",
//     transition: "background-color 0.4s ease",
//   };

//   const circleStyle = {
//     width: "20px",
//     height: "20px",
//     borderRadius: "50%",
//     backgroundColor: "white",
//     transform: theme === "dark" ? "translateX(30px)" : "translateX(0px)",
//     transition: "transform 0.4s ease",
//   };

//   return (
//     <ThemeContext.Provider value={theme}>
//       <div style={appStyle}>
//         <h1>My Awesome App</h1>

//         <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
//           <strong>Switch Theme:</strong>

//           <div
//             style={trackStyle}
//             onClick={() => setTheme(theme === "light" ? "dark" : "light")}
//           >
//             <div style={circleStyle}></div>
//           </div>
//         </div>

//         <SecretRoom />
//       </div>
//     </ThemeContext.Provider>
//   );
// }

// function SecretRoom() {
//   const currentTheme = useContext(ThemeContext);

//   const roomStyle = {
//     marginTop: "30px",
//     padding: "20px",
//     borderRadius: "10px",
//     backgroundColor: currentTheme === "dark" ? "#111827" : "#FFFACD",
//     color: currentTheme === "dark" ? "white" : "black",
//     border: currentTheme === "dark" ? "2px solid #374151" : "2px solid #ffcc00",
//     transition: "all 0.4s ease",
//   };

//   return (
//     <div style={roomStyle}>
//       <h2>Welcome to the Secret Room!</h2>
//       <p>
//         The lights are currently{" "}
//         <strong>{currentTheme === "dark" ? "OFF 🌙" : "ON ☀️"}</strong>!
//       </p>
//     </div>
//   );
// }

// export default UseDarkModeApp;


import React, { useState, createContext, useContext } from "react";

// 1. Create the Magic Backpack
const ThemeContext = createContext();

function UseDarkModeApp() {
  const [theme, setTheme] = useState("light");

  const appStyle = {
    padding: "40px",
    minHeight: "100px",
    backgroundColor: "#f5f5f5",
    color: "black",
    transition: "all 0.5s ease",
  };

  const trackStyle = {
    width: "60px",
    height: "30px",
    borderRadius: "15px",
    backgroundColor: theme === "dark" ? "#4CAF50" : "#ccc",
    display: "flex",
    alignItems: "center",
    padding: "0 5px",
    cursor: "pointer",
    transition: "background-color 0.4s ease",
  };

  const circleStyle = {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "white",
    transform: theme === "dark" ? "translateX(30px)" : "translateX(0px)",
    transition: "transform 0.4s ease",
  };

  return (
    <ThemeContext.Provider value={theme}>
      <div style={appStyle}>
        <h1>My Awesome App</h1>

        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <strong>Switch Theme:</strong>

          <div
            style={trackStyle}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <div style={circleStyle}></div>
          </div>
        </div>

        <SecretRoom />
      </div>
    </ThemeContext.Provider>
  );
}

function SecretRoom() {
  const currentTheme = useContext(ThemeContext);

  const roomStyle = {
    marginTop: "30px",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: currentTheme === "dark" ? "#111827" : "#FFFACD",
    color: currentTheme === "dark" ? "white" : "black",
    border: currentTheme === "dark" ? "2px solid #374151" : "2px solid #ffcc00",
    transition: "all 0.4s ease",
  };

  return (
    <div style={roomStyle}>
      <h2>Welcome to the Secret Room!</h2>
      <p>
        The lights are currently{" "}
        <strong>{currentTheme === "dark" ? "OFF 🌙" : "ON ☀️"}</strong>!
      </p>
    </div>
  );
}

export default UseDarkModeApp;