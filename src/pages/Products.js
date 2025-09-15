import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Spinner, Alert, Card, Badge } from 'react-bootstrap';
import { FaSearch, FaFilter, FaShoppingCart, FaHeart, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCart } from '../components/cart/CartContext';
import { toast } from 'react-toastify';
import api from '../services/api';

const Products = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
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

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCategory === '' || product.category === filterCategory)
  );

  // Sorts products
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

  // Gets current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Changes page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculates total pages
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

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
      <Row className="my-4">
        <Col>
          <div className="bg-dark text-white p-5 rounded-3 text-center">
            <h1 className="display-5 fw-bold mb-3">CSK Products</h1>
            <p className="lead mb-0">Discover amazing products at great prices</p>
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

      {/* Search and Filter Bar */}
      <Row className="mb-4">
        <Col lg={5} md={6} className="mb-3 mb-md-0">
          <InputGroup size="lg">
            <InputGroup.Text className="bg-white border-end-0">
              <FaSearch className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-start-0"
            />
          </InputGroup>
        </Col>
        <Col lg={3} md={3} className="mb-3 mb-md-0">
          <InputGroup size="lg">
            <InputGroup.Text className="bg-white">
              <FaFilter className="text-muted" />
            </InputGroup.Text>
            <Form.Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home & Kitchen</option>
              <option value="sports">Sports & Fitness</option>
              <option value="beauty">Beauty & Health</option>
              <option value="books">Books & Stationery</option>
              <option value="toys">Toys & Games</option>
              <option value="jewelry">Jewelry & Accessories</option>
            </Form.Select>
          </InputGroup>
        </Col>
        <Col lg={4} md={3}>
          <Form.Select
            size="lg"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Results Count */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="text-muted mb-0">
              {sortedProducts.length} products found
              {filterCategory && ` in ${filterCategory}`}
              {searchTerm && ` for "${searchTerm}"`}
            </h5>
            <div className="d-flex align-items-center">
              <span className="text-muted me-2">View:</span>
              <Button variant="outline-secondary" size="sm" className="me-2 active">Grid</Button>
              <Button variant="outline-secondary" size="sm">List</Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Products Grid */}
      <Row>
        {currentProducts.length === 0 ? (
          <Col className="text-center my-5 py-5">
            <FaSearch size={48} className="text-muted mb-3" />
            <h4 className="text-dark">No products found</h4>
            <p className="text-muted">Try adjusting your search or filter criteria</p>
            <Button 
              variant="dark" 
              onClick={() => { setSearchTerm(''); setFilterCategory(''); }}
              className="rounded-pill px-4"
            >
              Clear Filters
            </Button>
          </Col>
        ) : (
          currentProducts.map(product => (
            <Col key={product._id} xl={3} lg={4} md={6} className="mb-4">
              <Card className="h-100 product-card shadow-sm border-0">
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
                  src={product.image}
                  alt={product.name}
                  style={{ height: '220px', objectFit: 'contain', padding: '1rem', backgroundColor: '#f8f9fa' }}
                />
                <Card.Body className="d-flex flex-column p-3">
                  <Card.Title className="h6 text-dark mb-2" style={{ minHeight: '48px' }}>{product.name}</Card.Title>
                  
                  <div className="d-flex align-items-center mb-2">
                    <div className="text-warning">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          size={14} 
                          className={i < Math.floor(product.rating || 0) ? "text-warning" : "text-muted"} 
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
                      {product.discount > 0 && (
                        <Badge bg="outline-danger" text="danger" className="ms-2 border">
                          Save {product.discount}%
                        </Badge>
                      )}
                    </div>

                    <Button
                      variant="dark"
                      className="w-100 rounded-pill"
                      onClick={() => handleAddToCart(product)}
                    >
                      <FaShoppingCart className="me-2" />
                      Add to Cart
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Pagination */}
      {sortedProducts.length > productsPerPage && (
        <Row className="my-5">
          <Col className="d-flex justify-content-center">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <Button 
                    variant="outline-dark" 
                    className="page-link"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                </li>
                
                {[...Array(totalPages)].map((_, index) => (
                  <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <Button
                      variant={currentPage === index + 1 ? "dark" : "outline-dark"}
                      className="page-link"
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <Button 
                    variant="outline-dark" 
                    className="page-link"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </li>
              </ul>
            </nav>
          </Col>
        </Row>
      )}

      {/* Newsletter Section */}
      <Row className="my-5">
        <Col className="text-center">
          <div className="bg-dark text-white p-5 rounded-3">
            <h3 className="mb-3">Never Miss a Deal</h3>
            <p className="mb-4">
              Subscribe to our newsletter and be the first to know about exclusive offers and flash sales
            </p>
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              <Form.Control
                type="email"
                placeholder="Enter your email"
                style={{ maxWidth: '300px' }}
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

export default Products;