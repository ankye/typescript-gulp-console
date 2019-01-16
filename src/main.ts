import { sayHello } from "./greet"

function main(compiler:string):void {
    console.log(`Hello from ${compiler}`)
}

function showHello(divName: string, name: string) {
    const elt = document.getElementById(divName);
    elt.innerText = sayHello(name);
}

showHello("greeting", "TypeScript");


main("TypeScript1")

console.log(sayHello("Greet Script"))