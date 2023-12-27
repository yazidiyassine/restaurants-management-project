import React, { useEffect, useState } from 'react';
import { FormControl, Grid, InputLabel, LinearProgress, Paper } from '@mui/material';
import AuthUser from '../../auth/AuthUser';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {useNavigate, useParams} from 'react-router-dom';

const TableList = () => {
    const [tables, setTables] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { httpClient, restaurants, setRestaurants, fetchRestaurants } = AuthUser();
    const navigate = useNavigate();
    const { id } = useParams();

    const fetchTables = async () => {
        try {
            setLoading(true);
            const response = await httpClient.get(`/tables/list?restaurant_id=${selectedRestaurant}`);
            if (response.status === 200) {
                setTables(response.data.tables);
                setError(null);
            }
        } catch (error) {
            console.error('Error fetching tables:', error);
            setError('Error fetching tables. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRestaurantChange = (event) => {
        setSelectedRestaurant(event.target.value);
    };

    useEffect(() => {
        fetchRestaurants();
        setRestaurants(restaurants);
    }, [fetchRestaurants]);

    useEffect(() => {
        if (id) {
            setSelectedRestaurant(id);
        }
        if (selectedRestaurant) {
            fetchTables();
        }
    }, [selectedRestaurant]);

    const handleClickedTable = (restaurant_id, table) => {
        navigate('/order', { state: { restaurant_id, table } });
    };

    return (
        <Paper elevation={0} style={{ padding: 16, height: '100%',  marginTop: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" component="h1" gutterBottom paddingY={3} align="center">
                Book a Table now ! <span role="img" aria-label="book a table">🍽️</span>
            </Typography>
            <Grid container justifyContent="center" alignItems="center" spacing={2}>
                <Grid item xs={12} md={6}>
                    <FormControl style={{ width: '100%', marginBottom: 20 }}>
                        <InputLabel htmlFor="restaurant-select">Select Restaurant</InputLabel>
                        <Select
                            value={selectedRestaurant}
                            onChange={handleRestaurantChange}
                            label="Select Restaurant"
                            inputProps={{
                                name: 'restaurant',
                                id: 'restaurant-select',
                            }}
                            style={{ width: '100%' }}
                        >
                            {restaurants.map((restaurant) => (
                                <MenuItem key={restaurant.id} value={restaurant.id}>
                                    {restaurant.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid container spacing={4} justifyContent="center" marginBottom={40} marginTop={3} >
                    {loading && <LinearProgress />}
                    {!loading && error && <p style={{ color: 'red' }}>{error}</p>}
                    {!loading && !error && (
                        <Grid container spacing={2} justifyContent="center">
                            {tables.map((table) => (
                                <Grid item key={table.id} xs={12} sm={6} md={4} lg={3}>
                                    <Paper elevation={3} style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
                                        <CardContent style={{ flex: 1 }}>
                                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                Table
                                            </Typography>
                                            <Typography variant="h5" component="div">
                                                {table.id}
                                            </Typography>
                                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                {table.number}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    mb: 1.5,
                                                    color: table.state === 'Occupied'
                                                        ? 'red' // Set the color for 'Occupied' state
                                                        : table.state === 'Reserved'
                                                            ? 'yellow' // Set the color for 'Reserved' state
                                                            : table.state === 'Non-Operational'
                                                                ? 'gray' // Set the color for 'Non-Operational' state
                                                                : 'green', // Default color for other states
                                                }}
                                            >
                                                {table.state}
                                            </Typography>

                                            <Typography variant="body2">{table.extra_details}</Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button
                                                size="small"
                                                onClick={() => handleClickedTable(selectedRestaurant, table)}
                                                disabled={table.state !== 'Available'}
                                            >
                                                Book Table
                                            </Button>
                                        </CardActions>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </Paper>
    );
};

export default TableList;
