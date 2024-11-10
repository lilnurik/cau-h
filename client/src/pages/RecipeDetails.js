import React, { useState, useEffect, useRef } from 'react';
import { Typography, CircularProgress, Card, CardContent, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRecipeDetails } from '../services/spoonacularApi';
import { useReviewContext } from '../ReviewContext';
import { useUserState, useUserDispatch } from '../UserContext';
import RecipeReviewForm from '../components/RecipeReviewForm';
import RecipeReviewCard from '../components/RecipeReviewCard';
import RecipeReviewEditForm from '../components/RecipeReviewEditForm';

const RecipeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUserState();
    const { checkSession } = useUserDispatch();
    const { reviews, fetchReviews, addReview, deleteReview, editReview, loading: reviewLoading, error: reviewError } = useReviewContext();

    const [recipe, setRecipe] = useState(null);
    const [localError, setLocalError] = useState(null);
    const [localLoading, setLocalLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [showReviews, setShowReviews] = useState(false);
    const [editReviewData, setEditReviewData] = useState(null);

    const reviewsFetched = useRef(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await fetchRecipeDetails(id);
                setRecipe(data);
            } catch (err) {
                setLocalError(err.message);
            } finally {
                setLocalLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    useEffect(() => {
        if (showReviews && !reviewsFetched.current) {
            const fetchReviewsData = async () => {
                try {
                    await fetchReviews(id);
                    reviewsFetched.current = true;
                } catch (err) {
                    console.error('Error fetching reviews:', err.message);
                }
            };

            fetchReviewsData();
        }
    }, [showReviews, id, fetchReviews]);

    
    useEffect(() => {
        const checkUserSession = async () => {
            await checkSession();
        };

        checkUserSession();
    }, [checkSession]);

    const handleBackToRecipes = () => {
        navigate('/recipes');
    };

    const handleShowReviewForm = () => {
        setShowReviewForm(true);
    };

    const handleCloseReviewForm = () => {
        setShowReviewForm(false);
    };

    const handleReviewSubmit = async (values) => {
        const reviewData = {
            title: values.title,
            comment: values.comment,
            rating: parseFloat(values.rating),
        };

        try {
            await addReview(id, reviewData);
            handleCloseReviewForm();
            setShowReviews(true); 
        } catch (error) {
            console.error('Error adding review:', error.message);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await deleteReview(reviewId);
            setShowReviews(true); 
        } catch (error) {
            console.error('Error deleting review:', error.message);
        }
    };

    const handleEditReview = (review) => {
        setEditReviewData(review);
    };

    const handleEditReviewSave = async (updatedReview) => {
        try {
            await editReview(editReviewData.id, updatedReview);
            setEditReviewData(null);
            setShowReviews(true); 
        } catch (error) {
            console.error('Error editing review:', error.message);
        }
    };

    const handleEditReviewCancel = () => {
        setEditReviewData(null);
    };

    if (localLoading) return <CircularProgress />;
    if (localError) return <Typography color="error">{localError}</Typography>;
    if (!recipe) return <Typography>No recipe details found</Typography>;

    const reviewList = Array.isArray(reviews) ? reviews : [];

    return (
        <>
            <Card>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>{recipe.title}</Typography>
                    <img 
                        src={recipe.image} 
                        alt={recipe.title} 
                        style={{ width: '40%', height: 'auto', display: 'block', margin: '0 auto' }} 
                    />
                    <Typography variant="h6">Ingredients:</Typography>
                    <ul>
                        {recipe.extendedIngredients.map((ingredient, index) => (
                            <li key={ingredient.id || index}>{ingredient.original}</li>
                        ))}
                    </ul>
                    <Typography variant="h6">Instructions:</Typography>
                    <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleBackToRecipes}
                        style={{ marginTop: '20px' }}
                    >
                        Back to results
                    </Button>
                    <br />
                    <Button 
                        variant="contained"
                        color="secondary"
                        onClick={() => setShowReviews(prev => !prev)}
                        style={{ marginTop: '20px' }}
                    >
                        {showReviews ? 'Hide Reviews' : 'Show Reviews'}
                    </Button>
                    {user && (
                        <Button 
                            variant="contained"
                            color="secondary"
                            onClick={handleShowReviewForm}
                            style={{ marginTop: '20px' }}
                        >
                            Add a review
                        </Button>
                    )}
                </CardContent>
            </Card>

            <Dialog
                open={showReviewForm}
                onClose={handleCloseReviewForm}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Add a Review</DialogTitle>
                <DialogContent>
                    <RecipeReviewForm 
                        onSubmit={handleReviewSubmit}
                        onClose={handleCloseReviewForm}
                    />
                </DialogContent>
            </Dialog>

            <Dialog
                open={!!editReviewData}
                onClose={handleEditReviewCancel}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Edit Review</DialogTitle>
                <DialogContent>
                    {editReviewData && (
                        <RecipeReviewEditForm 
                            review={editReviewData}
                            onSave={handleEditReviewSave}
                            onCancel={handleEditReviewCancel}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {showReviews && (
                <Card style={{ marginTop: '20px' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Reviews:</Typography>
                        {reviewLoading ? (
                            <CircularProgress />
                        ) : reviewError ? (
                            <Typography color="error">{reviewError}</Typography>
                        ) : reviewList.length === 0 ? (
                            <Typography>No reviews yet, be the first to leave a review!</Typography>
                        ) : (
                            reviewList.map(review => (
                                <RecipeReviewCard 
                                    key={review.id} 
                                    review={review} 
                                    onDelete={handleDeleteReview}
                                    onEdit={handleEditReview}
                                    user={user} 
                                />
                            ))
                        )}
                    </CardContent>
                </Card>
            )}
        </>
    );
};

export default RecipeDetails;
