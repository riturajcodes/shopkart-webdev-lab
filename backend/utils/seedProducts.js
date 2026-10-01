require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/product.model");

const products = [
  {
    name: "Noise Cancelling Headphones",
    description: "Wireless over-ear headphones with active noise cancellation.",
    price: 4999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600",
    stock: 25,
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with blue switches.",
    price: 2999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600",
    stock: 10,
  },
  {
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with adjustable DPI.",
    price: 799,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600",
    stock: 40,
  },
  {
    name: "Smartphone 128GB",
    description: "6.5-inch display smartphone with triple camera setup.",
    price: 18999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600",
    stock: 15,
  },
  {
    name: "4K Smart TV 43-inch",
    description: "Ultra HD smart television with built-in streaming apps.",
    price: 27999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1571415060716-baff5f717c37?w=600",
    stock: 8,
  },
  {
    name: "Cotton Casual Shirt",
    description: "Slim-fit breathable cotton shirt for everyday wear.",
    price: 899,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600",
    stock: 60,
  },
  {
    name: "Denim Jacket",
    description: "Classic blue denim jacket with button closure.",
    price: 1999,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600",
    stock: 30,
  },
  {
    name: "Running Shoes",
    description: "Lightweight running shoes with cushioned sole.",
    price: 2499,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600",
    stock: 45,
  },
  {
    name: "Leather Wallet",
    description: "Genuine leather bifold wallet with card slots.",
    price: 599,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
    stock: 0,
  },
  {
    name: "Atomic Habits",
    description:
      "An easy and proven way to build good habits and break bad ones.",
    price: 399,
    category: "Books",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600",
    stock: 100,
  },
  {
    name: "The Pragmatic Programmer",
    description: "A classic guide to becoming a better software developer.",
    price: 649,
    category: "Books",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600",
    stock: 35,
  },
  {
    name: "Clean Code",
    description: "A handbook of agile software craftsmanship.",
    price: 549,
    category: "Books",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600",
    stock: 20,
  },
  {
    name: "Non-Stick Cookware Set",
    description: "5-piece non-stick cookware set for everyday cooking.",
    price: 3499,
    category: "Home",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600",
    stock: 12,
  },
  {
    name: "LED Table Lamp",
    description: "Adjustable LED desk lamp with touch controls.",
    price: 1299,
    category: "Home",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600",
    stock: 22,
  },
  {
    name: "Memory Foam Pillow",
    description: "Orthopedic memory foam pillow for neck support.",
    price: 899,
    category: "Home",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600",
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
