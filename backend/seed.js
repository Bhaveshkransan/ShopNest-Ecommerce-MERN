const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

const User = require("./model/User");
const Product = require("./model/Product");
const Order = require("./model/Order");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri || (!mongoUri.startsWith("mongodb://") && !mongoUri.startsWith("mongodb+srv://"))) {
    throw new Error("MONGODB_URI must be set in .env and start with mongodb:// or mongodb+srv://");
  }

  await mongoose.connect(mongoUri);
};

const seed = async () => {
  await connectDB();

  const usersData = [
    {
      name: "Admin User",
      email: "admin@example.com",
      password: bcrypt.hashSync("Admin123!", 10),
      role: "admin",
      verified: true,
    },
    {
      name: "John Doe",
      email: "john@example.com",
      password: bcrypt.hashSync("User123!", 10),
      role: "user",
      verified: true,
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      password: bcrypt.hashSync("User123!", 10),
      role: "user",
      verified: false,
    },
  ];

  const productsData = [
    {
      name: "Classic T-Shirt",
      description: "Soft cotton tee with a comfortable fit.",
      price: 19.99,
      category: "Clothing",
      stock: 120,
      imageUrl: "/images/tshirt.png",
    },
    {
      name: "Wireless Headphones",
      description: "Over-ear headphones with noise cancellation.",
      price: 89.99,
      category: "Electronics",
      stock: 45,
      imageUrl: "/images/headphones.png",
    },
    {
      name: "Coffee Mug",
      description: "Ceramic mug for hot beverages.",
      price: 12.5,
      category: "Home",
      stock: 80,
      imageUrl: "/images/mug.png",
    },
    {
      name: "Minimalist Leather Watch",
      description: "Sleek wristwatch with a genuine leather strap.",
      price: 119.99,
      category: "Accessories",
      stock: 30,
      imageUrl: "/images/watch.png",
    },
    {
      name: "Smart Fitness Tracker",
      description: "Track steps, heart rate, and sleep with high accuracy.",
      price: 49.99,
      category: "Electronics",
      stock: 50,
      imageUrl: "/images/tracker.png",
    },
    {
      name: "Ergonomic Office Chair",
      description: "High back support with adjustable mesh seating.",
      price: 189.99,
      category: "Office",
      stock: 15,
      imageUrl: "/images/chair.png",
    },
    {
      name: "Stainless Steel Water Bottle",
      description: "Double-walled vacuum insulated bottle for hot/cold drinks.",
      price: 24.99,
      category: "Home",
      stock: 100,
      imageUrl: "/images/bottle.png",
    },
    {
      name: "Premium Leather Wallet",
      description: "Handcrafted bi-fold leather wallet with multiple slots.",
      price: 39.99,
      category: "Accessories",
      stock: 60,
      imageUrl: "/images/wallet.png",
    },
  ];

  const existingUsers = await User.find({ email: { $in: usersData.map((item) => item.email) } });
  const usersToInsert = usersData.filter((item) => !existingUsers.some((user) => user.email === item.email));

  if (usersToInsert.length > 0) {
    await User.insertMany(usersToInsert);
    console.log(`Inserted ${usersToInsert.length} users.`);
  } else {
    console.log("Users already exist. Skipping user seed.");
  }

  // Clear existing products and orders to ensure clean links and up-to-date image paths
  await Product.deleteMany({});
  await Order.deleteMany({});
  console.log("Cleared existing products and orders.");

  await Product.insertMany(productsData);
  console.log(`Successfully seeded ${productsData.length} products.`);

  const allUsers = await User.find({ email: { $in: usersData.map((item) => item.email) } });
  const allProducts = await Product.find({ name: { $in: productsData.map((item) => item.name) } });
  const john = allUsers.find((user) => user.email === "john@example.com");
  const jane = allUsers.find((user) => user.email === "jane@example.com");
  const tshirt = allProducts.find((product) => product.name === "Classic T-Shirt");
  const headphones = allProducts.find((product) => product.name === "Wireless Headphones");
  const mug = allProducts.find((product) => product.name === "Coffee Mug");

  if (!john || !jane || !tshirt || !headphones || !mug) {
    throw new Error("Required seeded users/products were not found after seeding.");
  }

  const orderCount = await Order.countDocuments();
  if (orderCount === 0) {
    const ordersData = [
      {
        user: john._id,
        products: [
          { product: tshirt._id, quantity: 2, price: tshirt.price },
          { product: mug._id, quantity: 1, price: mug.price },
        ],
        totalAmount: tshirt.price * 2 + mug.price,
        paymentMethod: "Credit Card",
        paymentId: "PAY123456XYZ",
        status: "Delivered",
        address: {
          fullName: "John Doe",
          street: "123 Main St",
          city: "New York",
          state: "NY",
          postalCode: "10001",
          country: "USA",
        },
      },
      {
        user: jane._id,
        products: [
          { product: headphones._id, quantity: 1, price: headphones.price },
        ],
        totalAmount: headphones.price,
        paymentMethod: "PayPal",
        paymentId: "PAY987654XYZ",
        status: "Processing",
        address: {
          fullName: "Jane Smith",
          street: "456 Oak Ave",
          city: "San Francisco",
          state: "CA",
          postalCode: "94103",
          country: "USA",
        },
      },
    ];

    await Order.insertMany(ordersData);
    console.log(`Inserted ${ordersData.length} orders.`);
  } else {
    console.log("Orders already exist. Skipping order seed.");
  }

  mongoose.disconnect();
  console.log("Database seeding complete.");
};

seed().catch((error) => {
  console.error("Seed failed:", error.message);
  mongoose.disconnect();
  process.exit(1);
});
