

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
console.log(person1); 

// array in JavaScript
const numbers = [1, 2, 3, 4, 5];
console.log(numbers); // Output: [1, 2, 3, 4, 5]
console.log(numbers[0]); // Output: 1
console.log(numbers.length); // Output: 5
console.log(numbers[numbers.length - 1]); // Output: 5
console.log(numbers.slice(1, 4)); // Output: [2, 3, 4]
console.log(numbers.concat([6, 7])); // Output: [1, 2, 3, 4, 5, 6, 7]
console.log(numbers.push(8)); // Output: 6 (new length of the array)
console.log(numbers); // Output: [1, 2, 3, 4, 5, 6, 7, 8]
console.log(numbers.pop()); // Output: 8 (removed last element)
console.log(numbers); // Output: [1, 2, 3, 4, 5, 6, 7]
console.log(numbers.shift()); // Output: 1 (removed first element)
console.log(numbers); // Output: [2, 3, 4, 5, 6, 7]
console.log(numbers.unshift(0)); // Output: 7 (new length of the array)
console.log(numbers); // Output: [0, 2, 3, 4, 5, 6, 7]
console.log(numbers.splice(2, 3)); // Output: [3, 4, 5] (removed elements)
console.log(numbers); // Output: [0, 2, 6, 7]
console.log(numbers.splice(1, 0, 1.5)); // Output: [] (no elements removed)
console.log(numbers); // Output: [0, 1.5, 2, 6, 7]
console.log(numbers.splice(1, 1, 1.5)); // Output: [1.5] (removed element)
console.log(numbers); // Output: [0, 1.5, 2, 6, 7]

// how to access the last elements using loop
for (let i = numbers.length - 1; i >= 0; i--) {
    console.log(numbers[i]);
}

// how to access the last elements using loop
for (let i = numbers.length - 1; i >= 0; i--) {
    console.log(numbers[i]);
}

// how to access the last elements using map
numbers.map((num, index) => {
    if (index >= numbers.length - 3) {
        console.log(num);
    }
});

// how to convert an array to object
const arrayToObject = (arr) => {
    return arr.reduce((acc, curr, index) => {
        acc[index] = curr;
        return acc;
    }, {});
};
console.log(arrayToObject(numbers)); // Output: { '0': 0, '1': 1.5, '2': 2, '3': 6, '4': 7 }

// how to enumerate the elements of an array
for (const [index, value] of numbers.entries()) {
    console.log(`Index: ${index}, Value: ${value}`);
}
// create the function to transform array to object using entries
const arrayToObjectUsingEntries = (arr) => {
    return Object.fromEntries(arr.entries());
};
console.log(arrayToObjectUsingEntries(numbers)); // Output: { '0': 0, '1': 1.5, '2': 2, '3': 6, '4': 7 }

// simplify the above method
const arrayToObjectSimplified = (arr) => Object.fromEntries(arr.entries());
console.log(arrayToObjectSimplified(numbers)); // Output: { '0': 0, '1': 1.5, '2': 2, '3': 6, '4': 7 }


const arr = [1, 2, 3, 4, 5];

function transformArrayToObject(arr) {
    return {...arr} 
};
console.log("line 146",transformArrayToObject(arr)); // Output: { '0': 1, '1': 2, '2': 3, '3': 4, '4': 5 }


function transformToObject(arr){
    return arr.map((val, index) => ({val: index}));
}

console.log(transformToObject(arr)); // Output: [{ val: 1, index: 0 }, { val: 2, index: 1 }, { val: 3, index: 2 }, { val: 4, index: 3 }, { val: 5, index: 4 }]

// using for...of loop to access elements of an array
for (const num of numbers) {
    console.log(num);
}

// what is sprad operator in array
const spreadNumbers = [...numbers];
console.log(spreadNumbers); // Output: [0, 1.5, 2, 6, 7]

// how to reverse the array
const reversedNumbers = numbers.slice().reverse();
console.log(reversedNumbers); // Output: [7, 6, 2, 1.5, 0]
// does ::-1 work in javascript as done in python
console.log(numbers.slice(-1)); // Output: [0] (last element)
console.log(numbers.slice(-2)); // Output: [1.5, 0] (last two elements) 
console.log(numbers.slice(-3)); // Output: [2, 1.5, 0] (last three elements)


// findindex method in array
const index1 = numbers.findIndex(num => num > 3);
console.log(index1); // Output: 3 (index of the first element greater than 3)

