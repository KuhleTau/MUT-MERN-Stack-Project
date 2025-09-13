import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaArrowRight, FaSearch, FaFilter, FaStar } from 'react-icons/fa';
import { useCart } from '../components/cart/CartContext';
import { toast } from 'react-toastify';
import api from '../services/api';

const Categories = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch both categories and products
      const [categoriesResponse, productsResponse] = await Promise.all([
        api.get('/api/categories'),
        api.get('/api/products')
      ]);
      
      setCategories(categoriesResponse.data);
      setProducts(productsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      quantity: 1
    });
    toast.success(`${product.name} added to cart!`);
  };

  // Get products for the selected category
  const getCategoryProducts = () => {
    if (selectedCategory === 'all') {
      return products;
    }
    return products.filter(product => product.category === selectedCategory);
  };

  const filteredProducts = getCategoryProducts().filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'featured':
      default:
        return a.featured === b.featured ? 0 : a.featured ? -1 : 1;
    }
  });

  const featuredCategories = categories.filter(cat => cat.featured);
  const allCategories = categories.filter(cat => !cat.featured);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

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

      {error && <Alert variant="danger">{error}</Alert>}

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
                key={category._id}
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
      {selectedCategory !== 'all' && sortedProducts.length > 0 && (
        <Row className="mb-5">
          <Col>
            <h3 className="mb-4">Popular in {categories.find(cat => cat.slug === selectedCategory)?.name}</h3>
            <Row>
              {sortedProducts.map(product => (
                <Col xl={3} lg={4} md={6} className="mb-4" key={product._id}>
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
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < Math.floor(product.rating) ? "text-warning" : "text-muted"} />
                          ))}
                        </div>
                        <small className="text-muted ms-2">({product.rating})</small>
                      </div>

                      <Card.Text className="text-primary fw-bold fs-5 mb-3">
                        ${product.price}
                        {product.originalPrice && (
                          <span className="text-muted text-decoration-line-through ms-2 small">
                            ${product.originalPrice}
                          </span>
                        )}
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
      {featuredCategories.length > 0 && (
        <Row className="mb-5">
          <Col>
            <h2 className="mb-4">Featured Categories</h2>
            <Row>
              {featuredCategories.map(category => (
                <Col lg={6} className="mb-4" key={category._id}>
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
      )}

      {/* All Categories Grid */}
      {allCategories.length > 0 && (
        <Row className="mb-5">
          <Col>
            <h2 className="mb-4">Explore All Categories</h2>
            <Row>
              {allCategories.map(category => (
                <Col xl={3} lg={4} md={6} className="mb-4" key={category._id}>
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
      )}

      {/* Category Statistics */}
      <Row className="my-5">
        <Col>
          <div className="bg-primary text-white p-5 rounded-3 text-center">
            <h3 className="mb-3">Shop with Confidence</h3>
            <Row>
              <Col md={3} className="mb-3">
                <div className="display-4 fw-bold">{products.length}+</div>
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