// Theme Toggle Functionality
function initTheme() {
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;

  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem("theme") || "light";

  // Apply the saved theme
  if (savedTheme === "dark") {
    body.setAttribute("data-theme", "dark");
    themeToggle.textContent = "☀️";
  } else {
    body.removeAttribute("data-theme");
    themeToggle.textContent = "🌙";
  }

  // Theme toggle event listener
  themeToggle.addEventListener("click", () => {
    const currentTheme = body.getAttribute("data-theme");

    if (currentTheme === "dark") {
      body.removeAttribute("data-theme");
      themeToggle.textContent = "🌙";
      localStorage.setItem("theme", "light");
    } else {
      body.setAttribute("data-theme", "dark");
      themeToggle.textContent = "☀️";
      localStorage.setItem("theme", "dark");
    }
  });
}

// Initialize theme when DOM is loaded
document.addEventListener("DOMContentLoaded", initTheme);

const calculate = function (bill, tip, people) {
  if (
    bill <= 0 ||
    tip < 0 ||
    people <= 0 ||
    isNaN(bill) ||
    isNaN(tip) ||
    isNaN(people)
  ) {
    return "Invalid input";
  }

  const tipAmount = bill * tip;
  const tipPerPerson = tipAmount / people;

  const totalAmount = parseFloat(bill) + parseFloat(tipAmount);
  const amountPerPerson = totalAmount / people;

  return {
    tipPerPerson: tipPerPerson.toFixed(2),
    amountPerPerson: amountPerPerson.toFixed(2),
  };
};

function getInfo() {
  const form = document.getElementById("tip-calculator");
  let tip = new FormData(form).get("tip");
  if (tip === null || tip === "custom") {
    const customValue = document.getElementById("tip-custom-input").value;
    tip = customValue ? parseFloat(customValue) / 100 : 0;
  } else {
    tip = parseFloat(tip);
  }

  const bill = parseFloat(new FormData(form).get("bill")) || 0;
  const people = parseInt(new FormData(form).get("people")) || 0;

  return { bill, tip, people };
}

const updateOutput = function (tip, amount) {
  document.getElementById("person-tip").textContent = `$${tip}`;
  document.getElementById("person-total").textContent = `$${amount}`;
};

const resetOutput = function () {
  document.getElementById("person-tip").textContent = "$0.00";
  document.getElementById("person-total").textContent = "$0.00";
};

const validateAndCalculate = function () {
  const formData = getInfo();

  // Reset all error states
  clearErrors();

  // Validate inputs and show errors
  let hasErrors = false;

  if (formData.bill <= 0 || isNaN(formData.bill)) {
    if (formData.bill !== 0 || document.getElementById("bill").value !== "") {
      showError("bill", "bill-error");
      hasErrors = true;
    }
  }

  if (formData.people <= 0 || isNaN(formData.people)) {
    if (
      formData.people !== 0 ||
      document.getElementById("people").value !== ""
    ) {
      showError("people", "not-zero");
      hasErrors = true;
    }
  }

  if (formData.tip < 0 || isNaN(formData.tip)) {
    const customInput = document.getElementById("tip-custom-input");
    if (customInput.value) {
      showError("tip-custom-input", "custom-tip-error");
      hasErrors = true;
    }
  }

  if (hasErrors) {
    resetOutput();
    return;
  }

  const result = calculate(formData.bill, formData.tip, formData.people);

  if (result === "Invalid input") {
    resetOutput();
    return;
  }

  updateOutput(result.tipPerPerson, result.amountPerPerson);
};

