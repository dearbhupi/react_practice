import React, { useState } from 'react'

const UseStateEx2 = () => {
  let courseName = "React JS"
  const [courseCount, setCourseCount] = useState<number>(0)

  const changeCourseName = () => {
    courseName = "Angular JS"
    console.log(courseName)
  }

  const changeCourseCount = () => {
    setCourseCount(courseCount + 1)
    console.log(courseCount)
  }

  return (
    <div>
      <p>{courseName}</p>
      <button onClick={changeCourseName}>
        Change Course Name to Angular JS
      </button>

       <p>{courseCount}</p>
      <button onClick={changeCourseCount}>
        Change Course count
      </button>
    </div>
  )
}

export default UseStateEx2
