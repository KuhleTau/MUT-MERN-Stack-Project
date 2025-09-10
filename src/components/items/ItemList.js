import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import ItemCard from './ItemCard';
import api from '../../services/api';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/items');
      setItems(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/items/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      setError('Failed to delete item');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row className="mb-4">
        <Col>
          <h2>Items List</h2>
        </Col>
        <Col className="text-end">
          <Button href="/items/new" variant="primary">
            Add New Item
          </Button>
        </Col>
      </Row>
      
      <Row>
        {items.length === 0 ? (
          <Col>
            <Alert variant="info">No items found. Add your first item!</Alert>
          </Col>
        ) : (
          items.map(item => (
            <Col key={item._id} md={6} lg={4} className="mb-4">
              <ItemCard 
                item={item} 
                onDelete={handleDelete}
                canEdit={currentUser && currentUser._id === item.userId}
              />
            </Col>
          ))
        )}
      </Row>
    </>
  );
};

export default ItemList;