const validateSingleField = function (fieldType) {
  if (fieldType === "bill") {
    const billInput = document.getElementById("bill");
    const value = parseFloat(billInput.value);
    if (value <= 0 || (billInput.value && isNaN(value))) {
      showError("bill", "bill-error");
    } else {
      billInput.classList.remove("error");
      document.getElementById("bill-error").style.display = "none";
    }
  } else if (fieldType === "people") {
    const peopleInput = document.getElementById("people");
    const value = parseInt(peopleInput.value);
    if (value <= 0 || (peopleInput.value && isNaN(value))) {
      showError("people", "not-zero");
    } else {
      peopleInput.classList.remove("error");
      document.getElementById("not-zero").style.display = "none";
    }
  }

  // Only calculate if all required fields have values
  const bill = parseFloat(document.getElementById("bill").value) || 0;
  const people = parseInt(document.getElementById("people").value) || 0;
  const tipRadio = document.querySelector('input[name="tip"]:checked');
  const customTip = document.getElementById("tip-custom-input").value;

  if (bill > 0 && people > 0 && (tipRadio || customTip)) {
    validateAndCalculate();
  }
};

const showError = function (inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);

  input.classList.add("error");
  if (error) {
    error.style.display = "block";
  }
};

const clearErrors = function () {
  const inputs = document.querySelectorAll("input.error");
  inputs.forEach((input) => input.classList.remove("error"));

  const errors = document.querySelectorAll(".input-error");
  errors.forEach((error) => (error.style.display = "none"));
};

// Custom tip input handling
document.getElementById("tip-custom").addEventListener("focus", (event) => {
  const customTip = event.target.value;
  const relatedTarget = event.relatedTarget;
  if (
    customTip === "custom" &&
    relatedTarget &&
    relatedTarget.id !== "tip-custom-input"
  ) {
    document.getElementById("tip-custom-input").focus();
  }
});

