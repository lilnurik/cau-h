import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress, Card, CardContent, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRestaurantDetails } from '../services/yelpApi';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await fetchRestaurantDetails(id);
        setRestaurant(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);


  const handleBackToRestaurants = () => {
    navigate('/restaurants');
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!restaurant) return <Typography>No restaurant details found</Typography>;

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" align="center" gutterBottom>{restaurant.name}</Typography>
        <img 
          src={restaurant.image_url} 
          alt={restaurant.name} 
          style={{ width: '40%', height: 'auto', display: 'block', margin: '0 auto' }} 
        />
        <Typography variant="h6">Address: {restaurant.location.display_address}</Typography>
        <Typography variant="h6">Phone Number: {restaurant.display_phone}</Typography>
        
        <Typography variant="h6">
        {restaurant.hours[0].is_open_now ? 'Is open' : 'Is closed'}
        </Typography>
        <Typography variant="h6">Price: {restaurant.price}</Typography>
        <Typography variant="h6">Rating: {restaurant.rating}</Typography>

        {/* <ul>
          {restaurant.reviews.map((review) => (
            <li key={review.id}>
              <Typography variant="body2">{review.text}</Typography>
              <Typography variant="caption">- {review.user.name}</Typography>
            </li>
          ))}
        </ul> */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleBackToRestaurants}
          style={{ marginTop: '20px' }}
        >
          Back to results
        </Button>
      </CardContent>
    </Card>
  );
};

export default RestaurantDetails;
