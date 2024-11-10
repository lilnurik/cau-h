import { fetchRestaurantDetails } from './services/yelpApi'


export const handleViewDetails = async (id, checkSession, user, navigate) => {
    // Check if user is authenticated
    const isAuthenticated = await checkSession();
    // if (!user || !user.id) {
    //   console.error('User not authenticated or user data is missing');
    //   return;
    // }
  
    // Fetch restaurant details from the API
    try {
      const restaurant = await fetchRestaurantDetails(id);
  
      // Check if restaurant exists
      if (!restaurant) {
        console.error('Restaurant not found');
        return;
      }
  
      // Save the restaurant data to the backend
      const saveResponse = await fetch('http://127.0.0.1:5000/save_yelp_restaurant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...restaurant, user_id: user.id }),  
      });
  
      if (saveResponse.ok) {
        console.log('Restaurant saved successfully!');
      } else {
        console.error('Failed to save restaurant:', await saveResponse.text());
      }
  
      navigate(`/restaurant/${id}`, { state: { restaurant } });
    } catch (error) {
      console.error('Error:', error);
    }
  };
  