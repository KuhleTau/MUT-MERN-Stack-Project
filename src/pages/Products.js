import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Spinner } from 'react-bootstrap';
import { FaSearch, FaFilter } from 'react-icons/fa';
import ProductCard from '../components/products/ProductCard';
import api from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration - replace with actual API call
      const mockProducts = [
        {
          id: 1,
          name: 'Premium Headphones',
          price: 199.99,
          originalPrice: 249.99,
          description: 'High-quality wireless headphones with noise cancellation',
          image: 'https://via.placeholder.com/300x200?text=Headphones',
          rating: 4.5,
          onSale: true,
          category: 'electronics'
        },
        {
          id: 2,
          name: 'Smart Watch',
          price: 299.99,
          description: 'Feature-rich smartwatch with health monitoring',
          image: 'https://via.placeholder.com/300x200?text=Smart+Watch',
          rating: 4.3,
          category: 'electronics'
        },
        {
          id: 3,
          name: 'Running Shoes',
          price: 89.99,
          originalPrice: 119.99,
          description: 'Comfortable running shoes for athletes',
          image: 'https://via.placeholder.com/300x200?text=Running+Shoes',
          rating: 4.7,
          onSale: true,
          category: 'clothing'
        },
        {
          id: 4,
          name: 'Coffee Maker',
          price: 149.99,
          description: 'Automatic coffee maker with timer',
          image: 'https://via.placeholder.com/300x200?text=Coffee+Maker',
          rating: 4.2,
          category: 'home'
        },
        {
          id: 5,
          name: 'Yoga Mat',
          price: 39.99,
          originalPrice: 49.99,
          description: 'Eco-friendly yoga mat for practice',
          image: 'https://via.placeholder.com/300x200?text=Yoga+Mat',
          rating: 4.8,
          onSale: true,
          category: 'sports'
        },
        {
          id: 6,
          name: 'Bluetooth Speaker',
          price: 79.99,
          description: 'Portable speaker with great sound quality',
          image: 'https://via.placeholder.com/300x200?text=Speaker',
          rating: 4.4,
          category: 'electronics'
        }
      ];
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCategory === '' || product.category === filterCategory)
  );

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
      <Row className="my-4">
        <Col>
          <h1>Our Products</h1>
          <p className="text-muted">Discover amazing products at great prices</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <FaFilter />
            </InputGroup.Text>
            <Form.Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="home">Home & Kitchen</option>
              <option value="sports">Sports & Fitness</option>
            </Form.Select>
          </InputGroup>
        </Col>
      </Row>

      <Row>
        {filteredProducts.length === 0 ? (
          <Col className="text-center my-5">
            <h4>No products found</h4>
            <p>Try adjusting your search or filter criteria</p>
          </Col>
        ) : (
          filteredProducts.map(product => (
            <Col key={product.id} lg={4} md={6} className="mb-4">
              <ProductCard product={product} />
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default Products;