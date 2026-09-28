require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/product.model");

const products = [
  {
    name: "Noise Cancelling Headphones",
    description: "Wireless over-ear headphones with active noise cancellation.",
    price: 4999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    stock: 25,
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with blue switches.",
    price: 2999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600",
    stock: 10,
  },
  {
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with adjustable DPI.",
    price: 799,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600",
    stock: 40,
  },
  {
    name: "Smartphone 128GB",
    description: "6.5-inch display smartphone with triple camera setup.",
    price: 18999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
    stock: 15,
  },
  {
    name: "4K Smart TV 43-inch",
    description: "Ultra HD smart television with built-in streaming apps.",
    price: 27999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600",
    stock: 8,
  },
  {
    name: "Cotton Casual Shirt",
    description: "Slim-fit breathable cotton shirt for everyday wear.",
    price: 899,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600",
    stock: 60,
  },
  {
    name: "Denim Jacket",
    description: "Classic blue denim jacket with button closure.",
    price: 1999,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
    stock: 30,
  },
  {
    name: "Running Shoes",
    description: "Lightweight running shoes with cushioned sole.",
    price: 2499,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    stock: 45,
  },
  {
    name: "Leather Wallet",
    description: "Genuine leather bifold wallet with card slots.",
    price: 599,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600",
    stock: 0,
  },
  {
    name: "Atomic Habits",
    description:
      "An easy and proven way to build good habits and break bad ones.",
    price: 399,
    category: "Books",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600",
    stock: 100,
  },
  {
    name: "The Pragmatic Programmer",
    description: "A classic guide to becoming a better software developer.",
    price: 649,
    category: "Books",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600",
    stock: 35,
  },
  {
    name: "Clean Code",
    description: "A handbook of agile software craftsmanship.",
    price: 549,
    category: "Books",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600",
    stock: 20,
  },
  {
    name: "Non-Stick Cookware Set",
    description: "5-piece non-stick cookware set for everyday cooking.",
    price: 3499,
    category: "Home",
    image: "https://images.unsplash.com/photo-1584990347449-a5d9f800a783?w=600",
    stock: 12,
  },
  {
    name: "LED Table Lamp",
    description: "Adjustable LED desk lamp with touch controls.",
    price: 1299,
    category: "Home",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600",
    stock: 22,
  },
  {
    name: "Memory Foam Pillow",
    description: "Orthopedic memory foam pillow for neck support.",
    price: 899,
    category: "Home",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600",
    stock: 50,
  },
];

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("Missing required envvvvvvvvvv!!!!!");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Product.deleteMany({});
    console.log("Cleared existing products");

    const inserted = await Product.insertMany(products);
    console.log(`Inserted ${inserted.length} products`);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