const hobbies = ["reading", "coding", "traveling"];
console.log(hobbies); // Output: ["reading", "coding", "traveling"]

const firstIndexofCoding = hobbies.findIndex(hobby => hobby === "coding");
console.log(firstIndexofCoding); // Output: 1 (index of the first element equal to "coding")


// nested array
const nestedArrayExample = [1, [2, [3, [4]]]];
console.log(nestedArrayExample); // Output: [1, [2, [3, [4]]]]
// accessing nested array elements
console.log(nestedArrayExample[1][1][1]); // Output: 4
console.log(nestedArrayExample[0]); // Output: 1
console.log(nestedArrayExample[1]); // Output: [2, [3, [4]]]
console.log(nestedArrayExample[1][0]); // Output: 2
console.log(nestedArrayExample[1][1]); // Output: [3, [4]]
console.log(nestedArrayExample[1][1][0]); // Output: 3
console.log(nestedArrayExample[1][1][1]); // Output: [4]
console.log(nestedArrayExample[1][1][1][0]); // Output: 4


// iterate over object in array
const objectsArray = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 },
    { name: "Charlie", age: 35 }
];
objectsArray.forEach(obj => {
    console.log(`${obj.name} is ${obj.age} years old.`);
});     



// map method in array
const doubledNumbers = numbers.map(num => num * 2);
console.log(doubledNumbers); // Output: [0, 3, 4, 12, 14]

// filter method in array
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // Output: [0, 2, 6]

// reduce method in array
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum); // Output: 15

// find method in array
const firstEvenNumber = numbers.find(num => num % 2 === 0);
console.log(firstEvenNumber); // Output: 0

// some method in array
const hasEvenNumber = numbers.some(num => num % 2 === 0);
console.log(hasEvenNumber); // Output: true

// every method in array
const allEvenNumbers = numbers.every(num => num % 2 === 0);
console.log(allEvenNumbers); // Output: false

// flat method in array
const nestedArray = [1, [2, [3, [4]]]];
const flattenedArray = nestedArray.flat(2);
console.log(flattenedArray); // Output: [1, 2, 3, [4]]

// flatMap method in array
const mappedAndFlattened = nestedArray.flat(2).map(x => x * 2);
console.log(mappedAndFlattened); // Output: [2, 4, 6, 8]

// includes method in array
const includesNumber = numbers.includes(2);
console.log(includesNumber); // Output: true

// indexOf method in array
const index = numbers.indexOf(2);
console.log(index); // Output: 2

// lastIndexOf method in array
const lastIndex = numbers.lastIndexOf(2);
console.log(lastIndex); // Output: 2

// join method in array
const joinedString = numbers.join('-');
console.log(joinedString); // Output: "0-1.5-2-6-7"

// split method in array
const splitString = joinedString.split('-');
console.log(splitString); // Output: ["0", "1.5", "2", "6", "7"]

// concat method in array
const concatenatedArray = numbers.concat([8, 9]);
console.log(concatenatedArray); // Output: [0, 1.5, 2, 6, 7, 8, 9]

// slice method in array
const slicedArray = numbers.slice(1, 3);
console.log(slicedArray); // Output: [1.5, 2]

// splice method in array
const splicedArray = numbers.splice(1, 2);
console.log(splicedArray); // Output: [1.5, 2]
console.log(numbers); // Output: [0, 6, 7]  

// spread operator in array
const spreadArray = [...numbers];
console.log(spreadArray); // Output: [0, 6, 7]

// rest operator in array
const [first, ...rest] = numbers;
console.log(first); // Output: 0
console.log(rest); // Output: [6, 7]

// spread operator in objects
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 };
console.log(obj2); // Output: { a: 1, b: 2, c: 3 }

// rest operator in objects
const { a, ...restObj } = obj2;
console.log(a); // Output: 1
console.log(restObj); // Output: { b: 2, c: 3 }
 
// merge two array with spread operator
const array1 = [1, 2, 3];
const array2 = [4, 5, 6];
const mergedArray = [...array1, ...array2];
console.log(mergedArray); // Output: [1, 2, 3, 4, 5, 6]

// merge two objects with spread operator
const object1 = { x: 10, y: 20 };
const object2 = { z: 30 };
const mergedObject = { ...object1, ...object2 };
console.log(mergedObject); // Output: { x: 10, y: 20, z: 30 }
