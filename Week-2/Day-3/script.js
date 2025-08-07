// Cart functionality with localStorage
let cart = [];
let cartCount = 0;

// localStorage functions
function saveCartToLocalStorage() {
  localStorage.setItem("mcdonalds_cart", JSON.stringify(cart));
  localStorage.setItem("mcdonalds_cart_count", cartCount.toString());
}

function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem("mcdonalds_cart");
  const savedCount = localStorage.getItem("mcdonalds_cart_count");

  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
  if (savedCount) {
    cartCount = parseInt(savedCount);
  }

  // Update cart display on page load
  updateCartCount();
  updateCartModal();
}

const menuData = [
  {
    id: 1,
    title: "Royal Cheese Burger with extra Fries",
    description: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium",
    price: "GBP 23.10",
    priceValue: 23.1,
    images: {
      burger: "./images/burger-one.png",
      fries: "./images/fries-one.png",
      drink: "./images/drink-one.png",
    },
    alt: "Royal Cheese Burger with extra Fries",
  },
  {
    id: 2,
    title: "The classics for 3",
    description:
      "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
    price: "GBP 23.10",
    priceValue: 23.1,
    images: {
      burger: "./images/burger-two.png",
      fries: "./images/fries-two.png",
      drink: "./images/drink-two.png",
    },
    alt: "The classics for 3",
  },
  {
    id: 3,
    title: "Big Mac Deluxe",
    description:
      "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
    price: "GBP 23.10",
    priceValue: 23.1,
    images: {
      burger: "./images/burger-three.png",
      fries: "./images/fries-three.png",
      drink: "./images/drink-three.png",
    },
    alt: "Big Mac Deluxe",
  },
  {
    id: 4,
    title: "Quarter Pounder Meal",
    description:
      "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
    price: "GBP 23.10",
    priceValue: 23.1,
    images: {
      burger: "./images/burger-four.png",
      fries: "./images/fries-four.png",
      drink: "./images/drink-four.png",
    },
    alt: "Quarter Pounder Meal",
  },
  {
    id: 5,
    title: "McChicken Deluxe",
    description:
      "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
    price: "GBP 23.10",
    priceValue: 23.1,
    images: {
      burger: "./images/burger-five.png",
      fries: "./images/fries-five.png",
      drink: "./images/drink-five.png",
    },
    alt: "McChicken Deluxe",
  },
  {
    id: 6,
    title: "Family Bundle",
    description:
      "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
    price: "GBP 23.10",
    priceValue: 23.1,
    images: {
      burger: "./images/burger-six.png",
      fries: "./images/fries-six.png",
      drink: "./images/drink-six.png",
    },
    alt: "Family Bundle",
  },
];

// Add to cart function
// Add item to cart
function addToCart(id, title, price, image) {
  const menuItem = menuData.find((item) => item.id == id);
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id,
      title,
      price,
      priceValue: menuItem ? menuItem.priceValue : 23.1, // fallback price
      image,
      quantity: 1,
    });
  }

  updateCartCount();
  saveCartToLocalStorage(); // Save to localStorage
  showNotification();
}

// Remove from cart function
function removeFromCart(itemId) {
  const itemIndex = cart.findIndex((cartItem) => cartItem.id == itemId);
  if (itemIndex > -1) {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity -= 1;
    } else {
      cart.splice(itemIndex, 1);
    }
    updateCartCount();
    saveCartToLocalStorage(); // Save to localStorage
    updateCartModal();
  }
}

// Increase cart quantity (for modal plus buttons)
function increaseCartQuantity(itemId) {
  const existingItem = cart.find((item) => item.id == itemId);
  if (existingItem) {
    existingItem.quantity += 1;
    updateCartCount();
    saveCartToLocalStorage(); // Save to localStorage
    updateCartModal();
  }
}

// Update cart count
function updateCartCount() {
  cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartBadge = document.getElementById("cart-badge");

  if (cartCount > 0) {
    cartBadge.textContent = cartCount;
    cartBadge.classList.remove("hidden");
    cartBadge.classList.add("flex");
  } else {
    cartBadge.classList.add("hidden");
    cartBadge.classList.remove("flex");
  }
}

// Show cart notification
function showCartNotification() {
  const notification = document.getElementById("cart-notification");
  notification.classList.remove("translate-x-full");
  notification.classList.add("translate-x-0");

  setTimeout(() => {
    notification.classList.remove("translate-x-0");
    notification.classList.add("translate-x-full");
  }, 2000);
}

// Calculate total price
function calculateTotal() {
  return cart
    .reduce((total, item) => total + item.priceValue * item.quantity, 0)
    .toFixed(2);
}

// Show cart modal
function showCartModal() {
  // First update the cart modal content
  updateCartModal();

  const modal = document.getElementById("cart-modal");

  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";
  } else {
    console.error("Cart modal element not found!");
  }
}

