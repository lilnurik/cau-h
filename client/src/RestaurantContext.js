import React, { createContext, useState, useContext } from 'react';
import { fetchNearbyRestaurants } from './services/yelpApi';

const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(true);

  const getRestaurants = async ( dataobj ) => {
    setStatus('loading');
    try {
      const fetchedRestaurants = await fetchNearbyRestaurants(dataobj);
      setRestaurants(fetchedRestaurants.businesses);
      setShowForm(false);
      setStatus('succeeded');
    } catch (error) {
      setError(error.message);
      setStatus('failed');
    }
  };

  const resetState = () => {
    setRestaurants([]);
    setError(null);
    setShowForm(true);
  };

  return (
    <RestaurantContext.Provider value={{ restaurants, getRestaurants, status, error , setShowForm, showForm, resetState}}>
        {children}
    </RestaurantContext.Provider>
  );
};



// Custom hooks for using context
export const useRestaurantContext = () => {
  return useContext(RestaurantContext);

}