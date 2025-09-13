// scripts/initDB.js
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const sampleProducts = [
  {
    name: 'Premium Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 199.99,
    originalPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    category: 'electronics',
    rating: 4.5,
    onSale: true
  },
  {
    name: 'Smart Watch Series 5',
    description: 'Feature-rich smartwatch with health monitoring',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    category: 'electronics',
    rating: 4.3,
    onSale: false
  },
  {
    name: 'Running Shoes',
    description: 'Comfortable running shoes for athletes',
    price: 89.99,
    originalPrice: 119.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    category: 'sports',
    rating: 4.7,
    onSale: true
  },

];

const initDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/stylecart');
    console.log('Connected to MongoDB');

    // Clear existing items
    await Item.deleteMany({});
    console.log('Cleared existing items');

    // Add sample products
    await Item.insertMany(sampleProducts);
    console.log('Added sample products');

    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initDB();