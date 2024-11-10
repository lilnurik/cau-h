import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Grid } from '@mui/material';

const RecipeCards = ({ recipes, handleViewDetails }) => {
  return (
    <Grid container spacing={3}>
      {recipes.map(recipe => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.id}>
          <Card style={{ maxWidth: 345, minHeight: 400, display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              height="220" 
              image={recipe.image}
              alt={recipe.title}
              style={{ objectFit: 'cover' }} 
            />
            <CardContent style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Typography variant="h6" component="div" align="center" style={{ marginBottom: 'auto' }}>
                {recipe.title}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                style={{ marginTop: '5px', marginBottom: '5px', alignSelf: 'center' }} 
                onClick={() => handleViewDetails(recipe.id)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default RecipeCards;
