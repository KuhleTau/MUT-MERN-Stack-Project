import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFire, FaClock, FaTag, FaSearch, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useCart } from '../components/cart/CartContext';
import { toast } from 'react-toastify';
import api from '../services/api';

const Deals = () => {
  const { addToCart } = useCart();
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('discount');

  useEffect(() => {
    fetchDeals();
  }, []);

  useEffect(() => {
    let filtered = deals.filter(deal =>
      deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sorts deals
    switch (sortBy) {
      case 'discount':
        filtered.sort((a, b) => b.discount - a.discount);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'ending':
        
        filtered.sort((a, b) => a.timeLeft.localeCompare(b.timeLeft));
        break;
      default:
        break;
    }

    setFilteredDeals(filtered);
  }, [searchTerm, sortBy, deals]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/api/deals');
      setDeals(response.data);
      setFilteredDeals(response.data);
    } catch (error) {
      console.error('Error fetching deals:', error);
      setError('Failed to load deals. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const featuredDeals = filteredDeals.filter(deal => deal.featured);
  const otherDeals = filteredDeals.filter(deal => !deal.featured);

  if (loading) {
    return (
      <Container className="text-center my-5 py-5">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3 text-muted">Loading hot deals...</p>
      </Container>
    );
  }

  return (
    <Container fluid="lg">
      {/* Hero Section */}
      <Row className="my-5">
        <Col>
          <div className="text-center">
            <FaFire size={48} className="text-danger mb-3" />
            <h1 className="display-5 fw-bold text-dark mb-3">CSK Hot Deals</h1>
            <p className="lead text-muted">
              Limited-time offers and exclusive discounts. Shop now before they're gone!
            </p>
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

      {/* Search and Filter */}
      <Row className="mb-4">
        <Col md={8} className="mb-3 mb-md-0">
          <InputGroup size="lg">
            <InputGroup.Text className="bg-white border-end-0">
              <FaSearch className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-start-0"
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select
            size="lg"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="discount">Highest Discount</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="ending">Ending Soon</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Featured Deals */}
      {featuredDeals.length > 0 && (
        <Row className="mb-5">
          <Col>
            <h2 className="mb-4 text-dark">
              <FaFire className="text-danger me-2" />
              Featured Deals
            </h2>
            <Row>
              {featuredDeals.map(deal => (
                <Col lg={6} className="mb-4" key={deal._id}>
                  <Card className="h-100 deal-card border-danger shadow-sm">
                    <Badge bg="danger" className="position-absolute top-0 start-0 m-3 fs-6">
                      -{deal.discount}% OFF
                    </Badge>
                    <div className="position-absolute top-0 end-0 m-2">
                      <Button variant="outline-light" size="sm" className="p-1 rounded-circle">
                        <FaHeart className="text-muted" />
                      </Button>
                    </div>
                    <Row className="g-0">
                      <Col md={5}>
                        <Card.Img
                          src={deal.image}
                          alt={deal.name}
                          className="h-100"
                          style={{ objectFit: 'contain', minHeight: '220px', padding: '1rem', backgroundColor: '#f8f9fa' }}
                        />
                      </Col>
                      <Col md={7}>
                        <Card.Body className="d-flex flex-column h-100 p-4">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <Card.Title className="h5 text-dark">{deal.name}</Card.Title>
                            <Badge bg="warning" text="dark" className="fs-7">
                              <FaClock className="me-1" />
                              {deal.timeLeft}
                            </Badge>
                          </div>
                          
                          <div className="mb-3">
                            <span className="h4 text-danger fw-bold">R{deal.price}</span>
                            <span className="text-muted text-decoration-line-through ms-2">
                              R{deal.originalPrice}
                            </span>
                          </div>

                          <div className="progress mb-3" style={{ height: '8px' }}>
                            <div 
                              className="progress-bar bg-danger" 
                              role="progressbar" 
                              style={{ width: `${deal.remainingStock / deal.totalStock * 100}%` }}
                              aria-valuenow={deal.remainingStock} 
                              aria-valuemin="0" 
                              aria-valuemax={deal.totalStock}
                            ></div>
                          </div>
                          <small className="text-muted mb-3">{deal.remainingStock} of {deal.totalStock} remaining</small>

                          <Card.Text className="text-muted small flex-grow-1">
                            Save R{(deal.originalPrice - deal.price).toFixed(2)} on this amazing deal!
                          </Card.Text>

                          <div className="d-flex justify-content-between align-items-center mt-auto">
                            <Badge bg="outline-dark" text="dark" className="border">
                              {deal.category}
                            </Badge>
                            <Button
                              variant="danger"
                              className="rounded-pill px-3"
                              onClick={() => handleAddToCart(deal)}
                            >
                              <FaShoppingCart className="me-1" />
                              Add to Cart
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

      {/* All Deals Grid */}
      <Row className="mb-5">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0 text-dark">
              <FaTag className="text-primary me-2" />
              All Deals
            </h2>
            <span className="text-muted">{otherDeals.length} deals available</span>
          </div>
          <Row>
            {otherDeals.length === 0 ? (
              <Col className="text-center my-5 py-5">
                <FaTag size={48} className="text-muted mb-3" />
                <h4 className="text-dark">No deals found</h4>
                <p className="text-muted">Try adjusting your search criteria</p>
                <Button as={Link} to="/categories" variant="dark" className="mt-3 rounded-pill">
                  Browse Categories
                </Button>
              </Col>
            ) : (
              otherDeals.map(deal => (
                <Col xl={3} lg={4} md={6} className="mb-4" key={deal._id}>
                  <Card className="h-100 deal-card shadow-sm border-0">
                    <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
                      -{deal.discount}%
                    </Badge>
                    <div className="position-absolute top-0 end-0 m-2">
                      <Button variant="outline-light" size="sm" className="p-1 rounded-circle">
                        <FaHeart className="text-muted" />
                      </Button>
                    </div>
                    <Badge bg="warning" text="dark" className="position-absolute top-0 end-0 m-2 fs-7" style={{ transform: 'translateY(2.5rem)' }}>
                      <FaClock className="me-1" />
                      {deal.timeLeft}
                    </Badge>
                    
                    <Card.Img
                      variant="top"
                      src={deal.image}
                      alt={deal.name}
                      style={{ height: '200px', objectFit: 'contain', padding: '1rem', backgroundColor: '#f8f9fa' }}
                    />
                    
                    <Card.Body className="d-flex flex-column p-3">
                      <Card.Title className="h6 text-dark mb-2" style={{ minHeight: '48px' }}>{deal.name}</Card.Title>
                      
                      <div className="mb-2">
                        <span className="h5 text-danger fw-bold">R{deal.price}</span>
                        <span className="text-muted text-decoration-line-through ms-2 small">
                          R{deal.originalPrice}
                        </span>
                      </div>

                      <div className="progress mb-2" style={{ height: '6px' }}>
                        <div 
                          className="progress-bar bg-danger" 
                          role="progressbar" 
                          style={{ width: `${deal.remainingStock / deal.totalStock * 100}%` }}
                          aria-valuenow={deal.remainingStock} 
                          aria-valuemin="0" 
                          aria-valuemax={deal.totalStock}
                        ></div>
                      </div>
                      <small className="text-muted mb-3">{deal.remainingStock} of {deal.totalStock} remaining</small>

                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center">
                          <Badge bg="light" text="dark" className="fs-7">
                            {deal.category}
                          </Badge>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="rounded-pill"
                            onClick={() => handleAddToCart(deal)}
                          >
                            <FaShoppingCart />
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Col>
      </Row>

      {/* Newsletter Signup */}
      <Row className="my-5">
        <Col className="text-center">
          <div className="bg-dark text-white p-5 rounded-3">
            <h3 className="mb-3">Never Miss a Deal at CSK!</h3>
            <p className="mb-4 text-light">
              Subscribe to our newsletter and be the first to know about exclusive offers and flash sales
            </p>
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              <Form.Control
                type="email"
                placeholder="Enter your email"
                style={{ maxWidth: '300px' }}
                size="lg"
                className="rounded-pill"
              />
              <Button variant="light" className="text-dark rounded-pill px-4">
                Subscribe
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Deals;