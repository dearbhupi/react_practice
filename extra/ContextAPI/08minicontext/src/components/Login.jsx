import React, {useState, useContext }from 'react'
import UserContext from '../context/UserContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext); // Access setUser from context in file userContextProvider.jsx

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login logic
    //setUser({ name: username, email: `${username}@example.com` });
    setUser({username, password});
  };

  return (
    <div>
     <h2>Login</h2>
     <input 
       type="text" 
       placeholder="Username" 
       value={username}
       onChange={(e) => setUsername(e.target.value)}
     />
    {"    "}
     <input 
       type="password" 
       placeholder="Password" 
       value={password}
       onChange={(e) => setPassword(e.target.value)}
     />
     <button onClick={handleSubmit}>Login</button>
    </div>
  )
}

export default Login
