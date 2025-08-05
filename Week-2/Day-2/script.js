let count = 3;
let unread = document.querySelectorAll(".unread");
const plural = document.querySelector(".plural");
const countSpan = document.querySelector(".count");
// Button to mark all notifications as read
// This button will remove the 'unread' class from all notifications and update count to 0
const markAllAsRead = document.querySelector(".mark-all-read");

// Function to remove the dot from the notification element
// Use universal selector to select all the elements with the class 'dot' inside the notification element
function removeDots(elem) {
  const dot = elem.querySelector("* > .dot");
  dot.remove();
}

// Function to manage the count display and pluralization
// This function updates the count displayed in the span and hides the plural 's' if count is 1 or less
function manageCount(count) {
  countSpan.textContent = count;
  if (count <= 1) {
    plural.style.display = "none"; // removes the 's' from 'notifications'
  }
}

// Initial call to manageCount to set the initial state
// For individual notifications, it will remove the 'unread' class and update the count
unread.forEach((elem) => {
  elem.addEventListener("click", () => {
    elem.classList.remove("unread");
    removeDots(elem);
    count--;
    manageCount(count);
    unread = document.querySelectorAll(".unread");
  });
});

// Event listener for the "Mark All as Read" button
// When clicked, it will set the count to 0, remove the 'unread' and dot from all notifications
markAllAsRead.addEventListener("click", () => {
  countSpan.textContent = 0;
  unread.forEach((elem) => {
    elem.classList.remove("unread");
    removeDots(elem);
  });
});

// Light/Dark mode toggle
const themeToggle = document.getElementById("theme-toggle");

// Function to set the theme
const setTheme = (isDark) => {
  const themeToggleIcon = themeToggle.querySelector("img");

  if (isDark) {
    document.body.classList.add("dark-mode");
    // Set icon source directly
    themeToggleIcon.setAttribute("src", "./images/sun.svg");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark-mode");
    // Set icon source directly
    themeToggleIcon.setAttribute("src", "./images/moon.svg");
    localStorage.setItem("theme", "light");
  }
};

// Event listener for the theme toggle button
themeToggle.addEventListener("click", () => {
  const isDarkMode = document.body.classList.contains("dark-mode");
  setTheme(!isDarkMode);
});

// Apply theme immediately when script loads to prevent flash
(function applyInitialTheme() {
  const savedTheme = localStorage.getItem("theme");
  let isDark = savedTheme === "dark";

  if (
    !savedTheme &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    isDark = true;
  }

  // Apply class immediately to prevent flash
  if (isDark) {
    document.body.classList.add("dark-mode");
  }
})();

// Handle the icon update after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  let isDark = savedTheme === "dark";

  if (
    !savedTheme &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    isDark = true;
  }

  // Make sure the correct icon is set after DOM is ready
  const themeToggleIcon = document.querySelector("#theme-toggle img");
  if (isDark && themeToggleIcon) {
    themeToggleIcon.src = "./images/sun.svg";
  }
});
