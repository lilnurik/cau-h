import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Grid } from '@mui/material';

const RestaurantCards = ({ restaurants, handleViewDetails, handleFavorite}) => {
  return (
    <Grid container spacing={4}>
      {restaurants.map((restaurant) => (
        <Grid item key={restaurant.id} xs={12} sm={6} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image={restaurant.image_url}
              alt={restaurant.name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {restaurant.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {restaurant.location.address1}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {restaurant.categories.map(category => category.title).join(', ')}
              </Typography>
              <Button size="small" color="primary" onClick={() => handleViewDetails(restaurant.id)}>
                View Details
              </Button>
              <Button size="small" color="secondary" onClick={() => handleFavorite(restaurant.id)}>
                Favorite
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default RestaurantCards;
