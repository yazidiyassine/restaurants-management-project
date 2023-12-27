import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import {FormControl, FormLabel, Radio, RadioGroup, Snackbar} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import MuiAlert from "@mui/material/Alert";
import AuthUser from "../../auth/AuthUser";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const UpdateRestaurantModal = ({ open, handleClose, handleUpdate, selectedRestaurant }) => {
    const [updatedData, setUpdatedData] = useState({});

    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success'); // 'success', 'error', 'info', 'warning' [default: 'info'
    const handleClick = (message, severity = 'success') => {
        setMessage(message);
        setSeverity(severity)
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };


    useEffect(() => {
        if (message) {
            setOpenSnackbar(true);
            setTimeout(() => {
                setOpenSnackbar(false);
            }, 500);
        }
    }, [message]);

    useEffect(() => {
        // Set the initial data when the modal opens
        if (open) {
            setUpdatedData({
                id: selectedRestaurant.id,
                name: selectedRestaurant.name,
                user_id: selectedRestaurant.user_id,
                address_line_1: selectedRestaurant.address_line_1,
                address_line_2: selectedRestaurant.address_line_2,
                pincode: selectedRestaurant.pincode,
                city: selectedRestaurant.city,
                state_id: selectedRestaurant.state_id,
                country_id: selectedRestaurant.country_id,
                image: selectedRestaurant.image,
                ispromoting: selectedRestaurant.ispromoting,
            });
        }
    }, [open]); // Only run when `open` changes

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUpdatedData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const {httpClient} = AuthUser();
    const handleUpdateClick = async () => {
        try {
            const formData = new FormData();

            // Append all other form data
            Object.entries(updatedData).forEach(([key, value]) => {
                if (key !== 'image') {
                    formData.append(key, value);
                }
            });

            // Append image data
            if (updatedData.image) {
                formData.append('image', updatedData.image);
            }

            const response = await httpClient(`/restaurants/update/${updatedData.id}`,{
                data: formData,
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data', // Set content type for FormData
                },
            });
            if (response.status === 200) {
                handleClick(response.data.message);
                handleClose();
            }
        } catch (error) {
            handleClick(error.response.data.message, 'error');
        }
    };



    return (
        <>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}
                      style={{marginTop:46}}  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        <Modal open={open} onClose={handleClose}>

            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600, // Increased width for two columns
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" component="div" gutterBottom>
                    Update Restaurant
                </Typography>
                <form>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={updatedData.name || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                fullWidth
                                label="Address Line 1"
                                name="address_line_1"
                                value={updatedData.address_line_1 || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                fullWidth
                                label="Address Line 2"
                                name="address_line_2"
                                value={updatedData.address_line_2 || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                fullWidth
                                label="Pincode"
                                name="pincode"
                                value={updatedData.pincode || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                fullWidth
                                label="City"
                                name="city"
                                value={updatedData.city || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                fullWidth
                                label="State ID"
                                name="state_id"
                                value={updatedData.state_id || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                fullWidth
                                label="Country ID"
                                name="country_id"
                                value={updatedData.country_id || ''}
                                onChange={handleChange}
                            />
                        </Grid> <Grid item xs={12} md={6}>
                        <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label">Promoting: </FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="ispromoting"
                                onChange={handleChange}
                                value={updatedData.ispromoting}
                            >
                                <FormControlLabel value={true} control={<Radio />} label="True" />
                                <FormControlLabel value={false} control={<Radio />} label="False" />
                            </RadioGroup>
                        </FormControl></Grid>
                    <Grid item xs={12} md={6}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                            setUpdatedData((prevData) => ({
                                ...prevData,
                                image: event.target.files[0],
                            }));
                        }}
                        style={{ display: 'none' }} // hide the default input style
                        id="imageInput"
                    />
                    <label htmlFor="imageInput">
                        <Button
                            variant="outlined"
                            endIcon={<CloudUploadIcon />}
                            component="span"
                            style={{ marginTop: 16 }}
                        >
                            Upload Image
                        </Button>
                    </label>
                    </Grid>
                        <input type={'hidden'} name={'user_id'} onChange={handleChange} value={updatedData.user_id}/>
                        <Grid item xs={12} md={6} sx={{ marginX: 25 ,textAlign: 'center' }}>
                    <Button
                        onClick={handleUpdateClick}
                        variant="contained"
                        color="primary"
                        style={{ marginTop: 16, }}
                        endIcon={<EditIcon />}
                    >
                        Update
                    </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
        </>
    );
};

export default UpdateRestaurantModal;