document
  .getElementById("tip-custom-input")
  .addEventListener("keydown", (event) => {
    // Handle arrow left to go back to previous tip option
    if (event.key === "ArrowLeft" && event.target.selectionStart === 0) {
      const tip50 = document.getElementById("tip-50");
      tip50.focus();
      tip50.checked = true;
      event.target.value = "";
      return;
    }

    // Allow: backspace, delete, tab, escape, enter, decimal point
    if (
      [8, 9, 27, 13, 46, 110, 190].indexOf(event.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (event.keyCode === 65 && event.ctrlKey === true) ||
      (event.keyCode === 67 && event.ctrlKey === true) ||
      (event.keyCode === 86 && event.ctrlKey === true) ||
      (event.keyCode === 88 && event.ctrlKey === true) ||
      // Allow: home, end, left, right, down, up
      (event.keyCode >= 35 && event.keyCode <= 40)
    ) {
      return;
    }

    // Check if user is trying to type letters
    if (
      (event.keyCode >= 65 && event.keyCode <= 90) || // A-Z
      (event.keyCode >= 97 && event.keyCode <= 122)
    ) {
      // a-z
      showError("tip-custom-input", "custom-letters-error");
      setTimeout(() => {
        document.getElementById("custom-letters-error").style.display = "none";
        document.getElementById("tip-custom-input").classList.remove("error");
      }, 2000); // Hide error after 2 seconds
      event.preventDefault();
      return;
    }

    // Ensure that it is a number and stop the keypress
    if (
      (event.shiftKey || event.keyCode < 48 || event.keyCode > 57) &&
      (event.keyCode < 96 || event.keyCode > 105)
    ) {
      event.preventDefault();
    }
  });

// Custom tip input - auto select custom radio when typing
document
  .getElementById("tip-custom-input")
  .addEventListener("input", (event) => {
    document.getElementById("tip-custom").checked = true;

    // Only allow numbers and decimal point
    let value = event.target.value;
    const originalValue = value;

    // Remove any non-numeric characters except decimal point
    value = value.replace(/[^0-9.]/g, "");

    // Check if letters were removed (pasted content with letters)
    if (originalValue !== value && /[a-zA-Z]/.test(originalValue)) {
      showError("tip-custom-input", "custom-letters-error");
      setTimeout(() => {
        document.getElementById("custom-letters-error").style.display = "none";
        document.getElementById("tip-custom-input").classList.remove("error");
      }, 2000); // Hide error after 2 seconds
    }

    // Ensure only one decimal point
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    // Update the input value if it was changed
    if (event.target.value !== value) {
      event.target.value = value;
    }

    // Validate custom tip input for negative values
    const numValue = parseFloat(value);
    if (numValue < 0 || (value && isNaN(numValue))) {
      showError("tip-custom-input", "custom-tip-error");
    } else {
      // Only clear negative error, not letters error
      document.getElementById("custom-tip-error").style.display = "none";
      if (
        !document.getElementById("custom-letters-error").style.display ||
        document.getElementById("custom-letters-error").style.display === "none"
      ) {
        event.target.classList.remove("error");
      }
    }

    validateAndCalculate();
  });

// Reset button
document.querySelector('button[type="reset"]').addEventListener("click", () => {
  resetOutput();
  clearErrors();
  // Clear custom tip input
  document.getElementById("tip-custom-input").value = "";
});

// Add event listeners to all form inputs
const allInputs = document.querySelectorAll(
  'input[type="number"], input[type="radio"]'
);
for (let inputEntry of allInputs) {
  inputEntry.addEventListener("change", validateAndCalculate);
  inputEntry.addEventListener("input", validateAndCalculate);
}

// Special handling for people input validation
const peopleInput = document.getElementById("people");
peopleInput.addEventListener("input", function () {
  validateSingleField("people");
});

// Prevent letters in people input
peopleInput.addEventListener("keydown", function (event) {
  // Allow: backspace, delete, tab, escape, enter
  if (
    [8, 9, 27, 13].indexOf(event.keyCode) !== -1 ||
    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    (event.keyCode === 65 && event.ctrlKey === true) ||
    (event.keyCode === 67 && event.ctrlKey === true) ||
    (event.keyCode === 86 && event.ctrlKey === true) ||
    (event.keyCode === 88 && event.ctrlKey === true) ||
    // Allow: home, end, left, right, down, up
    (event.keyCode >= 35 && event.keyCode <= 40)
  ) {
    return;
  }
  // Check if user is trying to type letters
  if (
    (event.keyCode >= 65 && event.keyCode <= 90) || // A-Z
    (event.keyCode >= 97 && event.keyCode <= 122)
  ) {
    // a-z
    event.preventDefault();
    return;
  }
  // Ensure that it is a number and stop the keypress
  if (
    (event.shiftKey || event.keyCode < 48 || event.keyCode > 57) &&
    (event.keyCode < 96 || event.keyCode > 105)
  ) {
    event.preventDefault();
  }
});

// Special handling for bill input validation
const billInput = document.getElementById("bill");
billInput.addEventListener("input", function () {
  validateSingleField("bill");
});

// Prevent letters in bill input
billInput.addEventListener("keydown", function (event) {
  // Allow: backspace, delete, tab, escape, enter, decimal point
  if (
    [8, 9, 27, 13, 46, 110, 190].indexOf(event.keyCode) !== -1 ||
    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    (event.keyCode === 65 && event.ctrlKey === true) ||
    (event.keyCode === 67 && event.ctrlKey === true) ||
    (event.keyCode === 86 && event.ctrlKey === true) ||
    (event.keyCode === 88 && event.ctrlKey === true) ||
    // Allow: home, end, left, right, down, up
    (event.keyCode >= 35 && event.keyCode <= 40)
  ) {
    return;
  }
  // Check if user is trying to type letters
  if (
    (event.keyCode >= 65 && event.keyCode <= 90) || // A-Z
    (event.keyCode >= 97 && event.keyCode <= 122)
  ) {
    // a-z
    event.preventDefault();
    return;
  }
  // Ensure that it is a number and stop the keypress
  if (
    (event.shiftKey || event.keyCode < 48 || event.keyCode > 57) &&
    (event.keyCode < 96 || event.keyCode > 105)
  ) {
    event.preventDefault();
  }
});
