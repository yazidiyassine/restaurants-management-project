import React, {useEffect, useState} from 'react';
import {
    Button,
    Container,
    FormControl, FormLabel,
    Grid,
    Paper,
    Radio,
    RadioGroup,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import AuthUser from "../../auth/AuthUser";
import MuiAlert from "@mui/material/Alert";
import FormControlLabel from "@mui/material/FormControlLabel";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const AddRestaurantForm = () => {
    const { user, httpClient } = AuthUser();
    const [restaurantData, setRestaurantData] = useState({
        user_id: user?.id,
        name: '',
        address_line_1: '',
        address_line_2: '',
        pincode: '',
        ispromoting: "false",
        city: '',
        state_id: 1,
        country_id: 1,
        image: null,
    });

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
        setRestaurantData({
            user_id: user?.id,
            name: '',
            address_line_1: '',
            address_line_2: '',
            pincode: '',
            ispromoting: "false",
            city: '',
            state_id: 1,
            country_id: 1,
            image: null,
        });
    }
    useEffect(() => {
        if (message) {
            setOpen(true);
            setTimeout(() => {
                resetForm();
            }, 3000);
        }
    }, [message]);


    const handleChange = (event) => {
        const { name, value } = event.target;
        setRestaurantData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();

            // Append all other form data
            Object.entries(restaurantData).forEach(([key, value]) => {
                formData.append(key, value);
            });

            // Append image data
            formData.append('image', restaurantData.image);

            const response = await httpClient('restaurants/add', {
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data', // Set content type for FormData
                },
            });

            if (response.status === 200) {
                handleClick(response.data.message);
            }
        } catch (error) {
            handleClick(error.response.data.message, 'error');
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setRestaurantData((prevData) => ({
            ...prevData,
            image: file,
        }));
    };

    return (
        <Container component="main" maxWidth="xs" style={{marginTop: 15}}>
            <Paper elevation={3} style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h5" gutterBottom>
                    Add Restaurant
                </Typography>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}
                          style={{marginTop:46}}  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                        {message}
                    </Alert>
                </Snackbar>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                fullWidth
                                label="Restaurant Name"
                                name="name"
                                value={restaurantData.name}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                fullWidth
                                label="Address Line 1"
                                name="address_line_1"
                                value={restaurantData.address_line_1}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                fullWidth
                                label="Address Line 2"
                                name="address_line_2"
                                value={restaurantData.address_line_2}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Pincode"
                                name="pincode"
                                value={restaurantData.pincode}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="City"
                                name="city"
                                value={restaurantData.city}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl>
                                <FormLabel id="demo-radio-buttons-group-label">Promoting: </FormLabel>
                            <RadioGroup
                                row aria
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="ispromoting"
                                value={restaurantData.ispromoting}
                                onChange={handleChange}

                            >
                                <FormControlLabel value="true" control={<Radio/>} label="True"/>
                                <FormControlLabel value="false" control={<Radio/>} label="False"/>
                            </RadioGroup>
                            </FormControl></Grid>

                        <Grid item xs={12} md={6}>
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
                        Add Restaurant
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default AddRestaurantForm;
