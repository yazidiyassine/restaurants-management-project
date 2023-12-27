import React, { useEffect, useState } from 'react';
import { Button, Container, Paper, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import AuthUser from '../../auth/AuthUser';
import {Link, Navigate, useLocation} from 'react-router-dom';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { AddCircleOutline as AddCircleOutlineIcon, ShoppingCart as ShoppingCartIcon, Restaurant as RestaurantIcon, List as ListIcon } from '@mui/icons-material';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const OrderItemsAdd = ({ onOrderAdded }) => {
    const [orderItemsData, setOrderItemsData] = useState({
        restaurant_id: '',
        order_id: '',
        selectedItems: [],
    });

    const location = useLocation();

    useEffect(() => {
        const { restaurant_id, order_id, selectedItems } = location.state || {};
        setOrderItemsData({
            restaurant_id: restaurant_id || '',
            order_id: order_id || '',
            selectedItems: selectedItems || [],
        });
    }, [location.state]);

    const { httpClient } = AuthUser();
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Extract item ids and quantities from selectedItems
            const itemsWithQuantity = orderItemsData.selectedItems.map(item => ({
                id: item.id,
                quantity: item.quantity || 1, // Use 1 as the default quantity if not specified
            }));

            const response = await httpClient.post(`/order-items/add/${orderItemsData.order_id}`, {
                restaurant_id: orderItemsData.restaurant_id,
                menu_items: itemsWithQuantity,
                method: 'POST',
            });

            if (response.status === 200) {
                handleClick(response.data.message);
                // Optionally, you can trigger a callback if needed
                if (onOrderAdded) {
                    onOrderAdded();
                }
            }
        } catch (error) {
            handleClick('Please, try again later!', 'error');
            console.error(error);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={2} style={{ padding: 16, display: 'flex', marginTop: 55, flexDirection: 'column', alignItems: 'center' }}>
                <form onSubmit={handleSubmit}>
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} style={{ marginTop: 46 }}
                              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                            {message}
                        </Alert>
                    </Snackbar>

                    {location.state && location.state.order_id ? (
                        <Grid item key={location.state.order_id} xs={12} sm={6} md={4} lg={3}>
                            <CardContent>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    <ShoppingCartIcon /> Order Item
                                </Typography>
                                <Typography variant="h5" component="div">
                                    <ListIcon /> Order ID: {location.state.order_id}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    <RestaurantIcon /> Restaurant ID: {location.state.restaurant_id}
                                </Typography>
                                <Typography variant="body2">
                                    Selected Items: {location.state.selectedItems.map(item => item.name).join(', ')}
                                </Typography>
                            </CardContent>
                        </Grid>
                    ) : (
                        <Navigate to={'/order-details'} />
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ marginTop: 16 }}
                        startIcon={<AddCircleOutlineIcon />}
                    >
                        Add Order
                    </Button>
                </form>
                <Link to={'/order-details'} color={'inherit'} style={{ marginTop: 16 }}>
                    Your Shopping Cart!
                </Link>
            </Paper>
        </Container>
    );
};

export default OrderItemsAdd;
