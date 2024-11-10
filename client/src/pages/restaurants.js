import React, {useEffect} from 'react';
import { Typography, CircularProgress, Button } from '@mui/material';
import { useRestaurantContext } from '../RestaurantContext';
import RestaurantSearchForm from '../components/RestaurantSearchForm';
import RestaurantCards from '../components/RestaurantCards';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useUserState, useUserDispatch } from '../UserContext'; // Import custom hooks
import { fetchRestaurantDetails } from '../services/yelpApi'
import { handleViewDetails } from '../restaurantUtility';

const Restaurants = () => {
  const theme = useTheme();
  const { restaurants, status, error, showForm, setShowForm, resetState } = useRestaurantContext();
  const navigate = useNavigate();
  const { user, status: userStatus } = useUserState(); // Get user data
  const { checkSession } = useUserDispatch(); // Get dispatch functions

  useEffect(() => {
    // Check user session on component mount
    const verifySession = async () => {
      await checkSession();
    };
    verifySession();
  }, [checkSession]);
  
  const viewDetails = async (id) => {
    await handleViewDetails(id, checkSession, user, navigate);
  };


  const handleBackToRestaurants = () => {
    resetState();
    navigate('/restaurants');
  };

  const handleSearch = () => {
    setShowForm(false);
  };

  const handleFavorite = async (id) => {

        // Check if user is authenticated
    const isAuthenticated = await checkSession();
    if (!isAuthenticated || !user || !user.id) {
      console.error('User not authenticated or user data is missing');
      return;
    }
  
    try {
      const restaurant = await fetchRestaurantDetails(id)
  
      if (!restaurant) {
        console.error('Restaurant not found');
        return;
      }

      const saveResponse = await fetch('http://127.0.0.1:5000/favorite_restaurant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...restaurant, user_id: user.id }),  // Include user ID to track who saved it
      });

      if (saveResponse.ok) {
        console.log('Restaurant favorited successfully!');
      } else {
        console.error('Failed to favorite restaurant:', await saveResponse.text());
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  

  return (
    <div>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ color: theme.palette.text.primary }} // Use theme color
      >
        Restaurants
      </Typography>
      {showForm && <RestaurantSearchForm handleSearch={handleSearch} />}
      {!showForm && (
        <>
          {status === 'loading' && <CircularProgress />}
          {status === 'failed' && (
            <Typography color="error">
              {typeof error === 'string' ? error : 'An unexpected error occurred.'}
            </Typography>
          )}
          {status === 'succeeded' && restaurants.length > 0 && (
            <RestaurantCards restaurants={restaurants} handleViewDetails={viewDetails} handleFavorite={handleFavorite} />
          )}
          {status === 'succeeded' && restaurants.length === 0 && (
            <Typography variant="body1">No restaurants found.</Typography>
          )}
        </>
      )}
      {!showForm && restaurants.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleBackToRestaurants}
          style={{ marginTop: '20px' }}
        >
          New search
        </Button>
      )}
    </div>
  );
};

export default Restaurants;
