import React from 'react';
import { Container, Alert } from 'react-bootstrap';

const Dashboard = () => {
  return (
    <Container>
      <h1>Dashboard</h1>
      <Alert variant="info">
        This is your dashboard. You can add charts, statistics, or quick actions here.
      </Alert>
      <p>Welcome to your personal dashboard!</p>
    </Container>
  );
};

export default Dashboard;