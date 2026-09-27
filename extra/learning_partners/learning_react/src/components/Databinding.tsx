import React, { useState } from 'react'

const Databinding = () => {

    const first_name = "Bhupinder"
    const last_name = "Singh"
    const name = first_name + " " + last_name

    const [stateName, setStateName] = useState("OK")
  return (
    <div>
      From databinding component, Name stored in variable is :  
      <input className="primary" type = "text" value={name} readOnly></input>
      <br />
      From databinding component, State name is :  
      <select value={stateName} onChange={(e) => setStateName(e.target.value)}>
        <option value= "OK">Oklahoma</option>
         <option value= "TX">Texas</option>
          <option value= "CA">California</option>
           <option value= "FL">Florida</option>
      </select>
    </div>
  )
}

export default Databinding
