import React, { useState , useEffect} from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Drawer, List, ListItem, ListItemText, Switch } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserState, useUserDispatch } from '../UserContext'; 
import BasicRecipeSearchForm from './BasicRecipeSearchForm';
import '../styles/Layout.css';

const Layout = ({ children, mode, onModeChange }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserState();  
  const { setUser } = useUserDispatch();  

  const hideAppBarRoutes = ['/login', '/signup'];

  const shouldHideAppBar = hideAppBarRoutes.includes(location.pathname);
  
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', { method: 'DELETE' });

      if (response.ok) {
        setUser(null);
        setDrawerOpen(false)
        navigate('/login');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Logout failed');
      }
    } catch (err) {
      console.error('Logout error:', err.message);
    }
  };



  return (
    <div className="background-container">
      {!shouldHideAppBar && (
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component={Link} to="/home" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
              SAFEBITES
            </Typography>
            {user && (
              <>
                <Button color="inherit" component={Link} to="/profile">
                  Profile
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
            <Switch
              checked={mode === 'dark'}
              onChange={onModeChange}
              sx={{ ml: 2 }} 
            />          
          </Toolbar>
        </AppBar>
      )}
      {/* Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 270, 
          },
        }}
      >
        <div style={{ padding: '10px' }}>
          <BasicRecipeSearchForm handleSearch={() => setDrawerOpen(false)} />
        </div>
        <List>
          <ListItem className="drawer-link" component={Link} to="/restaurants" onClick={() => setDrawerOpen(false)}>
            <ListItemText primary="Restaurants" />
          </ListItem>
          <ListItem className="drawer-link" component={Link} to="/recipes" onClick={() => setDrawerOpen(false)}>
            <ListItemText primary="Recipes" />
          </ListItem>
          <ListItem className="drawer-link" component={Link} to="/profile">
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button className="drawer-button" onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      <main style={{ padding: '16px 5% 50px 7%' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
