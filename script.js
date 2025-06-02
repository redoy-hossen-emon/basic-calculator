// script.js

const display = document.getElementById('display');
const operatorIcon = document.getElementById('operatorIcon');
const numberButtons = document.querySelectorAll('[data-num]');
const operatorButtons = document.querySelectorAll('[data-op]');
const clearButton = document.getElementById('clear');
const backspaceButton = document.getElementById('backspace');
const equalsButton = document.getElementById('equals');

let currentInput = '';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

// Operator symbols for display
const operatorSymbols = {
  '+': '+',
  '-': '−',
  '*': '×',
  '/': '÷',
  '%': '%'
};

function formatDisplayValue(value) {
  value = String(value);

  if (value.length <= 15) return value;

  if (value.includes('.')) {
    const [intPart, decPart] = value.split('.');
    let formatted = intPart + '.' + decPart.slice(0, 3);
    if (formatted.length > 15) {
      const keep = 15 - 4;
      formatted = intPart.slice(0, keep) + '.' + decPart.slice(0, 3);
    }
    return formatted;
  } else {
    return value.slice(0, 15);
  }
}

function getFontSizeByLength(len) {
  if (len <= 15) return '2rem';
  if (len <= 18) return '1.7rem';
  if (len <= 21) return '1.4rem';
  if (len <= 24) return '1.1rem';
  return '0.9rem';
}

function updateDisplay() {
  const formatted = formatDisplayValue(currentInput || '0');
  display.value = formatted;
  display.style.fontSize = getFontSizeByLength(formatted.length);
}

function updateOperatorIcon(op) {
  operatorIcon.textContent = operatorSymbols[op] || '';
}

numberButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (waitingForSecondOperand) {
      currentInput = '';
      waitingForSecondOperand = false;
    }
    if (btn.dataset.num === '.' && currentInput.includes('.')) return;
    currentInput += btn.dataset.num;
    updateDisplay();
  });
});

operatorButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (currentInput === '' && firstOperand === null) return;
    if (operator && !waitingForSecondOperand) {
      currentInput = String(operate(firstOperand, Number(currentInput), operator));
      updateDisplay();
      firstOperand = Number(currentInput);
    } else {
      firstOperand = Number(currentInput);
    }
    operator = btn.dataset.op;
    updateOperatorIcon(operator);
    waitingForSecondOperand = true;
  });
});

equalsButton.addEventListener('click', () => {
  if (operator && firstOperand !== null && currentInput !== '') {
    currentInput = String(operate(firstOperand, Number(currentInput), operator));
    updateDisplay();
    firstOperand = null;
    operator = null;
    updateOperatorIcon('');
    waitingForSecondOperand = false;
  }
});

clearButton.addEventListener('click', () => {
  currentInput = '';
  firstOperand = null;
  operator = null;
  updateDisplay();
  updateOperatorIcon('');
  waitingForSecondOperand = false;
});

backspaceButton.addEventListener('click', () => {
  if (!waitingForSecondOperand && currentInput.length > 0) {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
  }
});

function operate(a, b, op) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b !== 0 ? a / b : 'Err';
    case '%': return b/100;
    default: return b;
  }
}

// Initialize
updateDisplay();
updateOperatorIcon('');