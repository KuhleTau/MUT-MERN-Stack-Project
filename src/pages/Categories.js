import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaArrowRight, FaSearch, FaFilter, FaStar } from 'react-icons/fa';
import { useCart } from '../components/cart/CartContext';
import { toast } from 'react-toastify';

const Categories = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    {
      id: 1,
      name: 'Electronics',
      slug: 'electronics',
      description: 'Latest gadgets and tech devices for modern living',
      image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop',
      productCount: 156,
      featured: true,
      icon: '📱'
    },
    {
      id: 2,
      name: 'Fashion & Clothing',
      slug: 'fashion',
      description: 'Trendy clothes and accessories for every style',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
      productCount: 289,
      featured: true,
      icon: '👕'
    },
    {
      id: 3,
      name: 'Home & Kitchen',
      slug: 'home',
      description: 'Everything you need for a comfortable home',
      image: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=400&h=300&fit=crop',
      productCount: 203,
      featured: false,
      icon: '🏠'
    },
    {
      id: 4,
      name: 'Sports & Fitness',
      slug: 'sports',
      description: 'Equipment for an active and healthy lifestyle',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      productCount: 134,
      featured: true,
      icon: '⚽'
    },
    {
      id: 5,
      name: 'Beauty & Health',
      slug: 'beauty',
      description: 'Skincare, makeup, and wellness products',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
      productCount: 178,
      featured: false,
      icon: '💄'
    },
    {
      id: 6,
      name: 'Books & Stationery',
      slug: 'books',
      description: 'Reading materials and office supplies',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
      productCount: 95,
      featured: false,
      icon: '📚'
    },
    {
      id: 7,
      name: 'Toys & Games',
      slug: 'toys',
      description: 'Fun and educational toys for all ages',
      image: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=400&h=300&fit=crop',
      productCount: 167,
      featured: true,
      icon: '🎮'
    },
    {
      id: 8,
      name: 'Jewelry & Accessories',
      slug: 'jewelry',
      description: 'Elegant pieces to complete your look',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ad5e5?w=400&h=300&fit=crop',
      productCount: 122,
      featured: false,
      icon: '💎'
    }
  ];

  // Sample products for each category
  const categoryProducts = {
    electronics: [
      { id: 1, name: 'Wireless Headphones', price: 129.99, rating: 4.5, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop' },
      { id: 2, name: 'Smart Watch', price: 249.99, rating: 4.3, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop' },
      { id: 3, name: 'Bluetooth Speaker', price: 79.99, rating: 4.4, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=200&fit=crop' }
    ],
    fashion: [
      { id: 4, name: 'Designer Jeans', price: 89.99, rating: 4.6, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=200&fit=crop' },
      { id: 5, name: 'Leather Jacket', price: 199.99, rating: 4.7, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=200&fit=crop' },
      { id: 6, name: 'Running Shoes', price: 119.99, rating: 4.5, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop' }
    ],
    sports: [
      { id: 7, name: 'Yoga Mat', price: 39.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop' },
      { id: 8, name: 'Dumbbell Set', price: 149.99, rating: 4.6, image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=300&h=200&fit=crop' },
      { id: 9, name: 'Basketball', price: 29.99, rating: 4.4, image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=200&fit=crop' }
    ],
    toys: [
      { id: 10, name: 'Lego Set', price: 49.99, rating: 4.9, image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=300&h=200&fit=crop' },
      { id: 11, name: 'Remote Car', price: 34.99, rating: 4.3, image: 'https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=300&h=200&fit=crop' },
      { id: 12, name: 'Board Game', price: 24.99, rating: 4.7, image: 'https://images.unsplash.com/photo-1589985270826-4b7fe135a9c4?w=300&h=200&fit=crop' }
    ]
  };

  const featuredCategories = categories.filter(cat => cat.featured);
  const allCategories = categories.filter(cat => !cat.featured);

  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      quantity: 1,
      category: selectedCategory
    });
    toast.success(`${product.name} added to cart!`);
  };

  const getCategoryProducts = () => {
    if (selectedCategory === 'all') {
      return Object.values(categoryProducts).flat();
    }
    return categoryProducts[selectedCategory] || [];
  };

  const filteredProducts = getCategoryProducts().filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      {/* Hero Section */}
      <Row className="my-5">
        <Col>
          <div className="text-center">
            <h1 className="display-4 fw-bold text-primary mb-3">Shop by Category</h1>
            <p className="lead text-muted">
              Discover amazing products organized into convenient categories for effortless shopping
            </p>
          </div>
        </Col>
      </Row>

      {/* Search and Filter Bar */}
      <Row className="mb-5">
        <Col lg={8}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search across all categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col lg={4}>
          <InputGroup>
            <InputGroup.Text>
              <FaFilter />
            </InputGroup.Text>
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </Form.Select>
          </InputGroup>
        </Col>
      </Row>

      {/* Category Navigation */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            <Button
              variant={selectedCategory === 'all' ? 'primary' : 'outline-primary'}
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.slug ? 'primary' : 'outline-primary'}
                onClick={() => setSelectedCategory(category.slug)}
                className="d-flex align-items-center"
              >
                <span className="me-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </Col>
      </Row>

      {/* Selected Category Header */}
      {selectedCategory !== 'all' && (
        <Row className="mb-4">
          <Col>
            <div className="bg-light p-4 rounded-3 text-center">
              <h2 className="text-primary">
                {categories.find(cat => cat.slug === selectedCategory)?.icon}
                {' '}
                {categories.find(cat => cat.slug === selectedCategory)?.name}
              </h2>
              <p className="text-muted mb-0">
                {categories.find(cat => cat.slug === selectedCategory)?.description}
              </p>
            </div>
          </Col>
        </Row>
      )}

      {/* Products Grid for Selected Category */}
      {selectedCategory !== 'all' && filteredProducts.length > 0 && (
        <Row className="mb-5">
          <Col>
            <h3 className="mb-4">Popular in {categories.find(cat => cat.slug === selectedCategory)?.name}</h3>
            <Row>
              {filteredProducts.map(product => (
                <Col xl={3} lg={4} md={6} className="mb-4" key={product.id}>
                  <Card className="h-100 product-card shadow-sm border-0">
                    <Card.Img
                      variant="top"
                      src={product.image}
                      alt={product.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="h6">{product.name}</Card.Title>
                      
                      <div className="d-flex align-items-center mb-2">
                        <div className="text-warning">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar className="text-muted" />
                        </div>
                        <small className="text-muted ms-2">({product.rating})</small>
                      </div>

                      <Card.Text className="text-primary fw-bold fs-5 mb-3">
                        ${product.price}
                      </Card.Text>

                      <Button
                        variant="primary"
                        className="mt-auto"
                        onClick={() => handleAddToCart(product)}
                      >
                        <FaShoppingBag className="me-2" />
                        Add to Cart
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      )}

      {/* Featured Categories */}
      <Row className="mb-5">
        <Col>
          <h2 className="mb-4">Featured Categories</h2>
          <Row>
            {featuredCategories.map(category => (
              <Col lg={6} className="mb-4" key={category.id}>
                <Card className="h-100 category-card shadow-sm border-0">
                  <Row className="g-0">
                    <Col md={5}>
                      <Card.Img
                        src={category.image}
                        alt={category.name}
                        className="h-100"
                        style={{ objectFit: 'cover', minHeight: '200px' }}
                      />
                    </Col>
                    <Col md={7}>
                      <Card.Body className="d-flex flex-column h-100">
                        <div className="d-flex align-items-center mb-2">
                          <span className="display-6 me-2">{category.icon}</span>
                          <Card.Title className="h4 mb-0">{category.name}</Card.Title>
                        </div>
                        <Card.Text className="text-muted flex-grow-1">
                          {category.description}
                        </Card.Text>
                        <div className="d-flex justify-content-between align-items-center">
                          <Badge bg="primary" className="fs-6">
                            {category.productCount} products
                          </Badge>
                          <Button
                            as={Link}
                            to={`/products?category=${category.slug}`}
                            variant="outline-primary"
                            className="d-flex align-items-center"
                          >
                            Shop Now <FaArrowRight className="ms-2" />
                          </Button>
                        </div>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* All Categories Grid */}
      <Row className="mb-5">
        <Col>
          <h2 className="mb-4">Explore All Categories</h2>
          <Row>
            {allCategories.map(category => (
              <Col xl={3} lg={4} md={6} className="mb-4" key={category.id}>
                <Card className="h-100 category-card shadow-sm border-0 text-center">
                  <div className="display-1 mb-3">{category.icon}</div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="h5">{category.name}</Card.Title>
                    <Card.Text className="text-muted small flex-grow-1">
                      {category.description}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <Badge bg="secondary" className="fs-7">
                        {category.productCount} items
                      </Badge>
                      <Button
                        as={Link}
                        to={`/products?category=${category.slug}`}
                        variant="primary"
                        size="sm"
                      >
                        <FaShoppingBag className="me-1" />
                        Explore
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* Category Statistics */}
      <Row className="my-5">
        <Col>
          <div className="bg-primary text-white p-5 rounded-3 text-center">
            <h3 className="mb-3">Shop with Confidence</h3>
            <Row>
              <Col md={3} className="mb-3">
                <div className="display-4 fw-bold">{categories.reduce((sum, cat) => sum + cat.productCount, 0)}+</div>
                <p className="mb-0">Products Available</p>
              </Col>
              <Col md={3} className="mb-3">
                <div className="display-4 fw-bold">{categories.length}+</div>
                <p className="mb-0">Categories</p>
              </Col>
              <Col md={3} className="mb-3">
                <div className="display-4 fw-bold">24/7</div>
                <p className="mb-0">Customer Support</p>
              </Col>
              <Col md={3} className="mb-3">
                <div className="display-4 fw-bold">100%</div>
                <p className="mb-0">Quality Guaranteed</p>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      {/* Call to Action */}
      <Row className="my-5">
        <Col className="text-center">
          <div className="bg-light p-5 rounded-3">
            <h3 className="mb-3">Ready to Start Shopping?</h3>
            <p className="text-muted mb-4">
              Browse our complete collection or use our advanced search to find exactly what you need
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Button as={Link} to="/products" variant="primary" size="lg">
                View All Products
              </Button>
              <Button as={Link} to="/deals" variant="outline-primary" size="lg">
                See Current Deals
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Categories;