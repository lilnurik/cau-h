import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Card, CardContent, Typography, CardMedia, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

export const RestaurantCarousel = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);  // Состояние для загрузки данных
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/get_favorite_restaurants');
        const data = await response.json();
  
        // Log the data to inspect its structure
        console.log(data);
  
        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setRestaurants(data);
        } else {
          console.error('Fetched data is not an array', data);
          setRestaurants([]);  // Set empty array if data is not valid
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setRestaurants([]);  // In case of error, set empty array
      } finally {
        setLoading(false);  // Ensure loading state is updated
      }
    };
  
    fetchRestaurants();
  }, []);
  

  const viewDetails = (id) => {
    navigate(`/restaurant/${id}`);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (restaurants.length === 0) {
    return <Typography variant="h6">You currently don't have any restaurant favorited.</Typography>;
  }

  if (restaurants.length <= 3) {
    return (
      <div>
        {restaurants.map((restaurant, index) => (
          <Card key={index} style={{ margin: '10px' }}>
            <CardMedia
              component="img"
              style={{ height: '200px', width: 'auto', objectFit: 'cover' }}
              image={restaurant.image_url}
              alt={restaurant.name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {restaurant.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {restaurant.address}
                <br />
                Rating: {restaurant.rating}
              </Typography>
              <Button
                size="small"
                color="primary"
                onClick={() => viewDetails(restaurant.restaurant_id)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Slider {...settings}>
      {restaurants.map((restaurant, index) => (
        <Card key={index} style={{ margin: '10px' }}>
          <CardMedia
            component="img"
            height="140"
            image={restaurant.image_url}
            alt={restaurant.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              {restaurant.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {restaurant.address}
              <br />
              Rating: {restaurant.rating}
            </Typography>
            <Button
              size="small"
              color="primary"
              onClick={() => viewDetails(restaurant.restaurant_id)}
            >
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </Slider>
  );
};
