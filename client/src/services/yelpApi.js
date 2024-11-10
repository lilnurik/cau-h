
export const fetchNearbyRestaurants = async (dataobj) => {
    const apiKey = "MckPvlQ0RGdDI1Jij5GWa0TPE6qgU0_VRsUIRYzAX07g0OY1MmhxWVBfTOsSQAznesNnwgulQ5zs-5yJzcq6poX-8psQAFbkXoxf1g4SzUXJ39f--_9FwAsxCVkvZ3Yx"
    const baseUrl = 'https://api.yelp.com/v3/businesses/search';
    
    const url = new URL(baseUrl);
    url.search = new URLSearchParams({
        location: dataobj.location,
        term: dataobj.term,
        categories: dataobj.categories,
        limit: 20,
        apiKey: apiKey
    }).toString();

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${apiKey}`
            }
        });
        if (!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }

};

export const fetchRestaurantDetails = async (id) => {
    const apiKey = "MckPvlQ0RGdDI1Jij5GWa0TPE6qgU0_VRsUIRYzAX07g0OY1MmhxWVBfTOsSQAznesNnwgulQ5zs-5yJzcq6poX-8psQAFbkXoxf1g4SzUXJ39f--_9FwAsxCVkvZ3Yx"
    const baseUrl = `https://api.yelp.com/v3/businesses/${id}`;
  
    try {
      const response = await fetch(baseUrl, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${apiKey}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
