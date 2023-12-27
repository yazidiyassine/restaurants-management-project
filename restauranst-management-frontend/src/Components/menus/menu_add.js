import React, { useEffect, useState } from 'react';
import {
    Button,
    Container,
    Grid,
    InputLabel,
    Paper,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import MuiAlert from '@mui/material/Alert';
import AuthUser from '../../auth/AuthUser';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AddMenuForm = () => {
    const [menuData, setMenuData] = useState({
        name: '',
        description: '',
        restaurant_id: '',
        price: '',
        image: null,
    });

    const { httpClient, restaurants, setRestaurants, fetchRestaurantsOwned } =
        AuthUser();

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
        setMenuData({
            name: '',
            description: '',
            restaurant_id: '',
            price: '',
            image: null,
        });
    };

    useEffect(() => {
        fetchRestaurantsOwned();
        setRestaurants(restaurants);
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setMenuData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (event) => {
        setMenuData((prevData) => ({
            ...prevData,
            image: event.target.files[0],
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', menuData.name);
            formData.append('description', menuData.description);
            formData.append('restaurant_id', menuData.restaurant_id);
            formData.append('price', menuData.price);
            formData.append('image', menuData.image);

            const response = await httpClient('/menu_items/add', {
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                const successMessage = response.data.message;
                handleClick(successMessage);
            }
        } catch (error) {
            handleClick(error.response.data.message, 'error');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper
                elevation={3}
                style={{
                    padding: 16,
                    marginTop: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Add Menu
                </Typography>
                <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    style={{ marginTop: 46 }}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
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
                                label="Menu Name"
                                name="name"
                                value={menuData.name}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Description"
                                name="description"
                                value={menuData.description}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel id="demo-simple-select-label" htmlFor="demo-simple-select">
                                Owned Restaurants
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={menuData.restaurant_id}
                                fullWidth
                                label="Restaurant"
                                onChange={handleChange}
                                name="restaurant_id"
                            >
                                {restaurants.map((restaurant) => (
                                    <MenuItem key={restaurant.id} value={restaurant.id}>
                                        {restaurant.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Price"
                                name="price"
                                value={menuData.price}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }} // hide the default input style
                                id="imageInput"
                            />
                            <label htmlFor="imageInput">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    component="span"
                                    style={{ marginTop: 16 }}
                                >
                                    Upload Image
                                </Button>
                            </label>
                        </Grid>
                    </Grid>
                    <Button type="submit" variant="contained" color="primary" style={{ marginTop: 16 }}>
                        Add Menu
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default AddMenuForm;