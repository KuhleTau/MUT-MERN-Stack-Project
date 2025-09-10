import React, { useState } from 'react';
import { Offcanvas, Button, ListGroup, Badge, Form, Row, Col } from 'react-bootstrap';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from './CartContext';

const CartSidebar = () => {
  const [show, setShow] = useState(false);
  const { items, removeFromCart, updateQuantity, getCartTotal, getCartItemsCount } = useCart();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <>
      <Button variant="outline-primary" onClick={handleShow} className="position-relative">
        <FaShoppingCart />
        {getCartItemsCount() > 0 && (
          <Badge 
            bg="danger" 
            className="position-absolute top-0 start-100 translate-middle"
            style={{ fontSize: '0.6rem' }}
          >
            {getCartItemsCount()}
          </Badge>
        )}
      </Button>

      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <FaShoppingCart className="me-2" />
            Shopping Cart ({getCartItemsCount()})
          </Offcanvas.Title>
        </Offcanvas.Header>
        
        <Offcanvas.Body>
          {items.length === 0 ? (
            <div className="text-center text-muted py-5">
              <FaShoppingCart size={48} className="mb-3" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <>
              <ListGroup variant="flush">
                {items.map((item) => (
                  <ListGroup.Item key={item.id} className="px-0">
                    <Row className="align-items-center">
                      <Col xs={3}>
                        <img
                          src={item.image || '/api/placeholder/80/80'}
                          alt={item.name}
                          className="img-fluid rounded"
                          style={{ height: '60px', objectFit: 'cover' }}
                        />
                      </Col>
                      
                      <Col xs={6}>
                        <h6 className="mb-1">{item.name}</h6>
                        <p className="text-muted mb-0">${item.price}</p>
                      </Col>
                      
                      <Col xs={3} className="text-end">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <FaTrash />
                        </Button>
                      </Col>
                    </Row>
                    
                    <Row className="mt-2">
                      <Col>
                        <div className="d-flex align-items-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <FaMinus />
                          </Button>
                          
                          <Form.Control
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                            className="mx-2 text-center"
                            style={{ width: '60px' }}
                          />
                          
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <FaPlus />
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              
              <div className="border-top pt-3 mt-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>Total: ${getCartTotal().toFixed(2)}</h5>
                </div>
                
                <Button variant="primary" className="w-100 mb-2">
                  Checkout
                </Button>
                
                <Button variant="outline-secondary" className="w-100">
                  Continue Shopping
                </Button>
              </div>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default CartSidebar;