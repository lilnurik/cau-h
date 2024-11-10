import React from 'react';
import { TextField, Button, Typography, FormControl } from '@mui/material';
import { useRecipeContext } from '../RecipeContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import CustomSelect from './CustomSelect';

const cuisineOptions = [
  'African', 'Asian', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese', 
  'Eastern European', 'European', 'French', 'German', 'Greek', 'Indian', 
  'Irish', 'Italian', 'Japanese', 'Jewish', 'Korean', 'Latin American', 
  'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic', 'Southern', 
  'Spanish', 'Thai', 'Vietnamese'
];

const intoleranceOptions = [
  'Dairy', 'Egg', 'Gluten', 'Grain', 'Peanut', 'Seafood', 'Sesame', 
  'Shellfish', 'Soy', 'Sulfite', 'Tree Nut', 'Wheat'
];

const dietOptions = [
  "Gluten Free", "Ketogenic", "Vegetarian", "Lacto-Vegetarian", "Ovo-Vegetarian", "Vegan", "Pescetarian", "Paleo", "Primal"
];

const RecipeSearchForm = ({ handleSearch }) => {
  const { getRecipes } = useRecipeContext();

  const initialValues = {
    query: '',
    cuisine: [],
    intolerances: [],
    diet: [],
    excludeCuisine: []
  };

  const handleSearchSubmit = async (values, { setSubmitting }) => {
    const dataobj = {
      query: values.query,
      cuisine: values.cuisine.join(','),
      intolerances: values.intolerances.join(','),
      diet: values.diet.join(','),
      excludeCuisine: values.excludeCuisine.join(',')
    };
    await getRecipes(dataobj);
    handleSearch(); // Hide form after search
    setSubmitting(false);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSearchSubmit}>
      {({ isSubmitting }) => (
        <Form>
          <Typography variant="h6" gutterBottom>
            Search for Recipes
          </Typography>
          <Field name="query">
            {({ field }) => (
              <FormControl fullWidth margin="normal">
                <TextField
                  {...field}
                  label="Search query"
                  variant="outlined"
                />
                <ErrorMessage name="query" component="div" style={{ color: 'red' }} />
              </FormControl>
            )}
          </Field>
          <Field name="cuisine">
            {({ field, form }) => (
              <CustomSelect
                margin="normal"
                label="Preferred Cuisine"
                name="cuisine"
                options={cuisineOptions}
                value={field.value}
                onChange={(value) => form.setFieldValue("cuisine", value)}
              />
            )}
          </Field>
          <Field name="intolerances">
            {({ field, form }) => (
              <CustomSelect
                label="Intolerances"
                name="intolerances"
                options={intoleranceOptions}
                value={field.value}
                onChange={(value) => form.setFieldValue("intolerances", value)}
              />
            )}
          </Field>
          <Field name="diet">
            {({ field, form }) => (
              <CustomSelect
                label="Diet"
                name="diet"
                options={dietOptions}
                value={field.value}
                onChange={(value) => form.setFieldValue("diet", value)}
              />
            )}
          </Field>
          <Field name="excludeCuisine">
            {({ field, form }) => (
              <CustomSelect
                label="Exclude Cuisine"
                name="excludeCuisine"
                options={cuisineOptions}
                value={field.value}
                onChange={(value) => form.setFieldValue("excludeCuisine", value)}
              />
            )}
          </Field>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ mt: 2 }}
          >
            Search
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default RecipeSearchForm;
