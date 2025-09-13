import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaTruck, FaShieldAlt, FaUndo } from 'react-icons/fa';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">Welcome to StyleCart</h1>
              <p className="lead mb-4">
                Discover the latest trends and shop from thousands of products 
                with fast delivery and secure payments.
              </p>
              <Button as={Link} to="/products" variant="light" size="lg" className="me-3">
                Shop Now
              </Button>
              <Button as={Link} to="/deals" variant="outline-light" size="lg">
                View Deals
              </Button>
            </Col>
            <Col lg={6} className="text-center">
              <img
                src="https://via.placeholder.com/600x400?text=StyleCart+Hero"
                alt="Shopping"
                className="img-fluid rounded shadow"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2>Why Shop With Us?</h2>
              <p className="text-muted">We provide the best shopping experience</p>
            </Col>
          </Row>
          <Row>
            <Col md={3} className="text-center mb-4">
              <div className="mb-3">
                <FaTruck size={48} className="text-primary" />
              </div>
              <h5>Free Shipping</h5>
              <p className="text-muted">Free delivery on orders over $50</p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <div className="mb-3">
                <FaShieldAlt size={48} className="text-primary" />
              </div>
              <h5>Secure Payment</h5>
              <p className="text-muted">100% secure payment processing</p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <div className="mb-3">
                <FaUndo size={48} className="text-primary" />
              </div>
              <h5>Easy Returns</h5>
              <p className="text-muted">30-day money-back guarantee</p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <div className="mb-3">
                <FaShoppingBag size={48} className="text-primary" />
              </div>
              <h5>24/7 Support</h5>
              <p className="text-muted">Round-the-clock customer service</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Products Preview */}
      <section className="bg-light py-5">
        <Container>
          <Row className="mb-4">
            <Col>
              <h2>Featured Products</h2>
              <p className="text-muted">Check out our most popular items</p>
            </Col>
            <Col className="text-end">
              <Button as={Link} to="/products" variant="outline-primary">
                View All Products
              </Button>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100">
                <Card.Img 
                  variant="top" 
                  src="https://via.placeholder.com/300x200?text=Featured+1"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>Wireless Earbuds</Card.Title>
                  <Card.Text>
                    High-quality sound with noise cancellation
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="h5 text-primary mb-0">$129.99</span>
                    <Button variant="primary">Add to Cart</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100">
                <Card.Img 
                  variant="top" 
                  src="https://via.placeholder.com/300x200?text=Featured+2"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>Smart Watch</Card.Title>
                  <Card.Text>
                    Track your fitness and stay connected
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="h5 text-primary mb-0">$249.99</span>
                    <Button variant="primary">Add to Cart</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100">
                <Card.Img 
                  variant="top" 
                  src="https://via.placeholder.com/300x200?text=Featured+3"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>Backpack</Card.Title>
                  <Card.Text>
                    Durable and stylish backpack for everyday use
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="h5 text-primary mb-0">$79.99</span>
                    <Button variant="primary">Add to Cart</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home;