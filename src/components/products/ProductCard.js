import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaStar, FaEye } from 'react-icons/fa';
import { useCart } from '../cart/CartContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Card className="h-100 product-card shadow-sm">
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={product.image || '/api/placeholder/300/200'} 
          style={{ height: '200px', objectFit: 'cover' }}
        />
        {product.onSale && (
          <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
            Sale
          </Badge>
        )}
        {product.rating && (
          <Badge bg="warning" text="dark" className="position-absolute top-0 end-0 m-2">
            <FaStar className="me-1" />{product.rating}
          </Badge>
        )}
      </div>
      
      <Card.Body className="d-flex flex-column">
        <Card.Title className="h6">{product.name}</Card.Title>
        <Card.Text className="text-muted small flex-grow-1">
          {product.description?.substring(0, 60)}...
        </Card.Text>
        
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div>
            {product.originalPrice ? (
              <>
                <span className="text-danger fw-bold">R{product.price}</span>
                <span className="text-muted text-decoration-line-through ms-2 small">
                  R{product.originalPrice}
                </span>
              </>
            ) : (
              <span className="fw-bold">R{product.price}</span>
            )}
          </div>
          
          <div className="d-flex gap-1">
            <Button variant="outline-primary" size="sm">
              <FaEye />
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              onClick={handleAddToCart}
            >
              <FaShoppingCart />
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;