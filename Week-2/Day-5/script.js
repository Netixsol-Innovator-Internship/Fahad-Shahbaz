// Mobile menu functionality
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuIcon = mobileMenuBtn.querySelector("svg");

  if (!mobileMenuBtn || !mobileMenu || !mobileMenuIcon) {
    console.error("Mobile menu elements not found!");
    return;
  }

  let isMenuOpen = false;

  // SVGs for hamburger and close icons
  const hamburgerSVG = `
      <svg class="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
    </svg>
  `;
  const closeSVG = `
    <svg class="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  `;

  // Toggle mobile menu
  mobileMenuBtn.addEventListener("click", function () {
    isMenuOpen = !isMenuOpen;
    mobileMenu.classList.toggle("hidden", !isMenuOpen);
    // By selecting the SVG inside the button, we can replace it without affecting the button itself.
    mobileMenuBtn.querySelector("svg").outerHTML = isMenuOpen
      ? closeSVG
      : hamburgerSVG;
  });

  // Keyboard accessibility (Enter/Space)
  mobileMenuBtn.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      mobileMenuBtn.click();
    }
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (event) {
    if (
      isMenuOpen &&
      !mobileMenu.contains(event.target) &&
      !mobileMenuBtn.contains(event.target)
    ) {
      isMenuOpen = false;
      mobileMenu.classList.add("hidden");
      mobileMenuBtn.querySelector("svg").outerHTML = hamburgerSVG;
    }
  });

  // Close mobile menu when window is resized to desktop size
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 1024 && isMenuOpen) {
      isMenuOpen = false;
      mobileMenu.classList.add("hidden");
      mobileMenuBtn.querySelector("svg").outerHTML = hamburgerSVG;
    }
  });
});
