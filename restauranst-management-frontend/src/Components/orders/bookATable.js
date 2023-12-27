import React, {useEffect, useState} from 'react';
import {Button, Container, Paper, Snackbar} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import AuthUser from '../../auth/AuthUser';
import {Navigate, useLocation} from 'react-router-dom';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import {AddCircleOutline as AddCircleOutlineIcon} from '@mui/icons-material';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const BookATable = ({onOrderAdded}) => {
    const [orderData, setOrderData] = useState({
        restaurant_id: '',
        table_id: '',
    });

    const location = useLocation();

    useEffect(() => {
        const {restaurant_id, table} = location.state || {};
        setOrderData({
            restaurant_id: restaurant_id || '',
            table_id: table ? table.id || '' : '',
        });
    }, [location.state]);

    const {httpClient} = AuthUser();
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
            setTimeout(() => {
                resetForm();
            }, 2000);
        }
    }, [message]);

    const resetForm = () => {
        setOrderData({
            restaurant_id: '',
            table_id: '',
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await httpClient.post(`/orders/book-a-table/${orderData.table_id}`, {
                restaurant_id: orderData.restaurant_id,
                method: 'POST',
            });
            if (response.status === 200) {
                handleClick(response.data.message);
            }
        } catch (error) {
            handleClick('Please, try again later!', 'error');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} style={{ padding: 16, display: 'flex', marginTop: 55, flexDirection: 'column', alignItems: 'center' }}>
                <form onSubmit={handleSubmit}>
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} style={{marginTop: 46}}
                              anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                        <Alert onClose={handleClose} severity={severity} sx={{width: '100%'}}>
                            {message}
                        </Alert>
                    </Snackbar>

                    {(location.state && location.state.table) ?  (
                        <Grid item key={location.state.table.id} xs={12} sm={6} md={4} lg={3}>
                            <CardContent>
                                <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                                    Table
                                </Typography>
                                <Typography variant="h5" component="div">
                                   Table ID:  {location.state.table.id}
                                </Typography>
                                <Typography sx={{mb: 1.5}} color="text.secondary">
                                   Number of places: {location.state.table.number}
                                </Typography>
                                <Typography variant="body2">{location.state.table.extra_details}</Typography>
                            </CardContent>
                        </Grid>
                    ) : (
                        <Navigate to={'/all-tables'} />
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{marginTop: 16}}
                        startIcon={<AddCircleOutlineIcon/>}
                    >
                        Add Order
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default BookATable;
