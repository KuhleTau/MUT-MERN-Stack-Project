import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFire, FaClock, FaTag, FaSearch, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../components/cart/CartContext';
import { toast } from 'react-toastify';

const Deals = () => {
  const { addToCart } = useCart();
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('discount');

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockDeals = [
      {
        id: 1,
        name: 'Wireless Headphones',
        price: 79.99,
        originalPrice: 129.99,
        discount: 38,
        image: 'https://via.placeholder.com/300x300?text=Headphones+Deal',
        category: 'electronics',
        timeLeft: '2 days left',
        featured: true,
        rating: 4.5
      },
      {
        id: 2,
        name: 'Smart Watch Series 5',
        price: 199.99,
        originalPrice: 299.99,
        discount: 33,
        image: 'https://via.placeholder.com/300x300?text=Smart+Watch+Deal',
        category: 'electronics',
        timeLeft: '1 day left',
        featured: true,
        rating: 4.3
      },
      {
        id: 3,
        name: 'Running Shoes',
        price: 59.99,
        originalPrice: 89.99,
        discount: 33,
        image: 'https://via.placeholder.com/300x300?text=Running+Shoes+Deal',
        category: 'sports',
        timeLeft: '3 days left',
        featured: false,
        rating: 4.7
      },
      {
        id: 4,
        name: 'Coffee Maker Pro',
        price: 89.99,
        originalPrice: 129.99,
        discount: 31,
        image: 'https://via.placeholder.com/300x300?text=Coffee+Maker+Deal',
        category: 'home',
        timeLeft: '5 days left',
        featured: false,
        rating: 4.2
      },
      {
        id: 5,
        name: 'Yoga Mat Premium',
        price: 29.99,
        originalPrice: 49.99,
        discount: 40,
        image: 'https://via.placeholder.com/300x300?text=Yoga+Mat+Deal',
        category: 'sports',
        timeLeft: '12 hours left',
        featured: true,
        rating: 4.8
      },
      {
        id: 6,
        name: 'Bluetooth Speaker',
        price: 49.99,
        originalPrice: 79.99,
        discount: 38,
        image: 'https://via.placeholder.com/300x300?text=Speaker+Deal',
        category: 'electronics',
        timeLeft: '2 days left',
        featured: false,
        rating: 4.4
      },
      {
        id: 7,
        name: 'Designer Handbag',
        price: 99.99,
        originalPrice: 199.99,
        discount: 50,
        image: 'https://via.placeholder.com/300x300?text=Handbag+Deal',
        category: 'fashion',
        timeLeft: '4 days left',
        featured: true,
        rating: 4.6
      },
      {
        id: 8,
        name: 'Skincare Bundle',
        price: 69.99,
        originalPrice: 119.99,
        discount: 42,
        image: 'https://via.placeholder.com/300x300?text=Skincare+Deal',
        category: 'beauty',
        timeLeft: '6 days left',
        featured: false,
        rating: 4.1
      }
    ];
    setDeals(mockDeals);
    setFilteredDeals(mockDeals);
  }, []);

  useEffect(() => {
    let filtered = deals.filter(deal =>
      deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort deals
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
        // Simple sorting based on timeLeft (for demo)
        filtered.sort((a, b) => a.timeLeft.localeCompare(b.timeLeft));
        break;
      default:
        break;
    }

    setFilteredDeals(filtered);
  }, [searchTerm, sortBy, deals]);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const featuredDeals = filteredDeals.filter(deal => deal.featured);
  const otherDeals = filteredDeals.filter(deal => !deal.featured);

  return (
    <Container>
      {/* Hero Section */}
      <Row className="my-5">
        <Col>
          <div className="text-center">
            <FaFire size={48} className="text-danger mb-3" />
            <h1 className="display-4 fw-bold text-danger">Hot Deals</h1>
            <p className="lead text-muted">
              Limited-time offers and exclusive discounts. Shop now before they're gone!
            </p>
          </div>
        </Col>
      </Row>

      {/* Search and Filter */}
      <Row className="mb-4">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select
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
            <h2 className="mb-4">
              <FaFire className="text-danger me-2" />
              Featured Deals
            </h2>
            <Row>
              {featuredDeals.map(deal => (
                <Col lg={6} className="mb-4" key={deal.id}>
                  <Card className="h-100 deal-card featured-deal border-danger">
                    <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
                      -{deal.discount}%
                    </Badge>
                    <Row className="g-0">
                      <Col md={5}>
                        <Card.Img
                          src={deal.image}
                          alt={deal.name}
                          className="h-100"
                          style={{ objectFit: 'cover', minHeight: '200px' }}
                        />
                      </Col>
                      <Col md={7}>
                        <Card.Body className="d-flex flex-column h-100">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <Card.Title className="h5">{deal.name}</Card.Title>
                            <Badge bg="warning" text="dark" className="fs-7">
                              <FaClock className="me-1" />
                              {deal.timeLeft}
                            </Badge>
                          </div>
                          
                          <div className="mb-3">
                            <span className="h4 text-danger fw-bold">${deal.price}</span>
                            <span className="text-muted text-decoration-line-through ms-2">
                              ${deal.originalPrice}
                            </span>
                          </div>

                          <Card.Text className="text-muted small flex-grow-1">
                            Save ${(deal.originalPrice - deal.price).toFixed(2)} on this amazing deal!
                          </Card.Text>

                          <div className="d-flex justify-content-between align-items-center">
                            <Badge bg="secondary" className="fs-7">
                              {deal.category}
                            </Badge>
                            <Button
                              variant="danger"
                              size="sm"
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
          <h2 className="mb-4">
            <FaTag className="text-primary me-2" />
            All Deals
          </h2>
          <Row>
            {otherDeals.length === 0 ? (
              <Col className="text-center my-5">
                <FaTag size={48} className="text-muted mb-3" />
                <h4>No deals found</h4>
                <p className="text-muted">Try adjusting your search criteria</p>
              </Col>
            ) : (
              otherDeals.map(deal => (
                <Col xl={3} lg={4} md={6} className="mb-4" key={deal.id}>
                  <Card className="h-100 deal-card shadow-sm">
                    <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
                      -{deal.discount}%
                    </Badge>
                    <Badge bg="warning" text="dark" className="position-absolute top-0 end-0 m-2 fs-7">
                      <FaClock className="me-1" />
                      {deal.timeLeft}
                    </Badge>
                    
                    <Card.Img
                      variant="top"
                      src={deal.image}
                      alt={deal.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="h6">{deal.name}</Card.Title>
                      
                      <div className="mb-2">
                        <span className="h5 text-danger fw-bold">${deal.price}</span>
                        <span className="text-muted text-decoration-line-through ms-2 small">
                          ${deal.originalPrice}
                        </span>
                      </div>

                      <Card.Text className="text-muted small flex-grow-1">
                        Save ${(deal.originalPrice - deal.price).toFixed(2)}
                      </Card.Text>

                      <div className="d-flex justify-content-between align-items-center">
                        <Badge bg="secondary" className="fs-7">
                          {deal.category}
                        </Badge>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleAddToCart(deal)}
                        >
                          <FaShoppingCart />
                        </Button>
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
          <div className="bg-primary text-white p-5 rounded-3">
            <h3 className="mb-3">Never Miss a Deal!</h3>
            <p className="mb-4">
              Subscribe to our newsletter and be the first to know about exclusive offers and flash sales
            </p>
            <div className="d-flex justify-content-center gap-2">
              <Form.Control
                type="email"
                placeholder="Enter your email"
                style={{ maxWidth: '300px' }}
              />
              <Button variant="light" className="text-primary">
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