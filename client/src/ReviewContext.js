import React, { createContext, useState, useContext } from 'react';

const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(true); 

  const fetchReviews = async (recipeId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://127.0.0.1:5000/recipe_reviews/${recipeId}`);
      const data = await response.json();
      setReviews(data);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchMyReviews = async () => {
    setLoading(true);
    setError(null);
    try {
        const response = await fetch(`/get_all_my_reviews`);
        const data = await response.json();
        setReviews(data);
        setShowForm(false);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  const addReview = async (id, reviewData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/create_review/recipe/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      const newReview = await response.json();
      setReviews(prevReviews => [...prevReviews, newReview.review]);
      setShowForm(false); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      console.log('this works')
    }
  };

  const deleteReview = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/delete_review/recipe/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete review');
      }
      // Remove the deleted review from the state
      setReviews(prevReviews => prevReviews.filter(review => review.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const editReview = async (id, updatedReviewData) => {
    setLoading(true);
    setError(null);

    try {
        const response = await fetch(`/edit_review/recipe/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedReviewData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to edit review');
        }

        const updatedReview = await response.json();
        setReviews(prevReviews =>
            prevReviews.map(review => review.id === id ? updatedReview.review : review)
        );

    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

  const resetState = () => {
    setReviews([]);
    setError(null);
    setShowForm(true);
  };

  return (
    <ReviewContext.Provider value={{ reviews, fetchReviews, addReview, deleteReview, editReview, fetchMyReviews, loading, error, showForm, setShowForm, resetState }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviewContext = () => {
  return useContext(ReviewContext);
};
