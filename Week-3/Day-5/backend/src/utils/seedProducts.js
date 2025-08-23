const mongoose = require("mongoose");
const Product = require("../models/productSchema");

const defaultProducts = [
  {
    name: "Earl Grey Tea",
    description:
      "A classic British tea blend with bergamot oil for a distinctive flavor",
    price: 15.99,
    category: "Black Tea",
    origin: "India/Sri Lanka",
    flavor: "Citrusy, Floral",
    qualities: ["Aromatic", "Classic", "Premium"],
    caffeine: "High",
    allergens: ["None"],
    image: "https://res.cloudinary.com/demo/image/upload/tea1.jpg",
  },
  {
    name: "Green Dragon Well",
    description:
      "Premium Chinese green tea with a delicate, sweet flavor and beautiful flat leaves",
    price: 22.5,
    category: "Green Tea",
    origin: "China",
    flavor: "Sweet, Grassy",
    qualities: ["Premium", "Organic", "Hand-picked"],
    caffeine: "Medium",
    allergens: ["None"],
    image: "https://res.cloudinary.com/demo/image/upload/tea2.jpg",
  },
  {
    name: "Chamomile Dreams",
    description: "Soothing herbal tea perfect for relaxation and bedtime",
    price: 12.99,
    category: "Herbal Tea",
    origin: "Europe",
    flavor: "Floral, Honey-like",
    qualities: ["Caffeine-free", "Calming", "Natural"],
    caffeine: "None",
    allergens: ["None"],
    image: "https://res.cloudinary.com/demo/image/upload/tea3.jpg",
  },
  {
    name: "Royal Pu-erh",
    description:
      "Aged Chinese tea with rich, earthy flavors that improve with time",
    price: 35.0,
    category: "Pu-erh Tea",
    origin: "China",
    flavor: "Earthy, Smooth",
    qualities: ["Aged", "Premium", "Traditional"],
    caffeine: "Medium",
    allergens: ["None"],
    image: "https://res.cloudinary.com/demo/image/upload/tea4.jpg",
  },
  {
    name: "Himalayan White",
    description:
      "Rare white tea from high-altitude gardens with subtle, delicate taste",
    price: 45.0,
    category: "White Tea",
    origin: "Nepal",
    flavor: "Subtle, Clean",
    qualities: ["Rare", "Hand-harvested", "Premium"],
    caffeine: "Low",
    allergens: ["None"],
    image: "https://res.cloudinary.com/demo/image/upload/tea5.jpg",
  },
];

const seedProducts = async () => {
  try {
    console.log("Starting product seeding...");

    const existingCount = await Product.countDocuments();

    if (existingCount === 0) {
      await Product.insertMany(defaultProducts);
      console.log(`✅ Created ${defaultProducts.length} sample products`);
    } else {
      console.log(
        `⚠️ Products already exist in database (${existingCount} products found)`
      );
    }

    console.log("Product seeding completed!");
  } catch (error) {
    console.error("Error seeding products:", error);
  }
};

module.exports = seedProducts;
