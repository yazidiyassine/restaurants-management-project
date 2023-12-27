import React, {useEffect, useState} from 'react';
import {LinearProgress, Paper, Snackbar, Table, TableBody, TableCell, TableHead, TableRow} from '@mui/material';
import AuthUser from "../../auth/AuthUser";
import Button from "@mui/material/Button";
import ConfirmationModal from "./ConfirmationModel";
import UpdateRestaurantModal from "./UpdateRestaurantModel";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MuiAlert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const RestaurantList = () => {

    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const handleClick = (message, severity = 'success') => {
        setMessage(message);
        setSeverity(severity);
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    useEffect(() => {
        if (message) {
            setOpen(true);
        }
    }, [message]);

    const {httpClient, restaurants, setRestaurants, fetchRestaurantsOwned} = AuthUser();

    useEffect(() => {
        fetchRestaurantsOwned();
        setRestaurants(restaurants);
    }, [restaurants]);

    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState({});

    const handleUpdate = (restaurantId) => {
        setSelectedRestaurantId(restaurantId);
        const restaurant = restaurants.find((restaurant) => restaurant.id === restaurantId);
        setSelectedRestaurant(restaurant);
        setUpdateModalOpen(true);
    };

    const handleArchive = (restaurantId) => {
        setSelectedRestaurantId(restaurantId);
        setConfirmationOpen(true);
    };

    const handleConfirm = () => {
        // Perform update or archive action based on the selectedRestaurantId
        // Call the API endpoint for update or archive here
        try{
            const  response = httpClient.delete(`/restaurants/archive/${selectedRestaurantId}`);
            if (response.status === 200) {
                handleClick(response.data.message);
            }
            fetchRestaurantsOwned();
        } catch (error) {
            handleClick(error.response.data.message, 'error');
        }
        // After completing the action, close the confirmation modal
        setConfirmationOpen(false);
    };

    const handleCloseConfirmation = () => {
        setConfirmationOpen(false);
    };
    const [timeoutMessage, setTimeoutMessage] = useState(null);

    const [progress, setProgress] = React.useState(0);
    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    return 0;
                }
                const diff = Math.random() * 10;
                return Math.min(oldProgress + diff, 100);
            });
            setTimeoutMessage('No restaurants found.');
        }, 5000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div className='container mx-auto mt-8 mb-16'>
            <h2>Restaurant List</h2>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                style={{marginTop: 46}}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert onClose={handleClose} severity={severity} sx={{width: '100%'}}>
                    {message}
                </Alert>
            </Snackbar>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Address Line 1</TableCell>
                        <TableCell>City</TableCell>
                        <TableCell>State ID</TableCell>
                        <TableCell>Country ID</TableCell>
                        <TableCell>Update</TableCell>
                        <TableCell>Archive</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {restaurants && restaurants.length > 0 ? (
                        restaurants.map((restaurant) => (
                            <TableRow key={restaurant.id}>
                                <TableCell>{restaurant.name}</TableCell>
                                <TableCell>{restaurant.address.line_1}</TableCell>
                                <TableCell>{restaurant.address.city}</TableCell>
                                <TableCell>{restaurant.state.name}</TableCell>
                                <TableCell>{restaurant.country.name}</TableCell>
                                <TableCell><Button variant="outlined"
                                                   color="primary"
                                                   endIcon={<EditIcon/>}
                                                   onClick={() => handleUpdate(restaurant.id)}>Update</Button>
                                </TableCell>
                                <TableCell><Button
                                    variant="outlined"
                                    color="error"
                                    endIcon={<DeleteForeverIcon/>}
                                    onClick={() => handleArchive(restaurant.id)}>Archive</Button> </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                {timeoutMessage ? (
                                    <Typography variant="subtitle1" color="error">
                                        {timeoutMessage}
                                    </Typography>
                                ) : (
                                    <LinearProgress variant="indeterminate"/>
                                )}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <ConfirmationModal
                open={confirmationOpen}
                handleClose={handleCloseConfirmation}
                handleConfirm={handleConfirm}
            />
            {updateModalOpen && (
                <UpdateRestaurantModal
                    open={updateModalOpen}
                    handleClose={() => setUpdateModalOpen(false)}
                    handleUpdate={handleUpdate}
                    selectedRestaurant={{
                        id: selectedRestaurant.id,
                        name: selectedRestaurant.name,
                        user_id: selectedRestaurant.user_id,
                        address_line_1: selectedRestaurant.address.line_1,
                        address_line_2: selectedRestaurant.address.line_2,
                        pincode: selectedRestaurant.address.pincode,
                        city: selectedRestaurant.address.city,
                        state_id: selectedRestaurant.state.id,
                        country_id: selectedRestaurant.country.id,
                        image: selectedRestaurant.image,
                        ispromoting: selectedRestaurant.ispromoting,
                    }}
                />
            )}
        </div>
    );
};

export default RestaurantList;
