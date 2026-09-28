

const message = "Hello, world! from JSRefresher";
console.log(message);
// import  apiKey from './utils.js'; // if using only default export e.g export default "One2three4Five6";
import { apiKey, anotherKey } from './utils.js';
console.log(apiKey);
console.log(anotherKey);

function createGreeting(name, message="Hello"){
    return `${message}, ${name}!`;
}

const greeting1 = createGreeting("Charlie");
const greeting2 = createGreeting("Diana", "Hey");   
console.log(greeting1);
console.log(greeting2);
console.log(createGreeting("Alice"));
console.log(createGreeting("Bob", "Hi"));

// arrow function
const createGreetingArrow = (name, message="Hello") => `${message}, ${name}!`;
console.log(createGreetingArrow("Eve"));
console.log(createGreetingArrow("Frank", "Hi"));

// function createGreeting(name, message="Hello"){
//     return `${message}, ${name}!`;
// }

// remove the keyword funciton and name of the function and {} and return keyword
// after () put => 
//you can put in an variable and later call this function (name, message="Hello") => `${message}, ${name}!`;
 // other important 

// e.g., const greet = username => `Hello, ${username}!`;
// if the function has only one parameter, you can omit the parentheses around it.
// if the function has no parameters, you can use empty parentheses: const greet = () => `Hello!`; but can not skip the ()
 // if the function has multiple parameters, you must use parentheses: const greet = (name, message="Hello") => `${message}, ${name}!`; can not skip the parenteis
 // if the function has a single parameter and you want to use parentheses, you can do so: const greet = (username) => `Hello, ${username}!`;
 // if the function contain no other logic but a return statement , you can omit the curly braces and the return keyword: const greet = (name, message="Hello") => `${message}, ${name}!`;
 // if the function return an object then you may end up with the following number => {age : number} trying to return the object
 // in such cases, you need to wrap the object in parentheses: const getPerson = (name, age) => ({name, age});
 // example usage of the above arrow function
// const person = getPerson("John", 30);
// console.log(person); // Output: {name: "John", age: 30}


// Object destructuring example
const person = {name: "John", age: 30};
const {name, age} = person;
console.log(name); // Output: "John"
console.log(age); // Output: 30
console.log(person); // Output: {name: "John", age: 30}
console.log(person.age);
console.log(person.name);
console.log(person["age"]);
console.log(person["name"]);


// create class 
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    greet() {
        return `Hello, my name is ${this.name} and I am ${this.age} years old.`;
    }
}

const person1 = new Person("Charlie", 25);
console.log(person1.greet()); // Output: Hello, my name is Charlie and I am 25 years old.
const person2 = new Person("Diana", 30);
console.log(person2.greet()); // Output: Hello, my name is Diana and I am 30 years old.
