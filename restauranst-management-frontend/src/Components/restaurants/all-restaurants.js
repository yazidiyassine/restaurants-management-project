// AllRestaurant.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthUser from '../../auth/AuthUser';
import RestaurantCard, { withTopRatedLabel } from './RestaurantCard';
import ShimmerCard from './ShimmerCard';
import Search from "../home/Search";
import Box from "@mui/material/Box";
import {Skeleton} from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const AllRestaurant = ({ isLoading }) => {
    const RestaurantCardTopRated = withTopRatedLabel(RestaurantCard);

    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };
    const [restaurants, setRestaurants] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { httpClient } = AuthUser();

    const fetchRestaurants = async () => {
        try {
            const response = await httpClient.get('/all-restaurants');
            if (response.status === 200) {
                setRestaurants(response.data.restaurants);
            }
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        }
    };

    useEffect(() => {
        fetchRestaurants();
        handleOpen();
    }, [isLoading]);

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const filteredRestaurants = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Search onSearch={handleSearch} />
            <div className='container mx-auto mt-8 mb-16'>
                <h1 className='my-2 font-bold text-2xl text-zinc-700 mb-5'>
                    Restaurants near you
                </h1>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 justify-center'>
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <ShimmerCard key={i} />
                        ))
                    ) : filteredRestaurants && filteredRestaurants?.length !== 0 ? (
                        filteredRestaurants.map((restaurant, i) => (
                            <Link
                                to={`/get-restaurant-info/${restaurant.id}`}
                                className='hover:scale-95 transition ease-in-out duration-300 relative z-10 flex'
                                key={i}
                            >
                                <div className='overflow-hidden border rounded-md transition-transform transform hover:shadow-lg flex-1'>
                                    {restaurant.user_id >= 4.2 ? (
                                        <RestaurantCardTopRated
                                            restaurant={restaurant}
                                        />
                                    ) : (
                                        <RestaurantCard restaurant={restaurant} />
                                    )}
                                </div>
                            </Link>
                        ))
                    ) : (
                        <>
                            <Backdrop
                                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                open={open}
                                onClick={handleClose}
                            >
                                <CircularProgress color="inherit" />
                            </Backdrop>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default AllRestaurant;
