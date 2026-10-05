// Wait for the button to be clicked
document.getElementById('calcButton').addEventListener('click', function() {
    
    // 1. Get the values from the UI and convert them to numbers
    const num1 = parseFloat(document.getElementById('input1').value);
    const num2 = parseFloat(document.getElementById('input2').value);
    const operator = document.getElementById('operator').value;
    const resultDisplay = document.getElementById('resultDisplay');

    // 2. Validate that the user actually entered numbers
    if (isNaN(num1) || isNaN(num2)) {
        resultDisplay.textContent = "Please enter valid numbers.";
        return; // Stop execution if inputs are invalid
    }

    let result = 0;

    // 3. Perform the calculation based on the selected operator
    switch (operator) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '*':
            result = num1 * num2;
            break;
        case '/':
            // Handle division by zero
            if (num2 === 0) {
                resultDisplay.textContent = "Cannot divide by zero!";
                return; 
            }
            result = num1 / num2;
            break;
    }

    // 4. Return and display the final value in the UI
    resultDisplay.textContent = result;
});