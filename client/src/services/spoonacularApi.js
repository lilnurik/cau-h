

export const fetchRecipes = async (dataobj) => {
  const apiKey = "33e797efb611406f83621fe2f506c276"
  const baseUrl = "https://api.spoonacular.com/recipes/complexSearch";  

  const url = new URL(baseUrl);
  url.search = new URLSearchParams({
      query: dataobj.query,
      cuisine: dataobj.cuisine,
      intolerances: dataobj.intolerances,
      diet: dataobj.diet,
      excludeCuisine: dataobj.excludeCuisine,
      apiKey: apiKey
  }).toString();

  try {
      const response = await fetch(url, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
          }
      });
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error:', error);
      throw error;
  }
};

// Function to fetch detailed information about a single recipe
export const fetchRecipeDetails = async (recipeId) => {
  const apiKey = "33e797efb611406f83621fe2f506c276"
  const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error;
  }
};

// Fetch details for all recipes
export const fetchAllRecipeDetails = async (recipes) => {
  try {
    const detailsPromises = recipes.map(recipe => fetchRecipeDetails(recipe.id));
    const detailedRecipes = await Promise.all(detailsPromises);
    return detailedRecipes;
  } catch (error) {
    console.error('Error fetching all recipe details:', error);
    throw error;
  }
};

// Example usage: Fetch detailed recipes after getting basic recipes
export const getDetailedRecipes = async (dataobj) => {
  try {
    const basicRecipes = await fetchRecipes(dataobj);
    const detailedRecipes = await fetchAllRecipeDetails(basicRecipes.results);
    return detailedRecipes;
  } catch (error) {
    console.error('Error getting detailed recipes:', error);
    throw error;
  }
};

export const fetchBasicRecipes = async (query) => {
  const apiKey = "33e797efb611406f83621fe2f506c276"

  const baseUrl = "https://api.spoonacular.com/recipes/complexSearch";  

  const url = new URL(baseUrl);
  url.search = new URLSearchParams({
      query: query,
      apiKey: apiKey
  }).toString();

  try {
      const response = await fetch(url, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
          }
      });
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error:', error);
      throw error;
  }
};
