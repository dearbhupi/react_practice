import React, { useState } from 'react'

const UseStateEx2 = () => {
  let courseName = "React JS"

  const changeCourseName = () => {
    courseName = "React JS - Updated"
    console.log(courseName)
  }

  return (
    <div>
      <p>{courseName}</p>
      <button onClick={changeCourseName}>
        Change Course Name
      </button>
    </div>
  )
}

export default UseStateEx2
