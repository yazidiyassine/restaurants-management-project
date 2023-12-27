import React, { useEffect, useState } from 'react';
import AuthUser from '../../auth/AuthUser';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, Skeleton } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';

const GetRestaurantInfo = () => {
    const [restaurantInfo, setRestaurantInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { httpClient } = AuthUser();
    const navigate = useNavigate();
    const { id } = useParams();

    const fetchRestaurantInfo = async () => {
        try {
            const response = await httpClient.get(`/get-restaurant-info/${id}`);
            if (response.status === 200) {
                setRestaurantInfo(response.data.restaurant);

                setError(null);
            }
        } catch (error) {
            setError('Error fetching restaurant information. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchRestaurantInfo();
        } else {
            navigate('/');
        }
    }, [id]);

    const handleBookNow = () => {
        if (restaurantInfo.id) {
            navigate(`/all-tables/${restaurantInfo.id}`);
        }
    };
    return (
        <div className="flex justify-center items-center mt-8">
            <Card sx={{ maxWidth: 345 }}>
                {loading ? (
                    <Skeleton variant="rectangular" width={380} height={180} />
                ) : (
                    <img
                        src={restaurantInfo.image}
                        alt="restaurant"
                        className="relative w-full min-w-[280px] min-h-[180px] overflow-hidden aspect-video object-cover block rounded-md"
                    />
                )}
                <CardContent>
                    {loading ? (
                        <>
                            <Skeleton variant="text" width="60%" />
                            <Skeleton variant="text" width="80%" />
                            <Skeleton variant="text" width="80%" />
                        </>
                    ) : (
                        <>
                            <Typography gutterBottom variant="h5" component="div" className="text-center">
                                {restaurantInfo.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" className="text-center">
                                {restaurantInfo.address.line_1}
                                <br />
                                {restaurantInfo.city}
                                {restaurantInfo.state.name}
                                <br />
                                {restaurantInfo.pincode} {restaurantInfo.city}
                            </Typography>
                        </>
                    )}
                </CardContent>
                <CardActions className="justify-center">
                    <Button onClick={handleBookNow} size="small">
                        Book Now!
                    </Button>
                </CardActions>
            </Card>
        </div>
    );
};

export default GetRestaurantInfo;