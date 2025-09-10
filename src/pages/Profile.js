import React from 'react';
import { Container, Alert } from 'react-bootstrap';

const Profile = () => {
  return (
    <Container>
      <h1>Profile</h1>
      <Alert variant="info">
        This is your profile page. You can manage your account settings here.
      </Alert>
    </Container>
  );
};

export default Profile;