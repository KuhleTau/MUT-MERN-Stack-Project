// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/stylecart')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// Schemas & Models
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  image: { type: String },
  category: { type: String, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  onSale: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  discount: { type: Number, default: 0, min: 0 },
  timeLeft: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String },
  image: { type: String },
  productCount: { type: Number, default: 0, min: 0 },
  featured: { type: Boolean, default: false },
  icon: { type: String }
});

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String },
    price: { type: Number, min: 0 },
    quantity: { type: Number, min: 1 },
    image: { type: String }
  }],
  total: { type: Number, required: true, min: 0 },
  status: { type: String, default: 'pending', enum: ['pending', 'shipped', 'delivered', 'cancelled'] },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: { type: String, default: 'credit_card' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Category = mongoose.model('Category', CategorySchema);
const Order = mongoose.model('Order', OrderSchema);

// Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user.email !== 'admin@stylecart.com') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// ================= Routes =================

// Auth
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { _id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Login successful',
      token,
      user: { _id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

app.get('/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// Products
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, featured, onSale } = req.query;
    let filter = {};
    if (category && category !== 'all') filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (featured === 'true') filter.featured = true;
    if (onSale === 'true') filter.onSale = true;

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error fetching product' });
  }
});

app.post('/api/products', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, originalPrice, image, category, onSale, featured, discount, timeLeft } = req.body;
    if (!name || !price || !category) return res.status(400).json({ message: 'Name, price, and category are required' });

    const product = new Product({ name, description, price, originalPrice, image, category, onSale, featured, discount, timeLeft, userId: req.user.userId });
    await product.save();

    await Category.findOneAndUpdate({ slug: category }, { $inc: { productCount: 1 } });
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error creating product' });
  }
});

app.put('/api/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error updating product' });
  }
});

app.delete('/api/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await Product.findByIdAndDelete(req.params.id);
    await Category.findOneAndUpdate({ slug: product.category }, { $inc: { productCount: -1 } });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
});

// Categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
});

app.post('/api/categories', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, slug, description, image, featured, icon } = req.body;
    if (!name || !slug) return res.status(400).json({ message: 'Name and slug are required' });

    const category = new Category({ name, slug, description, image, featured, icon });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Server error creating category' });
  }
});

// Deals
app.get('/api/deals', async (req, res) => {
  try {
    const deals = await Product.find({ onSale: true });
    res.json(deals);
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({ message: 'Server error fetching deals' });
  }
});

// Orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { items, total, shippingAddress, paymentMethod } = req.body;
    if (!items || items.length === 0 || !total) return res.status(400).json({ message: 'Items and total are required' });

    const order = new Order({ userId: req.user.userId, items, total, shippingAddress, paymentMethod });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error creating order' });
  }
});

// Init sample data
app.post('/api/init-data', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await Product.deleteMany({});
    await Category.deleteMany({});

    const categories = [
      { name: 'Electronics', slug: 'electronics', description: 'Latest gadgets and tech devices', icon: '📱', featured: true },
      { name: 'Fashion', slug: 'fashion', description: 'Trendy clothes and accessories', icon: '👕', featured: true },
      { name: 'Home & Kitchen', slug: 'home', description: 'Everything for your home', icon: '🏠' },
      { name: 'Sports', slug: 'sports', description: 'Equipment for sports and fitness', icon: '⚽', featured: true },
      { name: 'Beauty', slug: 'beauty', description: 'Skincare and beauty products', icon: '💄' },
      { name: 'Books', slug: 'books', description: 'Books and stationery', icon: '📚' },
      { name: 'Toys', slug: 'toys', description: 'Toys and games', icon: '🎮', featured: true },
      { name: 'Jewelry', slug: 'jewelry', description: 'Elegant jewelry pieces', icon: '💎' }
    ];

    await Category.insertMany(categories);

    const products = [
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 79.99,
        originalPrice: 129.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        category: 'electronics',
        rating: 4.5,
        onSale: true,
        discount: 38,
        timeLeft: '2 days left',
        featured: true
      },
      {
        name: 'Smart Watch Series 5',
        description: 'Feature-rich smartwatch with health monitoring',
        price: 199.99,
        originalPrice: 299.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
        category: 'electronics',
        rating: 4.3,
        onSale: true,
        discount: 33,
        timeLeft: '1 day left',
        featured: true
      },
      {
        name: 'Running Shoes',
        description: 'Comfortable running shoes for athletes',
        price: 59.99,
        originalPrice: 89.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        category: 'sports',
        rating: 4.7,
        onSale: true,
        discount: 33,
        timeLeft: '3 days left'
      }
    ];

    await Product.insertMany(products);

    for (const category of categories) {
      const count = await Product.countDocuments({ category: category.slug });
      await Category.findOneAndUpdate({ slug: category.slug }, { productCount: count });
    }

    res.json({ message: 'Sample data initialized successfully' });
  } catch (error) {
    console.error('Error initializing data:', error);
    res.status(500).json({ message: 'Server error initializing data' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