// Hide cart modal
function hideCartModal() {
  const modal = document.getElementById("cart-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.style.overflow = "";
  // Reset to cart view when closing
  document.getElementById("order-confirmation").classList.add("hidden");
  document.getElementById("cart-content").classList.remove("hidden");
}

// Update cart modal content
function updateCartModal() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const finalTotal = document.getElementById("final-total");
  const nextStepBtn = document.getElementById("next-step-btn");

  // Clear existing items
  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = "";
  }

  if (cart.length === 0) {
    if (cartItemsContainer) {
      cartItemsContainer.innerHTML =
        '<p class="text-gray-500 text-center py-8">Your cart is empty</p>';
    }
    if (nextStepBtn) {
      nextStepBtn.disabled = true;
    }
  } else {
    cart.forEach((item) => {
      // Extract short name (first part before "with" or "for")
      const shortName = item.title.split(/\s+(with|for)\s+/i)[0].trim();

      const cartItemHTML = `
        <div class="flex items-center justify-between py-4 bg-[#D9D9D999] rounded-lg px-4 mb-2 hover:bg-[#03081F] hover:text-white transition-all duration-300 group">
          <div class="flex items-center flex-1">
            <img src="${item.image}" alt="${item.title}" class="w-12 h-12 rounded-lg object-cover mr-3">
            <div class="w-0.5 h-12 bg-gray-300 group-hover:bg-white mr-3"></div>
            <div class="flex-1">
              <h4 class="font-medium text-gray-900 group-hover:text-white">${shortName}</h4>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button 
              onclick="removeFromCart('${item.id}')"
              class="w-8 h-8 bg-black rounded-full flex items-center justify-center transition-colors group-hover:bg-white group-hover:text-black"
            >
              <span class="text-lg font-bold text-white group-hover:text-black">−</span>
            </button>
            <span class="font-medium text-black bg-white rounded-md px-3 py-1 min-w-[20px] text-center group-hover:bg-black group-hover:text-white">${item.quantity}</span>
            <button 
              onclick="increaseCartQuantity('${item.id}')"
              class="w-8 h-8 bg-black rounded-full flex items-center justify-center transition-colors group-hover:bg-white group-hover:text-black"
            >
              <span class="text-lg font-bold text-white group-hover:text-black">+</span>
            </button>
          </div>
        </div>
      `;
      if (cartItemsContainer) {
        cartItemsContainer.innerHTML += cartItemHTML;
      }
    });
    if (nextStepBtn) {
      nextStepBtn.disabled = false;
    }
  }

  // Update totals
  const total = calculateTotal();
  const totalToPay = document.getElementById("total-to-pay");

  if (cartTotal) {
    cartTotal.textContent = `GBP ${total}`;
  }
  if (finalTotal) {
    finalTotal.textContent = `GBP ${total}`;
  }
  if (totalToPay) {
    totalToPay.textContent = total;
  }
}

// Clear cart function
function clearCart() {
  cart = [];
  cartCount = 0;
  saveCartToLocalStorage();
  updateCartCount();
  updateCartModal();
}

// Show order confirmation
function showOrderConfirmation() {
  // Store the final total before clearing cart
  const finalTotal = document.getElementById("total-to-pay").textContent;
  document.getElementById("final-total").textContent = `GBP ${finalTotal}`;

  document.getElementById("cart-content").classList.add("hidden");
  document.getElementById("order-confirmation").classList.remove("hidden");

  // Clear the cart after showing confirmation
  clearCart();
}

// Go back to cart
function goBackToCart() {
  document.getElementById("order-confirmation").classList.add("hidden");
  document.getElementById("cart-content").classList.remove("hidden");
  // Since cart is cleared after order confirmation, update the modal
  updateCartModal();
}

// Show notification
function showNotification(message = "Item added to cart!") {
  const notification = document.getElementById("cart-notification");
  notification.querySelector("p").textContent = message;
  notification.classList.remove("translate-x-full", "opacity-0");
  notification.classList.add("opacity-100");

  setTimeout(() => {
    notification.classList.add("translate-x-full", "opacity-0");
    notification.classList.remove("opacity-100");
  }, 2000);
}

