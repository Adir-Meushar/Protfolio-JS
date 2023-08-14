class Calculator {
    constructor(previusOperandTextElement, currentOperandTextElement) {
        this.previusOperandTextElement = previusOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }
    clear() {
        this.currentOperand = '';
        this.previusOperand = '';
        this.operation = undefined;
    }
    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }
    appendNumber(number) {
        if (number == '.' && this.currentOperand.includes('.')) return
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }
    chooseOperation(operation) {
        if (this.currentOperand === '')
            return;
        if (this.previusOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previusOperand = this.currentOperand;
        this.currentOperand = ''
    }
    compute() {
        let computaion;
        const prev = parseFloat(this.previusOperand)
        const current = parseFloat(this.currentOperand)
        if (isNaN(prev) || isNaN(current)) {
            return;
        }
        switch (this.operation) {
            case '+':
                computaion = prev + current
                break
            case '-':
                computaion = prev - current
                break
            case '*':
                computaion = prev * current
                break
            case '/':
                computaion = prev / current
                break
            default:
                return;
        }
        this.currentOperand = computaion;
        this.operation = undefined;
        this.previusOperand = '';
    }
    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0])
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = ''
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            })
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`
        } else {
            return integerDisplay
        }

    }
    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previusOperandTextElement.innerText =
                `${this.getDisplayNumber(this.previusOperand)}${this.operation}`;
        } else {
            this.previusOperandTextElement.innerText = '';
        }
    }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClear = document.querySelector('[data-all-clear]');
const previusOperandTextElement = document.querySelector('[data-previus-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');


const calculator = new Calculator(previusOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay()
    })
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText)
        calculator.updateDisplay()
    })
})


equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
})

allClear.addEventListener('click', button => {
    calculator.clear();
    calculator.updateDisplay();
})

deleteButton.addEventListener('click', button => {
    calculator.delete();
    calculator.updateDisplay();
})