import React, {useEffect, useState} from 'react';
import {Button, Card, CardActions, CardContent, Grid, Paper, Skeleton, Typography} from '@mui/material';
import AuthUser from '../../auth/AuthUser';
import {useShoppingCart} from '../../hooks/ShoppingCartProvider';
import {useNavigate} from 'react-router-dom';
import {
    AddCircleOutline as AddCircleOutlineIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';


const OrderDetails = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {shoppingCart, fetchAllUserOrders} = useShoppingCart();
    const {httpClient} = AuthUser();

    useEffect(() => {
        fetchAllUserOrders();
    }, []);

    const handleClickedCompleted = async (restaurant_id, order) => {
        try {
            setLoading(true);
            const response = await httpClient.post(`/orders/complete/${order.id}`, {
                restaurant_id: restaurant_id,
                data: order,
            });
            if (response.status === 200) {
                setError(null);
                fetchAllUserOrders();
            }
        } catch (error) {
            setError('Error completing order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const navigate = useNavigate();

    const handleClickedAddOrderItems = (restaurant_id, order_id) => {
        console.log('restaurant_id', restaurant_id);
        navigate('/all-menus', {state: {restaurant_id: restaurant_id, order_id: order_id}});
    };

    return (
        <Paper elevation={0} style={{
            padding: 16,
            height: '100%',
            marginTop: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Typography variant="h4" gutterBottom style={{fontFamily: 'cursive', marginBottom: 20}}>
                <ShoppingCartIcon fontSize="large"/> Your Orders
            </Typography>
            <Grid container spacing={3} justifyContent="center" alignItems="stretch">
                {loading && <Skeleton variant="rectangular" height={300}/>}
                {!loading && error && <Typography style={{color: 'red'}}>{error}</Typography>}
                {!loading && !error && shoppingCart.map((order) => (
                    <Grid item key={order.id} xs={12} sm={6} md={4} lg={3}>
                        <Card elevation={3}
                              style={{display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%'}}>
                            <CardContent style={{flex: 1}}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Table #{order.table.id}
                                </Typography>
                                <Typography variant="h6" component="div" gutterBottom>
                                    Order #{order.id}
                                </Typography>
                                <Typography color="text.secondary" paragraph>
                                    Items: {order.items.length}
                                </Typography>
                                <Typography variant="body2" style={{fontStyle: 'italic'}}>
                                    Total: {order.total} $
                                </Typography>
                                <Typography
                                    variant="body2"
                                    style={{
                                        fontStyle: 'italic',
                                        color: order.status !== 'Completed' ? '#FB923C' : 'green'
                                    }}
                                >
                                    Status: {order.status}
                                </Typography>
                                <Typography variant="body2" style={{fontStyle: 'italic'}}>
                                    Special Instructions: {order.extra_details}
                                </Typography>
                            </CardContent>
                            <CardActions style={{justifyContent: 'center', borderTop: '1px solid #ccc', width: '100%'}}>
                                <Button
                                    size="small"
                                    onClick={() => handleClickedCompleted(order.table.restaurant.id, order)}
                                    startIcon={<CheckCircleOutlineIcon/>}
                                >
                                    Complete
                                </Button>
                                <Button
                                    size="small"
                                    onClick={() => handleClickedAddOrderItems(order.table.restaurant.id, order.id)}
                                    startIcon={<AddCircleOutlineIcon/>}
                                >
                                    Add Items
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};

export default OrderDetails;
