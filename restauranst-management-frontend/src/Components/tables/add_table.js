import React, {useEffect, useState} from 'react';
import {Button, Container, Grid, InputLabel, Paper, Snackbar, TextField, Typography} from '@mui/material';
import AuthUser from "../../auth/AuthUser";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const AddTableForm = () => {
    const [tableData, setTableData] = useState({
        restaurant_id:'',
        number: '',
        extra_details: '',

    });

    const { httpClient, restaurants, setRestaurants, fetchRestaurantsOwned } = AuthUser();

    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success'); // 'success', 'error', 'info', 'warning' [default: 'info'
    const handleClick = (message, severity = 'success') => {
        setMessage(message);
        setSeverity(severity)
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const resetForm = () => {
        setTableData({
            restaurant_id:'',
            number: '',
            extra_details: '',
        });
    }
    useEffect(() => {
        if (message) {
            setOpen(true);
            // Reset the form after a delay (e.g., 2000 milliseconds)
            setTimeout(() => {
                resetForm();
            }, 2000);
        }
    }, [message]);


    const handleChange = (event) => {
        const { name, value } = event.target;
        setTableData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    useEffect(() => {
        fetchRestaurantsOwned();
        setRestaurants(restaurants);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await httpClient('tables/add', {
                method: 'POST',
                data: tableData,
            });
            if (response.status === 200) {
                handleClick(response.data.message);
            }
        } catch (error) {
            handleClick(error.response.data.message, 'error');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} style={{ padding: 16, display: 'flex',  marginTop: 18, flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h5" gutterBottom>
                    Add Table
                </Typography>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}
                          style={{marginTop:46}}  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                        {message}
                    </Alert>
                </Snackbar>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Table Number"
                                name="number"
                                value={tableData.number}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Extra Details"
                                name="extra_details"
                                value={tableData.extra_details}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel id="demo-simple-select-label">Restaurant</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={tableData.restaurant_id}
                                fullWidth
                                label="Restaurant"
                                onChange={handleChange}
                                name="restaurant_id" // Add this line
                            >
                                {restaurants.map((restaurant) => (
                                    <MenuItem key={restaurant.id} value={restaurant.id}>
                                        {restaurant.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                    <Button type="submit" variant="contained" color="primary" style={{ marginTop: 16 }}>
                        Add Table
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default AddTableForm;
