import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();
const UserDispatchContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [sessionChecked, setSessionChecked] = useState(false); 

  // Function to check user session
  const checkSession = async () => {
    if (sessionChecked) return true; // Avoid redundant checks

    setStatus('loading');
    try {
      const response = await fetch('http://127.0.0.1:5000/check_session'); 
      const data = await response.json();
      if (response.ok) {
        setUser(data);
        setStatus('succeeded');
        setSessionChecked(true); 
        return true; 
      } else {
        setError(data.error);
        setStatus('failed');
        return false; 
      }
    } catch (error) {
      setError(error.message);
      setStatus('failed');
      return false; 
    }
  };

  return (
    <UserContext.Provider value={{ user, status, error }}>
      <UserDispatchContext.Provider value={{ setUser, setStatus, setError, checkSession }}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
};

// Custom hooks for using context
export const useUserState = () => useContext(UserContext);
export const useUserDispatch = () => useContext(UserDispatchContext);
