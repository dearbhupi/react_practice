/**
 * ============================================
 * INPUTCHILD.JS - CHILD COMPONENT DOCUMENTATION
 * ============================================
 * This is a child component that handles user input for adding new tasks
 * It communicates with parent component (App.js) via callback function
 */

// Import React (required for JSX syntax)
import React from 'react';

// Import useState hook to manage the input field value locally in this component
import { useState } from 'react';

/**
 * ============================================
 * INPUTCHILD FUNCTION COMPONENT
 * ============================================
 * Purpose: Provides an input field and button for users to add new tasks
 * Props Parameter: props object containing callback functions from parent component
 */
function InputChild(props){
    /**
     * STATE MANAGEMENT - inputValue
     * - inputValue: String that stores what the user is currently typing
     * - setInputValue: Function to update the input value
     * - useState(""): Initialize with empty string (no initial text)
     * 
     * This is LOCAL state - only this component knows about it.
     * The actual tasks are managed by the parent (App.js)
     */
    const [inputValue, setInputValue] = useState("");

    /**
     * ============================================
     * HANDLER FUNCTION - handleInputChange
     * ============================================
     * Purpose: Updates the local state as user types in the input field
     * Triggered: Every time user types a character in the input field
     * 
     * Parameter: event - The change event object from the input field
     * event.target.value - Contains the current text in the input field
     */
    const handleInputChange = (event) => {
        // Extract the current value from input field and update state
        // This keeps the component's state in sync with what user sees
        setInputValue(event.target.value);
    };

    /**
     * ============================================
     * HANDLER FUNCTION - handleAddButtonClick
     * ============================================
     * Purpose: Executes when user clicks the "Add Task" button
     * Communicates with parent component and resets the input field
     */
    const handleAddButtonClick = () => {
        // Call the onBtnClick callback function from parent (App component)
        // Pass the current inputValue as parameter so parent can add it to the list
        props.onBtnClick(inputValue);
        
        // Log to browser console for debugging - shows what task was added
        console.log("Input Value:", inputValue);
        
        // Clear the input field by resetting state to empty string
        // This prepares the input field for the next task entry
        setInputValue("");
    };
    
    /**
     * ============================================
     * JSX RETURN - RENDER METHOD
     * ============================================
     * Returns the UI structure: input field + button
     */
    return (
        // Container div that wraps input and button together
        <div>
            {/* 
              INPUT ELEMENT
              - value={inputValue}: Binds the input field to state (controlled component)
              - onChange={handleInputChange}: Calls handler function when text changes
              - type="text": Specifies this is a text input field (not password, email, etc.)
            */}
            <input 
                value={inputValue} 
                onChange={handleInputChange} 
                type="text" 
            />
            
            {/* 
              BUTTON ELEMENT
              - onClick={handleAddButtonClick}: Calls handler function when button is clicked
              - disabled={!inputValue}: Button is DISABLED (grayed out) if input is empty
                                        !inputValue means "if inputValue is falsy/empty"
                                        When user types something, button becomes ENABLED
            */}
            <button 
                onClick={handleAddButtonClick} 
                disabled={!inputValue}
            >
                Add Task
            </button>
        </div>
    );
};

// Export the InputChild component so it can be imported and used in other files
export default InputChild;


