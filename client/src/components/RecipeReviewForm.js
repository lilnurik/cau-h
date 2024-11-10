import React from 'react';
import { TextField, Button, Typography, FormControl } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import StarRating from './StarRating'; 


const initialValues = {
    title: '',
    comment: '',
    rating: '',
};

const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    comment: Yup.string().required('Comment is required'),
    rating: Yup.number()
        .nullable()
        .required('Rating is required')
        .min(0.5, 'Rating must be at least 0.5')
        .max(5, 'Rating cannot be more than 5'),
});

const RecipeReviewForm = ({ onSubmit, onClose }) => {

    const handleSearchSubmit = async (values, { setSubmitting }) => {
        await onSubmit(values);
        setSubmitting(false);
        onClose(); 
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={handleSearchSubmit}
            validationSchema={validationSchema}
        >
            {({ isSubmitting }) => (
                <Form>
                    <Typography variant="h6" gutterBottom>
                        Add a review
                    </Typography>

                    <Field name="title">
                        {({ field }) => (
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    {...field}
                                    label="Add a title"
                                    variant="outlined"
                                />
                                <ErrorMessage name="title" component="div" style={{ color: 'red' }} />
                            </FormControl>
                        )}
                    </Field>

                    <Field name="comment">
                        {({ field }) => (
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    {...field}
                                    label="Add a comment"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                />
                                <ErrorMessage name="comment" component="div" style={{ color: 'red' }} />
                            </FormControl>
                        )}
                    </Field>

                    <Field name="rating">
                        {({ field, form }) => (
                            <FormControl fullWidth margin="normal">
                                <Typography gutterBottom>Rating:</Typography>
                                <StarRating field={field} form={form} />
                                <ErrorMessage name="rating" component="div" style={{ color: 'red' }} />
                            </FormControl>
                        )}
                    </Field>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        sx={{ mt: 2 }}
                    >
                        Submit
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default RecipeReviewForm;