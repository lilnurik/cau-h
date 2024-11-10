import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Recipes from './pages/Recipes';
import RecipeDetails from './pages/RecipeDetails';
import Restaurants from './pages/restaurants';
import RestaurantDetails from './pages/RestaurantDetails';
import Layout from './components/Layout';
import { lightTheme, darkTheme } from './styles/theme';
import { UserProvider, useUserDispatch } from './UserContext'; 
import { RecipeProvider } from './RecipeContext'; 
import { RestaurantProvider } from './RestaurantContext'; 
import { ReviewProvider } from './ReviewContext';
import { useLocation } from 'react-router-dom';

const AppRoutes = () => {
  const navigate = useNavigate();
  const { checkSession } = useUserDispatch();
  const location = useLocation(); // Get the current location

  useEffect(() => {
    const checkUserSession = async () => {
      const isAuthenticated = await checkSession();
      if (!isAuthenticated && location.pathname !== '/login' && location.pathname !== '/signup') {
        navigate('/login'); 
      }
    };

    // Check session only if not on login or signup pages
    if (location.pathname !== '/login' && location.pathname !== '/signup') {
      checkUserSession();
    }
  }, [checkSession, navigate, location]);

  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/recipes" element={<Recipes />} />
      <Route path="/recipe/:id" element={<RecipeDetails />} />
      <Route path="/restaurants" element={<Restaurants />} />
      <Route path="/restaurant/:id" element={<RestaurantDetails />} />
    </Routes>
  );
};

function App() {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') || 'light';
    setMode(savedMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const theme = mode === 'light' ? lightTheme : darkTheme;

  const handleModeChange = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <UserProvider>
      <RecipeProvider>
        <RestaurantProvider>
          <ReviewProvider>
            <ThemeProvider theme={theme}>
              <Router>
                <Layout mode={mode} onModeChange={handleModeChange}>
                  <AppRoutes />
                </Layout>
              </Router>
            </ThemeProvider>
          </ReviewProvider>
        </RestaurantProvider>
      </RecipeProvider>
    </UserProvider>
  );
}

export default App;
