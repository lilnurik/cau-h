import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { Container, Typography, Paper, CircularProgress, Alert, Box } from '@mui/material';
import { useUserState, useUserDispatch } from '../UserContext';
import logo from '../images/safe-bites-logo.png';

const Login = () => {
  const { status, error } = useUserState();
  const { setUser, setStatus, setError } = useUserDispatch();
  const navigate = useNavigate();

  const handleLogin = async (values, { resetForm }) => {
    setStatus('loading');

    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const userData = await response.json();
      setUser(userData);
      resetForm();
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ gap: 2 }} 
    >
      <Box
        sx={{
          display: { xs: 'none', md: 'block' }, 
          width: '40%', 
          textAlign: 'center',
          padding: 2,
          marginRight: 1, 
        }}
      >
        <img src={logo} alt="Safe Bites Logo" style={{ maxWidth: '100%', height: 'auto' }} />
      </Box>

      <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h1" component="h1" gutterBottom>
            Login
          </Typography>
          <Typography variant="h10" align="center">
            Discover recipes and restaurants tailored to your needs—whether it's dietary restrictions, specific cuisines, or personal preferences!
          </Typography>

          {status === 'loading' && <CircularProgress sx={{ mt: 2 }} />}
          {status === 'failed' && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          <LoginForm onSubmit={handleLogin} />
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
