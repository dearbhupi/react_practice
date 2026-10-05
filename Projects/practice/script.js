const title = document.getElementById('title');
const myButton = document.getElementById('myButton');

myButton.addEventListener('click', function() {
    title.textContent = title.textContent.replace(
        "_______________",
        "Bhupinder Singh"
    );
});