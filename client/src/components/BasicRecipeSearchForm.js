import React from 'react';
import { TextField, Typography, FormControl, IconButton } from '@mui/material';
import { useRecipeContext } from '../RecipeContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const BasicRecipeSearchForm = ({ handleSearch }) => {
    const { getRecipes } = useRecipeContext();

    const initialValues = {
        query: '',
    };

    const navigate = useNavigate();

    const handleSearchSubmit = async (values, { setSubmitting }) => {
        const dataobj = {
            query: values.query,
        };
        await getRecipes(dataobj);
        handleSearch(); 
        setSubmitting(false);
        navigate('/recipes')
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
                            <FormControl fullWidth margin="normal" sx={{ display: 'flex', alignItems: 'center' }}>
                                <TextField
                                    {...field}
                                    label="What are you looking for?"
                                    variant="outlined"
                                    fullWidth
                                />
                                <IconButton
                                    type="submit"
                                    color="primary"
                                    aria-label="search"
                                    disabled={isSubmitting}
                                    sx={{ position: 'absolute', right: '2px' , bottom: '8px'}} // Adjust position as needed
                                >
                                    <SearchIcon />
                                </IconButton>
                                <ErrorMessage name="query" component="div" style={{ color: 'red' }} />
                            </FormControl>
                        )}
                    </Field>
                </Form>
            )}
        </Formik>
    );
};

export default BasicRecipeSearchForm;