// Create menu card HTML
function createMenuCard(item, imageType) {
  return `
    <div class="bg-white rounded-xl shadow-lg overflow-hidden relative p-4 sm:p-6">
      <!-- Responsive layout: column on small screens, row on larger screens -->
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-${
        item.id === 1 ? "center" : "between"
      }">
        
        <!-- Image section - top on mobile, right on desktop -->
        <div class="relative flex-shrink-0 order-1 sm:order-2 mb-4 sm:mb-0 flex justify-center sm:block">
          <div class="w-32 h-32 sm:${
            item.id === 1 ? "w-40 sm:h-44" : "size-40"
          } rounded-2xl relative overflow-hidden">
            <img
              src="${item.images[imageType]}"
              alt="${item.alt}"
              class="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90"
            />
            
            <!-- Add button inside image container -->
            <button
              onclick="addToCart('${item.id}', '${item.title}', '${
    item.price
  }', '${item.images[imageType]}')"
              class="absolute bottom-0 right-0 bg-white text-white flex items-center justify-center hover:bg-opacity-90 transition-colors shadow-lg cursor-pointer"
              style="width: 60px; height: 61px; border-top-left-radius: 35px; border-bottom-right-radius: 12px; opacity: 0.9; background-color: white;"
            >
              <!-- Plus button image -->
              <img src="./images/plus-btn.png" alt="Add to cart" class="size-8 sm:size-12 object-contain">
            </button>
          </div>
        </div>

        <!-- Content section - bottom on mobile, left on desktop -->
        <div class="flex-1 order-2 sm:order-1 sm:pr-4">
          <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight line-clamp-2 text-center sm:text-left">
            ${item.title}
          </h3>
          <p class="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-6 leading-relaxed line-clamp-3 text-center sm:text-left">
            ${item.description}
          </p>
          <p class="text-base sm:text-${
            item.id === 1 ? "base" : "xl"
          } font-bold sm:font-${
    item.id === 1 ? "extrabold" : "bold"
  } text-gray-900 text-center sm:text-left">${item.price}</p>
        </div>
      </div>
    </div>
  `;
}

// Render menu sections
function renderMenuSections() {
  const sections = [
    { id: "burgers-grid", imageType: "burger" },
    { id: "fries-grid", imageType: "fries" },
    { id: "drinks-grid", imageType: "drink" },
  ];

  sections.forEach((section) => {
    const grid = document.getElementById(section.id);
    if (grid) {
      grid.innerHTML = menuData
        .map((item) => createMenuCard(item, section.imageType))
        .join("");
    }
  });
}

// Initialize when DOM is loaded - No async needed!
document.addEventListener("DOMContentLoaded", function () {
  renderMenuSections();
  loadCartFromLocalStorage(); // Load cart from localStorage on page load
  initializeMobileMenu();
});

// Mobile Menu Functionality
function initializeMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const line1 = document.getElementById("line1");
  const line2 = document.getElementById("line2");
  const line3 = document.getElementById("line3");

  let isMenuOpen = false;

  // Toggle mobile menu
  mobileMenuBtn.addEventListener("click", function () {
    isMenuOpen = !isMenuOpen;

    if (isMenuOpen) {
      // Open menu
      mobileMenu.classList.remove(
        "-translate-y-full",
        "opacity-0",
        "invisible"
      );
      mobileMenu.classList.add("translate-y-0", "opacity-100", "visible");

      // Animate hamburger to X
      line1.style.transform = "rotate(45deg) translate(4px, 4px)";
      line2.style.opacity = "0";
      line3.style.transform = "rotate(-45deg) translate(4px, -4px)";

      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      // Close menu
      mobileMenu.classList.add("-translate-y-full", "opacity-0", "invisible");
      mobileMenu.classList.remove("translate-y-0", "opacity-100", "visible");

      // Reset hamburger
      line1.style.transform = "rotate(0) translate(0, 0)";
      line2.style.opacity = "1";
      line3.style.transform = "rotate(0) translate(0, 0)";

      // Restore body scroll
      document.body.style.overflow = "";
    }
  });

  // Close menu when clicking on menu links
  const mobileMenuLinks = mobileMenu.querySelectorAll("a");
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", function () {
      isMenuOpen = false;

      // Close menu
      mobileMenu.classList.add("-translate-y-full", "opacity-0", "invisible");
      mobileMenu.classList.remove("translate-y-0", "opacity-100", "visible");

      // Reset hamburger
      line1.style.transform = "rotate(0) translate(0, 0)";
      line2.style.opacity = "1";
      line3.style.transform = "rotate(0) translate(0, 0)";

      // Restore body scroll
      document.body.style.overflow = "";
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (event) {
    if (
      isMenuOpen &&
      !mobileMenuBtn.contains(event.target) &&
      !mobileMenu.contains(event.target)
    ) {
      isMenuOpen = false;

      // Close menu
      mobileMenu.classList.add("-translate-y-full", "opacity-0", "invisible");
      mobileMenu.classList.remove("translate-y-0", "opacity-100", "visible");

      // Reset hamburger
      line1.style.transform = "rotate(0) translate(0, 0)";
      line2.style.opacity = "1";
      line3.style.transform = "rotate(0) translate(0, 0)";

      // Restore body scroll
      document.body.style.overflow = "";
    }
  });

  // Close menu on escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isMenuOpen) {
      isMenuOpen = false;

      // Close menu
      mobileMenu.classList.add("-translate-y-full", "opacity-0", "invisible");
      mobileMenu.classList.remove("translate-y-0", "opacity-100", "visible");

      // Reset hamburger
      line1.style.transform = "rotate(0) translate(0, 0)";
      line2.style.opacity = "1";
      line3.style.transform = "rotate(0) translate(0, 0)";

      // Restore body scroll
      document.body.style.overflow = "";
    }
  });
}
