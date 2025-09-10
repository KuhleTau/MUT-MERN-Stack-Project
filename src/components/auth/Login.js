import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const Login = () => {
  return (
    <Container>
      <Row className="justify-content-center my-5">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Login</h2>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Enter your email" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Enter your password" />
                </Form.Group>
                <Button variant="primary" className="w-100">Login</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;