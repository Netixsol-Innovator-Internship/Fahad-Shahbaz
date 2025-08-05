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

  // Hide the count badge entirely when count is 0
  if (count <= 0) {
    countSpan.style.display = "none";
    plural.style.display = "none"; // removes the 's' from 'notifications'
  } else if (count == 1) {
    countSpan.style.display = "inline-flex"; // Make sure it's visible
    plural.style.display = "none"; // removes the 's' from 'notifications'
  } else {
    countSpan.style.display = "inline-flex"; // Make sure it's visible
    plural.style.display = "inline"; // Show the 's' for plural
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
  count = 0; // Set count to 0
  manageCount(count); // Use manageCount to handle display logic
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

  // Only apply dark mode if specifically saved as dark
  // No more system preference fallback - default to light

  // Apply class immediately to prevent flash
  if (isDark) {
    document.body.classList.add("dark-mode");
  }
})();

// Handle the icon update after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  let isDark = savedTheme === "dark";

  // No system preference check - default to light theme

  // Make sure the correct icon is set after DOM is ready
  const themeToggleIcon = document.querySelector("#theme-toggle img");
  if (isDark && themeToggleIcon) {
    themeToggleIcon.src = "./images/sun.svg";
  }
});
