const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/userSchema");

const SALT_ROUNDS = 12;

const defaultUsers = [
  {
    name: "Super Admin",
    email: "superadmin@email.com",
    password: "super",
    role: "superadmin",
  },
  {
    name: "Admin User",
    email: "admin@email.com",
    password: "admin",
    role: "admin",
  },
];

const seedUsers = async () => {
  try {
    console.log("Starting user seeding...");

    for (const userData of defaultUsers) {
      const existingUser = await User.findOne({ email: userData.email });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(
          userData.password,
          SALT_ROUNDS
        );

        const newUser = new User({
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
        });

        await newUser.save();
        console.log(`✅ Created ${userData.role}: ${userData.email}`);
      } else {
        console.log(`⚠️ User already exists: ${userData.email}`);
      }
    }

    console.log("User seeding completed!");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};

module.exports = seedUsers;
