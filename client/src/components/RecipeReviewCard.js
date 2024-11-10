import React from 'react';
import { Card, CardContent, Typography, IconButton, useTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteRounded';
import EditIcon from '@mui/icons-material/Edit';

const RecipeReviewCard = ({ review, onDelete, onEdit, user }) => {
    const theme = useTheme();
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); 
    };


    return (
        <Card
            style={{
                marginBottom: '10px',
                backgroundColor: theme.palette.mode === 'light' 
                    ? '#f5f5f5' 
                    : '#616161', 
            }}
        >
            <CardContent>
                <Typography variant="h6">{review.title}</Typography>
                <Typography variant="body2">Posted: {formatDate(review.created_at)}</Typography>
                <Typography variant="body2">{review.comment}</Typography>
                <Typography variant="body2">Rating: {review.rating}</Typography>
                {user && review.user_id === user.id && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => onDelete(review.id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                        <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => onEdit(review)}
                        >
                            <EditIcon />
                        </IconButton>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default RecipeReviewCard;
