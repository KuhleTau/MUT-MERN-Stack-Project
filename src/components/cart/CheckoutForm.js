import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useCart } from './CartContext';
import api from '../../services/api';

const CheckoutForm = ({ show, handleClose }) => {
  const { items, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'credit_card'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to checkout');
        return;
      }

      const orderData = {
        items: items,
        shippingAddress: formData,
        paymentMethod: formData.paymentMethod
      };

      const response = await api.post('/api/checkout', orderData);
      
      setSuccess('Order placed successfully!');
      clearCart();
      
      // Close modal after 2 seconds
      setTimeout(() => {
        handleClose();
        setSuccess('');
      }, 2000);

    } catch (error) {
      console.error('Checkout error:', error);
      setError(error.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Checkout</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <h5>Order Summary</h5>
        {items.map(item => (
          <div key={item._id} className="d-flex justify-content-between mb-2">
            <span>{item.name} (x{item.quantity})</span>
            <span>R{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        
        <hr />
        <div className="d-flex justify-content-between fw-bold">
          <span>Total:</span>
          <span>R{getCartTotal().toFixed(2)}</span>
        </div>

        <h5 className="mt-4">Shipping Information</h5>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>First Name *</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Last Name *</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Email *</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Address *</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>City *</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Postal Code *</Form.Label>
              <Form.Control
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Country *</Form.Label>
          <Form.Control
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Payment Method *</Form.Label>
          <Form.Select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleInputChange}
          >
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="bank_transfer">Bank Transfer</option>
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleCheckout}
          disabled={loading || items.length === 0}
        >
          {loading ? 'Processing...' : `Pay R${getCartTotal().toFixed(2)}`}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckoutForm;