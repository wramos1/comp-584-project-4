// Code to generate number buttons
const buttonContainer = document.querySelector(".calculator-buttons");
const calculatorValue = document.querySelector(".calculator-value");
const prevEquation = document.querySelector(".prev-equation");
const clear = document.querySelector(".clear");
const backspace = document.querySelector(".backspace");
const divide = document.querySelector(".divide");
const multiply = document.querySelector(".multiply");
const subtract = document.querySelector(".subtract");
const add = document.querySelector(".add");
const equals = document.querySelector(".equals");

// Array of operator elements and their corresponding symbols
const operators = [
    { el: divide, symbol: "÷" },
    { el: multiply, symbol: "x" },
    { el: subtract, symbol: "-" },
    { el: add, symbol: "+" }
];

// Loop to generate number buttons from 0-9
for (let i = 0; i <= 9; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.classList.add(`number-button-${i}`);
    button.addEventListener("click", () => {
        if (calculatorValue.innerHTML === "0" || calculatorValue.innerHTML === "Error" || calculatorValue.innerHTML === "Infinity" || prevEquation.classList.contains("active")) {
            calculatorValue.innerHTML = i;
        } else {
            calculatorValue.innerHTML += i;
        }
    })
    buttonContainer.appendChild(button);
}

// Event Listeners for Operation Buttons
clear.addEventListener("click", () => {
    calculatorValue.innerHTML = "0";
});

backspace.addEventListener("click", () => {
    if (calculatorValue.innerHTML.length > 1 && calculatorValue.innerHTML !== "Error" && calculatorValue.innerHTML !== "Infinity") {
        calculatorValue.innerHTML = calculatorValue.innerHTML.slice(0, -1);
    } else {
        calculatorValue.innerHTML = "0";
    }
});

operators.forEach(op => {
    op.el.addEventListener("click", () => {
        let lastChar = calculatorValue.innerHTML.slice(-1);
        if (["+", "-", "x", "÷"].includes(lastChar)) {
            calculatorValue.innerHTML = calculatorValue.innerHTML.slice(0, -1) + op.symbol;
        }
        else if (calculatorValue.innerHTML !== "Error" && calculatorValue.innerHTML !== "Infinity") {
            calculatorValue.innerHTML += op.symbol;
        }
        else {
            calculatorValue.innerHTML = "0";
        }
    });
});


const tokenize = (expression) => {
    // Regex explained: global match of either a sequence of digits (\d+) 
    // or any of the operators (+, -, x, ÷)
    let tokens = expression.match(/(\d+|\+|\-|\x|\÷)/g)
    return [tokens, expression];
}

const calculate = ([tokens, expression]) => {
    let stack = [];
    let i = 0;

    prevEquation.innerHTML = expression;
    prevEquation.classList.add("active");

    while (i < tokens.length) {
        let token = tokens[i];
        if (token === "x" || token === "÷") {
            let a = Number(stack.pop());
            let b = Number(tokens[i + 1]);
            let result = token === "x" ? a * b : a / b;
            stack.push(result);
            i += 2; // Skip the next token since it's already processed
        }
        else {
            stack.push(token);
            i++;
        }
    }
    // Handling rest of the operations
    let result = Number(stack[0]);
    for (let i = 0; i < stack.length; i++) {
        if (stack[i] === "+") {
            let b = Number(stack[i + 1]);
            result += b;
            i += 2;
        }
        else if (stack[i] === "-") {
            let b = Number(stack[i + 1]);
            result -= b;
            i += 2;
        }
    }
    return result;
}

equals.addEventListener("click", () => {
    try {
        let lastChar = calculatorValue.innerHTML.slice(-1);
        if (["+", "-", "x", "÷"].includes(lastChar)) {
            calculatorValue.innerHTML = calculatorValue.innerHTML.slice(0, -1);
        }
        let result = calculate(tokenize(calculatorValue.innerHTML));
        calculatorValue.innerHTML = result;
    } catch (error) {
        calculatorValue.innerHTML = "Error";
    }
});

// Event listener on button container to hide previous equation when any button other than the "equals" button is clicked
buttonContainer.addEventListener("click", (e) => {
    if (!e.target.classList.contains("equals")) {
        prevEquation.classList.remove("active");
    }
})