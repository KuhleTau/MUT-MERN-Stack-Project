import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Table, Modal, Badge, Form } from 'react-bootstrap';
import { FaEye, FaEdit } from 'react-icons/fa';
import api from '../../services/api';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/orders');
      console.log('Orders API response:', response.data);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setStatus(order.status || 'pending'); // Your DB uses "status" not "shippingStatus"
    setShowModal(true);
  };

  const handleStatusChange = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.put(`/api/orders/${selectedOrder._id}`, {
        status: status // Your DB uses "status" not "shippingStatus"
      });
      setSuccess('Order status updated successfully!');
      setShowModal(false);
      fetchOrders();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update order status');
    }
    setLoading(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setStatus('');
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return `R${amount?.toFixed(2)}`;
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h3>Order Management</h3>
          <p>Total Orders: {orders.length}</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row>
        <Col>
          <Card>
            <Card.Body>
              {orders.length === 0 ? (
                <p className="text-center">No orders found.</p>
              ) : (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer ID</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>#{order._id?.slice(-6).toUpperCase()}</td>
                        <td>
                          {order.userId ? order.userId.slice(-6).toUpperCase() : 'Guest'}
                        </td>
                        <td>{order.createdAt ? formatDate(order.createdAt) : 'No date'}</td>
                        <td>{order.totalAmount ? formatCurrency(order.totalAmount) : 'R0.00'}</td>
                        <td>
                          <Badge bg={getStatusVariant(order.status)}>
                            {order.status || 'unknown'}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            <FaEye />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Order Detail Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details #{selectedOrder?._id?.slice(-6).toUpperCase()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <h6>Order Information</h6>
                  <p>
                    <strong>Order ID:</strong> #{selectedOrder._id?.slice(-6).toUpperCase()}<br />
                    <strong>User ID:</strong> {selectedOrder.userId}<br />
                    <strong>Created:</strong> {formatDate(selectedOrder.createdAt)}<br />
                    <strong>Updated:</strong> {selectedOrder.updatedAt ? formatDate(selectedOrder.updatedAt) : 'N/A'}
                  </p>
                </Col>
                <Col md={6}>
                  <h6>Payment Information</h6>
                  <p>
                    <strong>Method:</strong> {selectedOrder.paymentMethod || 'credit_card'}<br />
                    <strong>Total Amount:</strong> {formatCurrency(selectedOrder.totalAmount)}
                  </p>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col>
                  <h6>Order Items</h6>
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    <Table striped>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item, index) => (
                          <tr key={index}>
                            <td>{item.name || `Item ${index + 1}`}</td>
                            <td>{item.quantity || 1}</td>
                            <td>{item.price ? formatCurrency(item.price) : 'R0.00'}</td>
                            <td>{formatCurrency((item.price || 0) * (item.quantity || 1))}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={3} className="text-end"><strong>Total:</strong></td>
                          <td><strong>{formatCurrency(selectedOrder.totalAmount)}</strong></td>
                        </tr>
                      </tfoot>
                    </Table>
                  ) : (
                    <p>No items in this order</p>
                  )}
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <h6>Order Status</h6>
                  <Form.Group>
                    <Form.Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={handleStatusChange} 
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Status'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrderManagement;