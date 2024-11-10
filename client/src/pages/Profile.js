import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Card, CardContent, Snackbar, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useUserState } from '../UserContext';
import { useReviewContext } from '../ReviewContext';
import UpdateProfileInfoForm from '../components/UpdateProfileInfoForm';
import ChangePasswordForm from '../components/ChangePasswordForm';
import RecipeReviewEditForm from '../components/RecipeReviewEditForm';
import RecipeReviewCard from '../components/RecipeReviewCard';
// import { RestaurantCarousel } from '../components/RestaurantCarousel';

import '../index.css';

const Profile = () => {
    const { user } = useUserState();
    const [selectedSection, setSelectedSection] = useState('Personal Info');
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [editReviewData, setEditReviewData] = useState(null);
    const [passwordChangeError, setPasswordChangeError] = useState('');
    const { reviews, fetchMyReviews, deleteReview, editReview, loading: reviewLoading, error: reviewError } = useReviewContext();
    
    const reviewsFetched = useRef(false);

    useEffect(() => {
        if (user && !reviewsFetched.current) {
            const fetchUserReviews = async () => {
                try {
                    await fetchMyReviews();
                    reviewsFetched.current = true;
                } catch (error) {
                    console.error('Error fetching reviews:', error);
                }
            };
            fetchUserReviews();
        }
        setLoading(false);
    }, [user, fetchMyReviews]);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleProfileUpdate = async (values) => {
        try {
            const requestData = {
                new_username: values.username,
                new_email: values.email,
                diet: values.diet,
                intolerance: values.intolerance,
                cuisine: values.cuisine
            };
    
            const response = await fetch('http://127.0.0.1:5000/update_profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(requestData),
                credentials: 'include' 
            });
    
            const result = await response.json();
    
            if (response.ok) {
                setSnackbarMessage('Profile updated successfully!');
            } else {
                setSnackbarMessage(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setSnackbarMessage('Failed to update profile.');
        }
        setSnackbarOpen(true);
    };
    
    const handlePasswordChange = async (currentPassword, newPassword) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/update_password', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    oldPassword: currentPassword,
                    newPassword: newPassword
                }),
                credentials: 'include'
            });

            const result = await response.json();

            if (response.ok) {
                setSnackbarMessage('Password changed successfully!');
                setPasswordChangeError('');
                setSelectedSection('Personal Info'); 
            } else {
                setPasswordChangeError(result.error || 'Failed to change password.');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setPasswordChangeError('Failed to change password.');
        }
        setSnackbarOpen(true);
    };


    const handleEditReview = (review) => {
        setEditReviewData(review);
    };

    const handleEditReviewSave = async (updatedReview) => {
        try {
            await editReview(editReviewData.id, updatedReview);
            setEditReviewData(null);
            await fetchMyReviews(); 
        } catch (error) {
            console.error('Error editing review:', error.message);
        }
    };

    const handleEditReviewCancel = () => {
        setEditReviewData(null);
    };

    const renderContent = () => {
        switch (selectedSection) {
            case 'Personal Info':
                return <UpdateProfileInfoForm
                    onSubmit={handleProfileUpdate}
                    initialValues={{
                        username: user.username,
                        email: user.email,
                        diet: user.diet || [],
                        intolerance: user.intolerance || [],
                        cuisine: user.cuisine || []
                    }}
                />;
                case 'Change Password':
                    return <ChangePasswordForm 
                        onClose={() => setSelectedSection('Personal Info')} 
                        onChangePassword={handlePasswordChange} 
                    />;
            case 'Saved Restaurants':
                return (
                    <>
                        <Typography variant="h4" gutterBottom>Saved Restaurants</Typography>
                        {/* Implement saved restaurants content here */}
                    </>
                );
            case 'Reviews':
                return (
                    <>
                        <Typography variant="h4" gutterBottom>My Reviews</Typography>
                        {reviewLoading ? (
                            <div>Loading reviews...</div>
                        ) : reviewError ? (
                            <Typography color="error">{reviewError}</Typography>
                        ) : reviews.length === 0 ? (
                            <Typography>No reviews yet.</Typography>
                        ) : (
                            reviews.map(review => (
                                <RecipeReviewCard 
                                    key={review.id} 
                                    review={review} 
                                    onDelete={deleteReview} 
                                    onEdit={handleEditReview}
                                    user={user} 
                                />
                            ))
                        )}
                        {editReviewData && (
                            <RecipeReviewEditForm
                                review={editReviewData}
                                onSave={handleEditReviewSave}
                                onCancel={handleEditReviewCancel}
                            />
                        )}
                    </>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>No user data available. Please log in.</div>;
    }

    return (
        <Container maxWidth="lg" style={{ marginTop: '2rem', display: 'flex' }}>
            <Card style={{ minWidth: '250px', marginRight: '2rem' }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Hi, {user.username}
                    </Typography>
                    <List>
                        <ListItem button onClick={() => setSelectedSection('Personal Info')}>
                            <ListItemText primary="Personal Info" />
                        </ListItem>
                        <ListItem button onClick={() => setSelectedSection('Change Password')}>
                            <ListItemText primary="Change Password" />
                        </ListItem>
                        <Divider />
                        {/* Adding favorite restaurants later */}
                        {/* <ListItem button onClick={() => setSelectedSection('Saved Restaurants')}>
                            <ListItemText primary="Saved Restaurants" />
                        </ListItem> */}
                        <ListItem button onClick={() => setSelectedSection('Reviews')}>
                            <ListItemText primary="Reviews" />
                        </ListItem>
                    </List>
                </CardContent>
            </Card>
            <Card variant="outlined" style={{ flexGrow: 1 }}>
                <CardContent>
                    {renderContent()}
                </CardContent>
            </Card>
            <Snackbar
                open={snackbarOpen}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
                autoHideDuration={3000}
            />
        </Container>
    );
};

export default Profile;
