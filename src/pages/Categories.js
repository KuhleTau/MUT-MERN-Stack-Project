import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaArrowRight, FaSearch, FaFilter, FaStar, FaHeart } from 'react-icons/fa';
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
      
      // Test the connection first
      const healthCheck = await api.get('/health');
      console.log('Health check:', healthCheck.data);
      
      // Fetch products
      const productsResponse = await api.get('/api/products');
      console.log('Products response:', productsResponse.data);
      
      //  extract categories from products
      const uniqueCategories = [...new Set(productsResponse.data.map(p => p.category))];
      const categoriesList = uniqueCategories.map(cat => ({
        _id: cat,
        name: cat,
        slug: cat.toLowerCase().replace(/\s+/g, '-'),
        productCount: productsResponse.data.filter(p => p.category === cat).length
      }));
      
      setCategories(categoriesList);
      setProducts(productsResponse.data);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response) {
        setError(`Server error: ${error.response.status} - ${error.response.data.message}`);
      } else if (error.request) {
        setError('Network error: Could not connect to server');
      } else {
        setError('Error: ' + error.message);
      }
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
      <Container className="text-center my-5 py-5">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3 text-muted">Loading products...</p>
      </Container>
    );
  }

  return (
    <Container fluid="lg">
      {/* Hero Section */}
      <Row className="my-5">
        <Col>
          <div className="text-center">
            <h1 className="display-5 fw-bold text-dark mb-3">CSK Categories</h1>
            <p className="lead text-muted">
              Discover amazing products organized into convenient categories for effortless shopping
            </p>
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

      {/* Search and Filter Bar */}
      <Row className="mb-4">
        <Col lg={8} md={7} className="mb-3 mb-md-0">
          <InputGroup size="lg">
            <InputGroup.Text className="bg-white border-end-0">
              <FaSearch className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search across all categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-start-0"
            />
          </InputGroup>
        </Col>
        <Col lg={4} md={5}>
          <InputGroup size="lg">
            <InputGroup.Text className="bg-white">
              <FaFilter className="text-muted" />
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
          <div className="d-flex flex-wrap gap-2 justify-content-center mb-4">
            <Button
              variant={selectedCategory === 'all' ? 'dark' : 'outline-dark'}
              onClick={() => setSelectedCategory('all')}
              className="rounded-pill px-4"
            >
              All Categories
            </Button>
            {categories.map(category => (
              <Button
                key={category._id}
                variant={selectedCategory === category.slug ? 'dark' : 'outline-dark'}
                onClick={() => setSelectedCategory(category.slug)}
                className="rounded-pill d-flex align-items-center"
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
            <div className="bg-light p-4 rounded-3">
              <h2 className="text-dark mb-2">
                {categories.find(cat => cat.slug === selectedCategory)?.icon}
                {' '}
                {categories.find(cat => cat.slug === selectedCategory)?.name}
              </h2>
              <p className="text-muted mb-0">
                {categories.find(cat => cat.slug === selectedCategory)?.description || 
                 `Explore our collection of ${categories.find(cat => cat.slug === selectedCategory)?.name} products`}
              </p>
            </div>
          </Col>
        </Row>
      )}

      {/* Products Grid for Selected Category */}
      {selectedCategory !== 'all' && sortedProducts.length > 0 && (
        <Row className="mb-5">
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="mb-0">Popular in {categories.find(cat => cat.slug === selectedCategory)?.name}</h3>
              <span className="text-muted">{sortedProducts.length} products</span>
            </div>
            <Row>
              {sortedProducts.map(product => (
                <Col xl={3} lg={4} md={6} className="mb-4" key={product._id}>
                  <Card className="h-100 product-card shadow-sm border-0 position-relative">
                    <div className="position-absolute top-0 end-0 m-2">
                      <Button variant="outline-light" size="sm" className="p-1 rounded-circle">
                        <FaHeart className="text-muted" />
                      </Button>
                    </div>
                    <Card.Img
                      variant="top"
                      src={product.image}
                      alt={product.name}
                      style={{ height: '220px', objectFit: 'contain', padding: '1rem' }}
                      className="bg-light"
                    />
                    <Card.Body className="d-flex flex-column p-3">
                      <Card.Title className="h6 mb-2" style={{ minHeight: '48px' }}>{product.name}</Card.Title>
                      
                      <div className="d-flex align-items-center mb-2">
                        <div className="text-warning">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              size={14} 
                              className={i < Math.floor(product.rating) ? "text-warning" : "text-muted"} 
                            />
                          ))}
                        </div>
                        <small className="text-muted ms-2">({product.reviewCount || 0})</small>
                      </div>

                      <div className="mt-auto">
                        <div className="d-flex align-items-center mb-2">
                          <span className="text-dark fw-bold fs-5 me-2">
                            R{product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-muted text-decoration-line-through small">
                              R{product.originalPrice}
                            </span>
                          )}
                          {product.discount && (
                            <Badge bg="danger" className="ms-2">
                              Save {product.discount}%
                            </Badge>
                          )}
                        </div>

                        <Button
                          variant="dark"
                          className="w-100"
                          onClick={() => handleAddToCart(product)}
                        >
                          <FaShoppingBag className="me-2" />
                          Add to Cart
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

      {/* Featured Categories */}
      {featuredCategories.length > 0 && (
        <Row className="mb-5">
          <Col>
            <h2 className="mb-4">Featured Categories</h2>
            <Row>
              {featuredCategories.map(category => (
                <Col lg={6} className="mb-4" key={category._id}>
                  <Card className="h-100 category-card shadow-sm border-0 overflow-hidden">
                    <Row className="g-0">
                      <Col md={5}>
                        <Card.Img
                          src={category.image || "https://via.placeholder.com/300x200?text=CSK"}
                          alt={category.name}
                          className="h-100"
                          style={{ objectFit: 'cover', minHeight: '200px' }}
                        />
                      </Col>
                      <Col md={7}>
                        <Card.Body className="d-flex flex-column h-100 p-4">
                          <div className="d-flex align-items-center mb-3">
                            <span className="display-6 me-2 text-primary">{category.icon}</span>
                            <Card.Title className="h4 mb-0 text-dark">{category.name}</Card.Title>
                          </div>
                          <Card.Text className="text-muted flex-grow-1">
                            {category.description || `Explore our ${category.name} collection`}
                          </Card.Text>
                          <div className="d-flex justify-content-between align-items-center">
                            <Badge bg="outline-dark" className="fs-6 border">
                              {category.productCount} products
                            </Badge>
                            <Button
                              as={Link}
                              to={`/products?category=${category.slug}`}
                              variant="outline-dark"
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
                  <Card className="h-100 category-card shadow-sm border-0 text-center p-4">
                    <div className="display-3 mb-3 text-primary">{category.icon}</div>
                    <Card.Body className="d-flex flex-column p-0">
                      <Card.Title className="h5 text-dark">{category.name}</Card.Title>
                      <Card.Text className="text-muted small flex-grow-1">
                        {category.description || `Browse ${category.productCount} products`}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <Badge bg="light" text="dark" className="fs-7">
                          {category.productCount} items
                        </Badge>
                        <Button
                          as={Link}
                          to={`/products?category=${category.slug}`}
                          variant="dark"
                          size="sm"
                          className="rounded-pill px-3"
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
          <div className="bg-dark text-white p-5 rounded-3 text-center">
            <h3 className="mb-4">Shop with Confidence at CSK</h3>
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
          <div className="bg-light p-5 rounded-3 border">
            <h3 className="mb-3">Ready to Start Shopping?</h3>
            <p className="text-muted mb-4">
              Browse our complete collection or use our advanced search to find exactly what you need
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Button as={Link} to="/products" variant="dark" size="lg" className="px-4 rounded-pill">
                View All Products
              </Button>
              <Button as={Link} to="/deals" variant="outline-dark" size="lg" className="px-4 rounded-pill">
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