import React from 'react';
import { Typography, CircularProgress, Button } from '@mui/material';
import { useRecipeContext } from '../RecipeContext';
import RecipeSearchForm from '../components/RecipeSearchForm';
import RecipeCards from '../components/RecipeCards';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const Recipes = () => {
  const theme = useTheme();
  const { recipes, loading, error, showForm, setShowForm, resetState } = useRecipeContext();
  const navigate = useNavigate();

  const handleViewDetails = (id) => {
    navigate(`/recipe/${id}`);
  };

  const handleBackToRecipes = () => {
    resetState();
    navigate('/recipes');
  };

  const handleSearch = () => {
    setShowForm(false);
  };

  return (
    <div>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ color: theme.palette.text.primary }} 
      >
        Recipes
      </Typography>
      {showForm && <RecipeSearchForm handleSearch={handleSearch} />}
      {!showForm && (
        <>
          {loading && <CircularProgress />}
          {error && (
            <Typography color="error">
              {typeof error === 'string' ? error : 'An unexpected error occurred.'}
            </Typography>
          )}
          {!loading && !error && recipes.length > 0 && (
            <RecipeCards recipes={recipes} handleViewDetails={handleViewDetails} />
          )}
          {!loading && !error && recipes.length === 0 && (
            <Typography variant="body1">No recipes found.</Typography>
          )}
        </>
      )}
      {!showForm && recipes.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleBackToRecipes}
          style={{ marginTop: '20px' }}
        >
          New search
        </Button>
      )}
    </div>
  );
};

export default Recipes;
