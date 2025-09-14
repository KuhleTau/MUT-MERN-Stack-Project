import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Tab, Nav } from 'react-bootstrap';
import ProductManagement from './ProductManagement';

const AdminDashboard = () => {
  return (
    <Container className="my-5">
      <Row>
        <Col>
          <h1 className="mb-4">Admin Dashboard</h1>
          <Tab.Container defaultActiveKey="products">
            <Row>
              <Col sm={3}>
                <Card>
                  <Card.Body>
                    <Nav variant="pills" className="flex-column">
                      <Nav.Item>
                        <Nav.Link eventKey="products">Product Management</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="orders">Order Management</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="users">User Management</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="products">
                    <ProductManagement />
                  </Tab.Pane>
                  <Tab.Pane eventKey="orders">
                    <h3>Order Management</h3>
                    <p>Order management features coming soon...</p>
                  </Tab.Pane>
                  <Tab.Pane eventKey="users">
                    <h3>User Management</h3>
                    <p>User management features coming soon...</p>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;