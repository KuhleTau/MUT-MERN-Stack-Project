import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaTruck, FaShieldAlt, FaUndo, FaStar, FaHeart, FaFire } from 'react-icons/fa';
import { useCart } from '../components/cart/CartContext';
import { toast } from 'react-toastify';
import api from '../services/api';

const Home = () => {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetches featured products
      const featuredResponse = await api.get('/api/products?featured=true');
      setFeaturedProducts(featuredResponse.data.slice(0, 3));

      // Fetches deals (products on sale)
      const dealsResponse = await api.get('/api/deals');
      setDeals(dealsResponse.data.slice(0, 3));

    } catch (error) {
      console.error('Error fetching home data:', error);
      setError('Failed to load featured products. Please try again later.');
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

  if (loading) {
    return (
      <Container className="text-center my-5 py-5">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3 text-muted">Loading CSK...</p>
      </Container>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section bg-dark text-white py-5">
        <Container>
          <Row className="align-items-center py-5">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">Welcome to CSK</h1>
              <p className="lead mb-4">
                Discover the latest trends and shop from thousands of products 
                with fast delivery and secure payments.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Button as={Link} to="/products" variant="light" size="lg" className="rounded-pill px-4">
                  Shop Now
                </Button>
                <Button as={Link} to="/deals" variant="outline-light" size="lg" className="rounded-pill px-4">
                  View Deals
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <img
                src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Shopping at CSK"
                className="img-fluid rounded shadow"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {error && (
        <Container>
          <Alert variant="danger" className="rounded-3 mt-4">{error}</Alert>
        </Container>
      )}

      {/* Features Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="text-dark">Why Shop With CSK?</h2>
              <p className="text-muted">We provide the best shopping experience</p>
            </Col>
          </Row>
          <Row>
            <Col md={3} className="text-center mb-4">
              <div className="mb-3">
                <FaTruck size={48} className="text-primary" />
              </div>
              <h5 className="text-dark">Free Shipping</h5>
              <p className="text-muted">Free delivery on orders over R500</p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <div className="mb-3">
                <FaShieldAlt size={48} className="text-primary" />
              </div>
              <h5 className="text-dark">Secure Payment</h5>
              <p className="text-muted">100% secure payment processing</p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <div className="mb-3">
                <FaUndo size={48} className="text-primary" />
              </div>
              <h5 className="text-dark">Easy Returns</h5>
              <p className="text-muted">30-day money-back guarantee</p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <div className="mb-3">
                <FaShoppingBag size={48} className="text-primary" />
              </div>
              <h5 className="text-dark">24/7 Support</h5>
              <p className="text-muted">Round-the-clock customer service</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Products Preview */}
      <section className="py-5">
        <Container>
          <Row className="mb-4">
            <Col>
              <h2 className="text-dark">Featured Products</h2>
              <p className="text-muted">Check out our most popular items</p>
            </Col>
            <Col className="text-end">
              <Button as={Link} to="/products" variant="outline-dark" className="rounded-pill">
                View All Products
              </Button>
            </Col>
          </Row>
          {featuredProducts.length === 0 ? (
            <Row>
              <Col className="text-center py-4">
                <p className="text-muted">No featured products available at the moment.</p>
              </Col>
            </Row>
          ) : (
            <Row>
              {featuredProducts.map(product => (
                <Col md={4} className="mb-4" key={product._id}>
                  <Card className="h-100 shadow-sm border-0">
                    <div className="position-absolute top-0 end-0 m-2">
                      <Button variant="outline-light" size="sm" className="p-1 rounded-circle">
                        <FaHeart className="text-muted" />
                      </Button>
                    </div>
                    {product.onSale && (
                      <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
                        Sale
                      </Badge>
                    )}
                    <Card.Img 
                      variant="top" 
                      src={product.image || "https://via.placeholder.com/300x200?text=CSK+Product"}
                      alt={product.name}
                      style={{ height: '200px', objectFit: 'contain', padding: '1rem', backgroundColor: '#f8f9fa' }}
                    />
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Card.Title className="h6 text-dark" style={{ minHeight: '48px' }}>{product.name}</Card.Title>
                        <Badge bg="outline-dark" text="dark" className="border">{product.category}</Badge>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <div className="text-warning">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={i < Math.floor(product.rating || 0) ? "text-warning" : "text-muted"} 
                              size={14}
                            />
                          ))}
                        </div>
                        <small className="text-muted ms-2">({product.reviewCount || 0})</small>
                      </div>
                      <Card.Text className="text-muted small flex-grow-1">
                        {product.description || 'Premium quality product from CSK'}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <div>
                          <span className="h5 text-dark mb-0">R{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-muted text-decoration-line-through ms-2 small">
                              R{product.originalPrice}
                            </span>
                          )}
                        </div>
                        <Button 
                          variant="dark" 
                          size="sm" 
                          className="rounded-pill"
                          onClick={() => handleAddToCart(product)}
                        >
                          <FaShoppingBag className="me-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      {/* Hot Deals Section */}
      {deals.length > 0 && (
        <section className="py-5 bg-light">
          <Container>
            <Row className="mb-4">
              <Col>
                <h2 className="text-dark">
                  <FaFire className="text-danger me-2" />
                  Hot Deals
                </h2>
                <p className="text-muted">Limited time offers - don't miss out!</p>
              </Col>
              <Col className="text-end">
                <Button as={Link} to="/deals" variant="outline-danger" className="rounded-pill">
                  View All Deals
                </Button>
              </Col>
            </Row>
            <Row>
              {deals.map(deal => (
                <Col md={4} className="mb-4" key={deal._id}>
                  <Card className="h-100 shadow-sm border-0">
                    <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
                      -{deal.discount}% OFF
                    </Badge>
                    <div className="position-absolute top-0 end-0 m-2">
                      <Button variant="outline-light" size="sm" className="p-1 rounded-circle">
                        <FaHeart className="text-muted" />
                      </Button>
                    </div>
                    <Card.Img 
                      variant="top" 
                      src={deal.image || "https://via.placeholder.com/300x200?text=CSK+Deal"}
                      alt={deal.name}
                      style={{ height: '200px', objectFit: 'contain', padding: '1rem', backgroundColor: '#f8f9fa' }}
                    />
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Card.Title className="h6 text-dark" style={{ minHeight: '48px' }}>{deal.name}</Card.Title>
                        <Badge bg="warning" text="dark" className="fs-7">
                          <FaFire className="me-1" />
                          {deal.timeLeft || 'Limited Time'}
                        </Badge>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <div className="text-warning">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={i < Math.floor(deal.rating || 0) ? "text-warning" : "text-muted"} 
                              size={14}
                            />
                          ))}
                        </div>
                        <small className="text-muted ms-2">({deal.reviewCount || 0})</small>
                      </div>
                      <Card.Text className="text-muted small flex-grow-1">
                        {deal.description || 'Special deal from CSK - save big!'}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <div>
                          <span className="h5 text-danger fw-bold mb-0">R{deal.price}</span>
                          <span className="text-muted text-decoration-line-through ms-2 small">
                            R{deal.originalPrice}
                          </span>
                        </div>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          className="rounded-pill"
                          onClick={() => handleAddToCart(deal)}
                        >
                          <FaShoppingBag className="me-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-5 bg-dark text-white">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h3 className="mb-3">Never Miss a Deal</h3>
              <p className="mb-4">
                Subscribe to our newsletter and be the first to know about exclusive offers, new products, and special promotions.
              </p>
              <div className="d-flex justify-content-center gap-2 flex-wrap">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="form-control rounded-pill"
                  style={{ maxWidth: '300px' }}
                />
                <Button variant="light" className="text-dark rounded-pill px-4">
                  Subscribe
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home;