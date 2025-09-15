import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Nav, Badge } from 'react-bootstrap';
import { FaUser, FaLock, FaMapMarkerAlt, FaBell, FaShieldAlt, FaSave } from 'react-icons/fa';
import api from '../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('profile');

  // Form states
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  const [addressData, setAddressData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'South Africa'
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/profile');
      setUser(response.data);
      setProfileData({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || ''
      });
      
      // Set default address if available
      if (response.data.address) {
        setAddressData(response.data.address);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'danger', text: 'Failed to load profile data' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await api.put('/auth/profile', profileData);
      setUser(response.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'danger', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await api.put('/auth/profile', { address: addressData });
      setUser(response.data);
      setMessage({ type: 'success', text: 'Address updated successfully!' });
    } catch (error) {
      console.error('Error updating address:', error);
      setMessage({ type: 'danger', text: 'Failed to update address' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'danger', text: 'New passwords do not match' });
      return;
    }
    
    setSaving(true);
    
    try {
      await api.put('/auth/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage({ type: 'danger', text: error.response?.data?.message || 'Failed to update password' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5 py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading your profile...</p>
      </Container>
    );
  }

  return (
    <Container fluid="lg">
      {/* Header */}
      <Row className="my-4">
        <Col>
          <div className="bg-dark text-white p-4 rounded-3">
            <h1 className="h3 mb-1">Account Settings</h1>
            <p className="mb-0 text-light">Manage your CSK account preferences and settings</p>
          </div>
        </Col>
      </Row>

      {message.text && (
        <Alert variant={message.type} className="rounded-3" onClose={() => setMessage({ type: '', text: '' })} dismissible>
          {message.text}
        </Alert>
      )}

      <Row>
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center p-4">
              <div className="bg-primary bg-opacity-10 p-4 rounded-circle d-inline-flex mb-3">
                <span className="text-primary fw-bold display-6">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <h4 className="mb-1">{user?.name}</h4>
              <p className="text-muted mb-3">{user?.email}</p>
              
              <div className="d-grid gap-2 mb-4">
                <Badge bg="success" className="fs-6 py-2">Verified Account</Badge>
                <Badge bg="light" text="dark" className="fs-6 py-2">
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </Badge>
              </div>
              
              <div className="text-start">
                <h6 className="text-uppercase text-muted mb-3">Account Details</h6>
                <div className="d-flex justify-content-between border-bottom py-2">
                  <span className="text-muted">Full Name</span>
                  <span className="fw-bold">{user?.name}</span>
                </div>
                <div className="d-flex justify-content-between border-bottom py-2">
                  <span className="text-muted">Email</span>
                  <span className="fw-bold">{user?.email}</span>
                </div>
                <div className="d-flex justify-content-between border-bottom py-2">
                  <span className="text-muted">Phone</span>
                  <span className="fw-bold">{user?.phone || 'Not provided'}</span>
                </div>
                <div className="d-flex justify-content-between py-2">
                  <span className="text-muted">Status</span>
                  <Badge bg="success">Active</Badge>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 p-0">
              <Nav variant="tabs" className="px-3 pt-3">
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'profile'} 
                    onClick={() => setActiveTab('profile')}
                    className="d-flex align-items-center"
                  >
                    <FaUser className="me-2" /> Profile
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'address'} 
                    onClick={() => setActiveTab('address')}
                    className="d-flex align-items-center"
                  >
                    <FaMapMarkerAlt className="me-2" /> Address
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'password'} 
                    onClick={() => setActiveTab('password')}
                    className="d-flex align-items-center"
                  >
                    <FaLock className="me-2" /> Password
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'notifications'} 
                    onClick={() => setActiveTab('notifications')}
                    className="d-flex align-items-center"
                  >
                    <FaBell className="me-2" /> Notifications
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            
            <Card.Body className="p-4">
              <Tab.Content>
                {activeTab === 'profile' && (
                  <Tab.Pane active>
                    <h5 className="mb-4">Personal Information</h5>
                    <Form onSubmit={handleProfileSubmit}>
                      <Row>
                        <Col md={6} className="mb-3">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            required
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            required
                          />
                        </Col>
                        <Col md={6} className="mb-4">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            placeholder="+27 123 456 7890"
                          />
                        </Col>
                      </Row>
                      <Button type="submit" variant="dark" disabled={saving} className="rounded-pill px-4">
                        {saving ? 'Saving...' : 'Save Changes'} <FaSave className="ms-2" />
                      </Button>
                    </Form>
                  </Tab.Pane>
                )}
                
                {activeTab === 'address' && (
                  <Tab.Pane active>
                    <h5 className="mb-4">Shipping Address</h5>
                    <Form onSubmit={handleAddressSubmit}>
                      <Row>
                        <Col md={12} className="mb-3">
                          <Form.Label>Street Address</Form.Label>
                          <Form.Control
                            type="text"
                            value={addressData.street}
                            onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                            required
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            value={addressData.city}
                            onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                            required
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>State/Province</Form.Label>
                          <Form.Control
                            type="text"
                            value={addressData.state}
                            onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                            required
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>ZIP/Postal Code</Form.Label>
                          <Form.Control
                            type="text"
                            value={addressData.zipCode}
                            onChange={(e) => setAddressData({ ...addressData, zipCode: e.target.value })}
                            required
                          />
                        </Col>
                        <Col md={6} className="mb-4">
                          <Form.Label>Country</Form.Label>
                          <Form.Control
                            as="select"
                            value={addressData.country}
                            onChange={(e) => setAddressData({ ...addressData, country: e.target.value })}
                            required
                          >
                            <option value="South Africa">South Africa</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Col>
                      </Row>
                      <Button type="submit" variant="dark" disabled={saving} className="rounded-pill px-4">
                        {saving ? 'Saving...' : 'Save Address'} <FaSave className="ms-2" />
                      </Button>
                    </Form>
                  </Tab.Pane>
                )}
                
                {activeTab === 'password' && (
                  <Tab.Pane active>
                    <h5 className="mb-4">Change Password</h5>
                    <Form onSubmit={handlePasswordSubmit}>
                      <Row>
                        <Col md={6} className="mb-3">
                          <Form.Label>Current Password</Form.Label>
                          <Form.Control
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            required
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6} className="mb-3">
                          <Form.Label>New Password</Form.Label>
                          <Form.Control
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            required
                          />
                        </Col>
                        <Col md={6} className="mb-4">
                          <Form.Label>Confirm New Password</Form.Label>
                          <Form.Control
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            required
                          />
                        </Col>
                      </Row>
                      <Button type="submit" variant="dark" disabled={saving} className="rounded-pill px-4">
                        {saving ? 'Updating...' : 'Update Password'} <FaShieldAlt className="ms-2" />
                      </Button>
                    </Form>
                  </Tab.Pane>
                )}
                
                {activeTab === 'notifications' && (
                  <Tab.Pane active>
                    <h5 className="mb-4">Notification Preferences</h5>
                    <div className="border rounded-3 p-3 mb-4">
                      <div className="form-check form-switch mb-3">
                        <Form.Check
                          type="switch"
                          id="email-notifications"
                          label="Email Notifications"
                          defaultChecked
                        />
                        <small className="text-muted">Receive order updates and promotional emails</small>
                      </div>
                      <div className="form-check form-switch mb-3">
                        <Form.Check
                          type="switch"
                          id="sms-notifications"
                          label="SMS Notifications"
                          defaultChecked
                        />
                        <small className="text-muted">Receive order updates via SMS</small>
                      </div>
                      <div className="form-check form-switch">
                        <Form.Check
                          type="switch"
                          id="newsletter"
                          label="Newsletter Subscription"
                          defaultChecked
                        />
                        <small className="text-muted">Receive our weekly newsletter with deals and updates</small>
                      </div>
                    </div>
                    <Button variant="dark" className="rounded-pill px-4">
                      Save Preferences <FaSave className="ms-2" />
                    </Button>
                  </Tab.Pane>
                )}
              </Tab.Content>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;