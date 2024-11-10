import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Typography } from '@mui/material';
import CustomTextField from './CustomTextField';
import CustomSelect from './CustomSelect';

const dietOptions = [
  "Gluten Free", "Ketogenic", "Vegetarian", "Lacto-Vegetarian", "Ovo-Vegetarian", "Vegan", "Pescetarian", "Paleo", "Primal"
];
const intoleranceOptions = [
  "Dairy", "Egg", "Gluten", "Grain", "Peanut", "Seafood", "Sesame", "Shellfish", "Soy", "Sulfite", "Tree Nut", "Wheat"
];
const cuisineOptions = [
  "African", "Asian", "American", "British", "Cajun", "Caribbean", "Chinese", "Eastern European", "European", "French",
  "German", "Greek", "Indian", "Irish", "Italian", "Japanese", "Jewish", "Korean", "Latin American", "Mediterranean",
  "Mexican", "Middle Eastern", "Nordic", "Southern", "Spanish", "Thai", "Vietnamese"
];

const UpdateProfileInfoForm = ({ onSubmit, initialValues }) => (
    <Formik
      initialValues={{
        username: initialValues.username || '',
        email: initialValues.email || '',
        diet: Array.isArray(initialValues.diet) ? initialValues.diet : [], 
        intolerance: Array.isArray(initialValues.intolerance) ? initialValues.intolerance : [],
        cuisine: Array.isArray(initialValues.cuisine) ? initialValues.cuisine : []
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string()
          .min(3, 'Username is too short')
          .max(25, 'Username is too long')
          .required('Username is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        diet: Yup.array().of(Yup.string()),
        intolerance: Yup.array().of(Yup.string()),
        cuisine: Yup.array().of(Yup.string())
      })}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
            <CustomTextField
              name="username"
              label="Username"
              type="text"
            />
            <CustomTextField
              name="email"
              label="Email"
              type="email"
            />
            <CustomSelect
              name="diet"
              label="Diet (optional)"
              options={dietOptions}
            />
            <CustomSelect
              name="intolerance"
              label="Intolerances (optional)"
              options={intoleranceOptions}
            />
            <CustomSelect
              name="cuisine"
              label="Cuisine (optional)"
              options={cuisineOptions}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2, width: '100%' }}
              disabled={isSubmitting}
            >
              Save Changes
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );


export default UpdateProfileInfoForm;