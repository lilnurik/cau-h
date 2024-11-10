

import axios from 'axios';

const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const BASE_URL = 'https://maps.googleapis.com/maps/api';

export const fetchPlaces = async (location) => {
  try {
    const response = await axios.get(`${BASE_URL}/place/nearbysearch/json`, {
      params: {
        key: API_KEY,
        location: location,
        radius: 1500,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching places:', error);
    throw error;
  }
};
g