import { useState } from "react";
import "./App.css";

function App() {
  const name = "Amezon";
  const country = "India";
  const phone = "123-456-7890";
  const cellPhone = "333-222-1111";
  const revelPhoneNumber = true;
  const [showPhone, setShowPhone] = useState(true);

  const toggleSecondPhone = () => {
    setShowPhone((prev) => !prev);
  };
  // const toggleSecondPhone = () => {
  //   if (revelPhoneNumber) {
  //     setShowPhone(false);
  //   } else {
  //     setShowPhone(true);
  //   }

  // };

  return (
    <div>
      <h1>Welcome to {name}</h1>
      <p>Country: {country}</p>

      <Greeting />

      {Namaste()}

      {Namaste2({ name: "John" })}

      {showPhone ? (
        <ShowPhoneNumber phone={phone} />
      ) : (
        <ShowPhoneNumber phone={cellPhone} />
      )}

      <button onClick={toggleSecondPhone}>
        {showPhone ? "Show Landline Phone" : "Show Main Phone"}
      </button>
    </div>
  );
}

function Greeting() {
  return (
    <div>
      <h2>Greeting component is called</h2>
    </div>
  );
}

function Namaste() {
  return (
    <div>
      <h2>Namaste function is called</h2>
    </div>
  );
}

function Namaste2(prop) {
  return (
    <div>
      <h2>Namaste with props: {prop.name}</h2>
    </div>
  );
}

function ShowPhoneNumber({ phone }) {
  return (
    <div>
      <h2>Phone number is: {phone} with conditional rendering</h2>
    </div>
  );
}

export default App;
