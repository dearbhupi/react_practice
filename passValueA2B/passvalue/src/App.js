/**
 * ============================================
 * APP.JS - MAIN COMPONENT DOCUMENTATION
 * ============================================
 * This is the parent component that manages the todo list state
 * and handles adding new tasks from child component
 */

// Import the SVG logo file (note: currently not used in the component)
import logo from './logo.svg';

// Import the CSS stylesheet for styling this component
import './App.css';

// Import the InputChild component which handles user input
import InputChild from './inputChild';

// Import useState hook from React to manage component state
import { useState } from 'react';

/**
 * ============================================
 * MAIN APP FUNCTION COMPONENT
 * ============================================
 * This functional component serves as the parent component
 * It manages the list of todo tasks and passes callback to child
 */
function App() {
  /**
   * STATE MANAGEMENT - todovalue
   * - todovalue: Array that stores all the tasks added by the user
   * - setTodovalue: Function to update the todovalue array
   * - useState([]): Initialize with empty array as default
   */
  const [todovalue, setTodovalue] = useState([]);

  /**
   * ============================================
   * HANDLER FUNCTION - handleAddTask
   * ============================================
   * Purpose: Receives a new task from child component and adds it to the array
   * Parameter: task - The new task string to be added
   * Logic: Uses spread operator (...) to create a new array with existing tasks
   *        plus the new task. This follows React's immutability principle.
   */
  const handleAddTask = (task) => {
    // Spread operator [...todovalue] copies all existing tasks
    // and adds the new 'task' parameter to the end of the array
    setTodovalue([...todovalue, task]);
  };

  /**
   * ============================================
   * JSX RETURN - RENDER METHOD
   * ============================================
   * Renders the UI structure with the InputChild component and task list
   */
  return (
    // Main container div with className for styling
    <div className="App">
      {/* 
        InputChild Component - This is the child component that handles input
        Props passed:
        - onBtnClick={handleAddTask}: Callback function that runs when "Add Task" button is clicked
                                      This allows child to communicate with parent
      */}
      <InputChild onBtnClick={handleAddTask} />
      
      {/* 
        Unordered list that displays all the tasks
        It's initially empty and gets populated as user adds tasks
      */}
      <ul>
        {/* 
          .map() function iterates over each task in todovalue array
          Parameters:
          - task: Current item being processed from the array
          - index: Position of current item in the array (0-indexed)
          
          Returns: A <li> (list item) element for each task
          Key prop: React uses 'index' as unique identifier (not ideal in production,
                    but acceptable for this simple app)
        */}
        {todovalue.map((task, index) => (
          // List item that displays the task text
          <li key={index}>{task}</li>
        ))}
      </ul>
    </div>
  );
}

// Export the App component as default so it can be imported in other files (like index.js)
export default App;
