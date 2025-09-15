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
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json());
app.use(helmet());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Connect to MongoDB
mongoose.connect("mongodb+srv://caleblombard:admin12345@cluster0.vbtoafl.mongodb.net/shoppingcart")
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// Schemas & Models
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  image: { type: String },
  category: { type: String, required: true },
  stock_quantity: { type: Number, default: 0, min: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  onSale: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  discount: { type: Number, default: 0, min: 0 },
  timeLeft: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentMethod: { type: String, default: 'credit_card' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);

// Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
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

    const token = jwt.sign({ 
      userId: user._id, 
      email: user.email,
      isAdmin: user.isAdmin 
    }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email,
        isAdmin: user.isAdmin 
      }
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

    const token = jwt.sign({ 
      userId: user._id, 
      email: user.email,
      isAdmin: user.isAdmin 
    }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });

    res.json({
      message: 'Login successful',
      token,
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email,
        isAdmin: user.isAdmin 
      }
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

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
});

// Admin Product Management
app.post('/api/products', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, originalPrice, image, category, stock_quantity, onSale, featured, discount, timeLeft, rating } = req.body;
    if (!name || !price || !category) return res.status(400).json({ message: 'Name, price, and category are required' });

    const product = new Product({ 
      name, 
      description, 
      price, 
      originalPrice, 
      image, 
      category, 
      stock_quantity: stock_quantity || 0,
      onSale, 
      featured, 
      discount, 
      timeLeft,
      rating,
      userId: req.user.userId 
    });
    await product.save();

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

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      { $set: { ...req.body, updated_at: Date.now() } }, 
      { new: true, runValidators: true }
    );
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
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
});

// Deals - Get products on sale
app.get('/api/deals', async (req, res) => {
  try {
    const deals = await Product.find({ onSale: true });
    res.json(deals);
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({ message: 'Server error fetching deals' });
  }
});

// Create first admin user (one-time setup)
app.post('/api/create-first-admin', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({ 
      name, 
      email, 
      password: hashedPassword,
      isAdmin: true 
    });
    await user.save();

    res.status(201).json({
      message: 'Admin user created successfully',
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email,
        isAdmin: user.isAdmin 
      }
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ message: 'Server error creating admin user' });
  }
});

// Checkout route
app.post('/api/checkout', authenticateToken, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    
    console.log('Received checkout request from user:', req.user.userId);
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate required shipping fields
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'postalCode', 'country'];
    for (const field of requiredFields) {
      if (!shippingAddress[field]) {
        return res.status(400).json({ message: `Shipping address ${field} is required` });
      }
    }

    // Calculate total amount
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Create order
    const order = new Order({
      userId: req.user.userId,
      items: items.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'credit_card',
      status: 'pending'
    });

    await order.save();
    console.log('Order saved successfully:', order._id);

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        _id: order._id,
        totalAmount: order.totalAmount,
        status: order.status,
        items: order.items
      }
    });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ 
      message: 'Server error during checkout',
      error: error.message 
    });
  }
});

// Get user orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'name image');
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// Get specific order
app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      userId: req.user.userId 
    }).populate('items.productId', 'name image');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error fetching order' });
  }
});

// ================= ADMIN ORDER MANAGEMENT ENDPOINTS =================

// Admin test endpoint - ADD THIS ENDPOINT
app.get('/api/admin/test', authenticateToken, requireAdmin, (req, res) => {
  res.json({ 
    message: 'Admin access successful',
    user: req.user
  });
});

// Get all orders (Admin only)
app.get('/api/admin/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('Admin orders endpoint hit by user:', req.user.userId);
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');
    
    console.log(`Found ${orders.length} orders`);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// Update order status (Admin only)
app.put('/api/admin/orders/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`Updating order ${id} with status: ${status}`);
    
    const order = await Order.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true } // Return the updated document
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    console.log('Order updated successfully:', order);
    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get order details (Admin only)
app.get('/api/admin/orders/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('items.productId', 'name image');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error fetching order' });
  }
});

// ================= DEBUG ENDPOINTS =================

// Debug endpoint to check if products exist
app.get('/api/debug/products', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    const products = await Product.find().limit(5);
    res.json({
      totalProducts: count,
      sampleProducts: products,
      message: 'Database connection successful'
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route works!', timestamp: new Date().toISOString() });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Handle 404 errors
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});