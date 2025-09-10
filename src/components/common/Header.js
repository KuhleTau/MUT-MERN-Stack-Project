import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CartSidebar from '../cart/CartSidebar';
import { FaStore } from 'react-icons/fa';

const Header = () => {
  const { currentUser, logout } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <FaStore className="me-2" />
          StyleCart
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/products">Products</Nav.Link>
            <Nav.Link as={Link} to="/categories">Categories</Nav.Link>
            <Nav.Link as={Link} to="/deals">Deals</Nav.Link>
          </Nav>
          
          <Nav className="align-items-center">
            <div className="me-3">
              <CartSidebar />
            </div>
            
            {currentUser ? (
              <>
                <Nav.Link as={Link} to="/profile">
                  Welcome, {currentUser.name}
                </Nav.Link>
                <Button variant="outline-light" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;