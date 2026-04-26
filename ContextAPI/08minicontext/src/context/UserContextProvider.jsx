import React from "react";
import UserContext from "./UserContext";

const UserContextProvider = ({ children }) => {
//   const user = {
//     name: "John Doe",
//     email: "john.doe@example.com"
//   };
    const [user, setUser] = React.useState(null);
   // const [user, setUser] = React.useState({ name: "Bhupinder Singh", email: "bhupinder.singh@example.com" });

  return (
    //<UserContext.Provider value={user}>
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;