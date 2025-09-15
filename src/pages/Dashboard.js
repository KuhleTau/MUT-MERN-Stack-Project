import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaEye, FaStar, FaChartLine, FaBoxOpen, FaShippingFast, FaCheckCircle } from 'react-icons/fa';
import api from '../services/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetches user profile
      const userResponse = await api.get('/auth/profile');
      setUser(userResponse.data);
      
      // Fetches orders
      const ordersResponse = await api.get('/api/orders');
      setOrders(ordersResponse.data.slice(0, 5)); // Get latest 5 orders
      
      // Calculates stats
      const totalOrders = ordersResponse.data.length;
      const pendingOrders = ordersResponse.data.filter(order => order.status === 'pending').length;
      const completedOrders = ordersResponse.data.filter(order => order.status === 'delivered').length;
      const totalSpent = ordersResponse.data
        .filter(order => order.status === 'delivered')
        .reduce((total, order) => total + order.totalAmount, 0);
      
      setStats({
        totalOrders,
        pendingOrders,
        completedOrders,
        totalSpent
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5 py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading your dashboard...</p>
      </Container>
    );
  }

  return (
    <Container fluid="lg">
      {/* Welcome Section */}
      <Row className="my-4">
        <Col>
          <div className="bg-dark text-white p-4 rounded-3">
            <h1 className="h3 mb-1">Welcome back, {user?.name}!</h1>
            <p className="mb-0 text-light">Here's what's happening with your CSK account today.</p>
          </div>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3">
                <FaShoppingBag className="text-primary fs-4" />
              </div>
              <h3 className="fw-bold">{stats.totalOrders}</h3>
              <p className="text-muted mb-0">Total Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3">
                <FaBoxOpen className="text-warning fs-4" />
              </div>
              <h3 className="fw-bold">{stats.pendingOrders}</h3>
              <p className="text-muted mb-0">Pending Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3">
                <FaCheckCircle className="text-success fs-4" />
              </div>
              <h3 className="fw-bold">{stats.completedOrders}</h3>
              <p className="text-muted mb-0">Completed Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="bg-info bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3">
                <FaChartLine className="text-info fs-4" />
              </div>
              <h3 className="fw-bold">R{stats.totalSpent.toFixed(2)}</h3>
              <p className="text-muted mb-0">Total Spent</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Orders</h5>
                <Button as={Link} to="/orders" variant="outline-dark" size="sm">
                  View All
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {orders.length === 0 ? (
                <div className="text-center py-5">
                  <FaBoxOpen size={48} className="text-muted mb-3" />
                  <h5 className="text-dark">No orders yet</h5>
                  <p className="text-muted">Start shopping to see your orders here</p>
                  <Button as={Link} to="/products" variant="dark" className="rounded-pill px-4">
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order._id}>
                          <td className="fw-bold">#{order._id.slice(-8).toUpperCase()}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>{order.items.length} items</td>
                          <td className="fw-bold">R{order.totalAmount.toFixed(2)}</td>
                          <td>
                            <Badge bg={getStatusVariant(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </td>
                          <td>
                            <Button variant="outline-dark" size="sm">
                              <FaEye className="me-1" /> View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row>
        <Col lg={6} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col sm={6}>
                  <Button as={Link} to="/products" variant="outline-dark" className="w-100 text-start p-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
                        <FaShoppingBag className="text-primary" />
                      </div>
                      <div>
                        <h6 className="mb-0">Continue Shopping</h6>
                        <small className="text-muted">Browse our products</small>
                      </div>
                    </div>
                  </Button>
                </Col>
                <Col sm={6}>
                  <Button as={Link} to="/wishlist" variant="outline-dark" className="w-100 text-start p-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-danger bg-opacity-10 p-2 rounded me-3">
                        <FaStar className="text-danger" />
                      </div>
                      <div>
                        <h6 className="mb-0">Your Wishlist</h6>
                        <small className="text-muted">View saved items</small>
                      </div>
                    </div>
                  </Button>
                </Col>
                <Col sm={6}>
                  <Button as={Link} to="/profile" variant="outline-dark" className="w-100 text-start p-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-info bg-opacity-10 p-2 rounded me-3">
                        <FaEye className="text-info" />
                      </div>
                      <div>
                        <h6 className="mb-0">Account Settings</h6>
                        <small className="text-muted">Update your profile</small>
                      </div>
                    </div>
                  </Button>
                </Col>
                <Col sm={6}>
                  <Button as={Link} to="/orders" variant="outline-dark" className="w-100 text-start p-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-success bg-opacity-10 p-2 rounded me-3">
                        <FaShippingFast className="text-success" />
                      </div>
                      <div>
                        <h6 className="mb-0">Track Orders</h6>
                        <small className="text-muted">Check order status</small>
                      </div>
                    </div>
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">Account Overview</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-center mb-4">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                  <span className="text-primary fw-bold fs-4">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h6 className="mb-0">{user?.name}</h6>
                  <small className="text-muted">{user?.email}</small>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-muted">Profile Completeness</span>
                  <span className="fw-bold">70%</span>
                </div>
                <ProgressBar now={70} variant="primary" className="mb-3" />
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Member since</span>
                  <span className="fw-bold">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Account Status</span>
                  <Badge bg="success">Active</Badge>
                </div>
              </div>
              
              <Button as={Link} to="/profile" variant="dark" className="w-100 mt-3 rounded-pill">
                Manage Account
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;