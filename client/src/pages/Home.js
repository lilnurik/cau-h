import React from 'react';
import { Container, Typography } from '@mui/material';
import { useUserState } from '../UserContext';
import { RestaurantCarousel } from '../components/RestaurantCarousel';
import { ViewedRestaurantCarousel } from '../components/ViewedRestaurantCarousel';
import '../index.css';

const Home = () => {
  const { user } = useUserState();

  const capFirstLetter = (string) =>
    string && string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

  return (
    <Container sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user && user.username ? capFirstLetter(user.username) : 'Guest'}
      </Typography>

      <Typography variant="h5" component="h2" gutterBottom>
        Glance at your favorite restaurants
      </Typography>
      <RestaurantCarousel />

      <Typography variant="h5" component="h2" gutterBottom>
        See what others are looking at
      </Typography>
      <ViewedRestaurantCarousel />
    </Container>
  );
};

export default Home;
