// Elements stored in variables
const dayIn = document.getElementById("dayIn");
const monthIn = document.getElementById("monthIn");
const yearIn = document.getElementById("yearIn");
const dayOut = document.getElementById("dayOut");
const monthOut = document.getElementById("monthOut");
const yearOut = document.getElementById("yearOut");
const calculateBtn = document.getElementById("calculateBtn");
const errorStyle = "0.5px solid var(--Light-red)";

// Add input event listeners to allow only numbers and real-time validation
dayIn.addEventListener("input", () => {
  dayIn.value = dayIn.value.replace(/[^0-9]/g, "");
  // Limit to 2 digits and pad with leading zero if needed on blur
  if (dayIn.value.length > 2) {
    dayIn.value = dayIn.value.slice(0, 2);
  }
  if (dayIn.value) validateDay(); // Real-time validation
});

dayIn.addEventListener("blur", () => {
  // Add leading zero for single digit days
  if (dayIn.value.length === 1 && dayIn.value !== "0") {
    dayIn.value = "0" + dayIn.value;
  }
  validateDay();
});

monthIn.addEventListener("input", () => {
  monthIn.value = monthIn.value.replace(/[^0-9]/g, "");
  // Limit to 2 digits and pad with leading zero if needed on blur
  if (monthIn.value.length > 2) {
    monthIn.value = monthIn.value.slice(0, 2);
  }
  if (monthIn.value) validateMonth(); // Real-time validation
});

monthIn.addEventListener("blur", () => {
  // Add leading zero for single digit months
  if (monthIn.value.length === 1 && monthIn.value !== "0") {
    monthIn.value = "0" + monthIn.value;
  }
  validateMonth();
});

yearIn.addEventListener("input", () => {
  yearIn.value = yearIn.value.replace(/[^0-9]/g, "");
  // Limit to 4 digits for year
  if (yearIn.value.length > 4) {
    yearIn.value = yearIn.value.slice(0, 4);
  }
  if (yearIn.value) validateYear(); // Real-time validation
});

// Calculate Button
calculateBtn.addEventListener("click", () => {
  const D = dayIn.value;
  const M = monthIn.value;
  const Y = yearIn.value;
  const birthday = `${Y}-${M}-${D}`;

  if (validateDay() && validateMonth() && validateYear()) {
    console.log("Done");
  } else {
    return;
  }

  // Age Calculation
  const today = new Date();
  const birthDate = new Date(Y, M - 1, D); // Month is 0-indexed

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  // Adjust if current month/day is before birth month/day
  if (months < 0) {
    years = years - 1;
    months = months + 12;
  }

  if (days < 0) {
    months = months - 1;
    if (months < 0) {
      years = years - 1;
      months = months + 12;
    }
    // Get days in previous month to add to negative days
    const prevMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
    const prevYear =
      today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
    days += getNoOfDays(prevYear, prevMonth + 1);
  }

  // Display Values
  dayOut.innerText = days;
  monthOut.innerText = months;
  yearOut.innerText = years;
});

// Get Number of Days in a particular months
function getNoOfDays(y, m) {
  return new Date(y, m, 0).getDate();
}

// Validation Part

// For year validation
yearIn.addEventListener("blur", () => {
  validateYear();
});

// Validate Day function
const validateDay = () => {
  const D = dayIn.value;
  const M = monthIn.value;
  const Y = yearIn.value;
  if (D == "") {
    showMessage(dayIn, "This field is required", errorStyle);
    return false;
  } else if (!isValidNumber(D)) {
    showMessage(dayIn, "Must be a valid number", errorStyle);
    return false;
  } else if (parseInt(D) < 1 || parseInt(D) > 31) {
    showMessage(dayIn, "Must be a valid day", errorStyle);
    return false;
  } else if (M && Y && !validDay(Y, M, D)) {
    showMessage(dayIn, "Must be a valid day for this month/year", errorStyle);
    return false;
  } else {
    showMessage(dayIn, "", "");
    return true;
  }
};

const validateMonth = () => {
  const M = monthIn.value;
  if (M == "") {
    showMessage(monthIn, "This field is required", errorStyle);
    return false;
  } else if (!isValidNumber(M)) {
    showMessage(monthIn, "Must be a valid number", errorStyle);
    return false;
  } else if (parseInt(M) < 1 || parseInt(M) > 12) {
    showMessage(monthIn, "Must be a valid month", errorStyle);
    return false;
  } else {
    showMessage(monthIn, "", "");
    return true;
  }
};

const validateYear = () => {
  const Y = yearIn.value;
  const M = monthIn.value;
  const D = dayIn.value;
  if (Y == "") {
    showMessage(yearIn, "This field is required", errorStyle);
    return false;
  } else if (!isValidNumber(Y)) {
    showMessage(yearIn, "Must be a valid number", errorStyle);
    return false;
  } else if (parseInt(Y) < 1582) {
    showMessage(
      yearIn,
      "Year must be 1582 or later (Gregorian calendar)",
      errorStyle
    );
    return false;
  } else if (M && D && !validYear(Y, M, D)) {
    showMessage(yearIn, "Must be in past", errorStyle);
    return false;
  } else {
    showMessage(yearIn, "", "");
    return true;
  }
};

// Check if input is a valid number
function isValidNumber(value) {
  return /^\d+$/.test(value) && !isNaN(value);
}

// Validate Day
function validDay(y, m, d) {
  // Convert to numbers to ensure proper comparison
  const year = parseInt(y);
  const month = parseInt(m);
  const day = parseInt(d);

  // Check if day is within valid range for the specific month and year
  if (day > getNoOfDays(year, month) || day < 1) return false;
  return true;
}

// validate Month
function validMonth(m) {
  const month = parseInt(m);
  if (month > 12 || month < 1) return false;
  return true;
}

// Validate Year
function validYear(y, m, d) {
  const year = parseInt(y);
  const month = parseInt(m);
  const day = parseInt(d);

  const secondDate = new Date();
  const firstDate = new Date(year, month - 1, day); // month is 0-indexed in Date constructor

  if (firstDate.setHours(0, 0, 0, 0) <= secondDate.setHours(0, 0, 0, 0)) {
    return true;
  }
  return false;
}

// Display Message
function showMessage(elem, msg, border) {
  elem.style.border = border;
  elem.nextElementSibling.innerText = msg;
}
