const name = document.getElementById('name');
const myButton = document.getElementById('myButton');

function showName() {
    name.hidden = false;
}

function hideName() {
    name.hidden = true;
}

myButton.addEventListener("pointerdown", showName);
myButton.addEventListener("pointerup", hideName);
myButton.addEventListener("pointerleave", hideName);
myButton.addEventListener("pointercancel", hideName);
myButton.addEventListener("blur", hideName);
myButton.addEventListener("pointerenter", showName);
myButton.addEventListener("pointerout", hideName);

myButton.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") showName();
});

myButton.addEventListener("keyup", (event) => {
    if (event.key === "Enter" || event.key === " ") hideName();
});