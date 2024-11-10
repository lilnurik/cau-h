import React, { createContext, useState, useContext } from 'react';
import { fetchRecipes } from './services/spoonacularApi';

const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(true); 

  const getRecipes = async (dataobj) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedRecipes = await fetchRecipes(dataobj);
      setRecipes(fetchedRecipes.results);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setRecipes([]);
    setError(null);
    setShowForm(true);
  };

  return (
    <RecipeContext.Provider value={{ recipes, getRecipes, loading, error, showForm, setShowForm, resetState }}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipeContext = () => {
  return useContext(RecipeContext);
};
