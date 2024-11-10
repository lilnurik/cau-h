import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignupForm from '../components/SignupForm';
import { Container, Typography, CircularProgress, Box } from '@mui/material';
import { useUserState, useUserDispatch } from '../UserContext'; 

const Signup = () => {
  const navigate = useNavigate();
  const { status, error } = useUserState();
  const { setUser, setStatus, setError } = useUserDispatch();

  const handleSignup = async (values) => {
    setStatus('loading');

    try {
      const response = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
       
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Signup failed');
      }

      const userData = await response.json();
      setUser(userData);
      setStatus('succeeded');

      navigate('/login');
    } catch (err) {
      setError(err.message);
      setStatus('failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      {status === 'loading' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {status === 'failed' && (
        <Typography color="error" variant="body1" align="center">
          Error: {error}
        </Typography>
      )}
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Sign Up
      </Typography>
      <SignupForm onSubmit={handleSignup} />
    </Container>
  );
};

export default Signup;
