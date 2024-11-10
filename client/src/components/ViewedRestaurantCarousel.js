import React , {useEffect, useState} from 'react';
import Slider from 'react-slick';
import { Card, CardContent, Typography, CardMedia, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick-theme.css';


export const ViewedRestaurantCarousel = () => {
    const [restaurants, setRestaurants] = useState([]);
    const navigate = useNavigate();
    

    useEffect(() => {
      const fetchRestaurants = async () => {
        const response = await fetch('/get_viewed_restaurants'); 
        const data = await response.json();
        setRestaurants(data);
      };
  
      fetchRestaurants();
    }, []);

    const viewDetails = (id) => {
        navigate(`/restaurant/${id}`)
      };
      

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      };
    
      if (restaurants.length === 0) {
        return <Typography variant="h8">Oops! There is nothing to see here~</Typography>;
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
                    <br/>
                    Rating: {restaurant.rating}
                  </Typography>
                  <Button
                  size="small"
                  color="primary"
                  onClick={() => viewDetails(restaurant.id)}
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
                  <br/>
                  Rating: {restaurant.rating}
                </Typography>
                <Button
                size="small"
                color="primary"
                onClick={() => viewDetails(restaurant.id)}
                >
                View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </Slider>
      );
    };