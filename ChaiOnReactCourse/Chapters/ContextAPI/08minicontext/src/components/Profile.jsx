import React, {useContext} from 'react'
import UserContext from '../context/UserContext';

function Profile() {
  const { user } = useContext(UserContext); //here user is the data that we are passing from the provider in file userContextProvider.jsx
    
  if (!user)  return <p>Please login first</p>;
    

  return (
    <div>
      <h2>Welcome, {user.username}!</h2>
      {/* <p>Name: {user.username}</p>
      <p>Password: {user.password}</p> */}
    </div>
  )
}

export default Profile


