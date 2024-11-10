import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid } from '@mui/material';

const RecipeReviewEditForm = ({ review, onSave, onCancel }) => {
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState('');

    useEffect(() => {
        if (review) {
            setTitle(review.title);
            setComment(review.comment);
            setRating(review.rating);
        }
    }, [review]);

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave({ title, comment, rating: parseFloat(rating) });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Rating (0-5)"
                        type="number"
                        inputProps={{ step: "0.5", min: "0", max: "5" }}
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">Save Changes</Button>
                    <Button onClick={onCancel} variant="outlined" color="secondary" style={{ marginLeft: '10px' }}>Cancel</Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default RecipeReviewEditForm;
