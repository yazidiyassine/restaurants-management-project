import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import { FormControl, FormLabel, Radio, RadioGroup, Snackbar } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import MuiAlert from "@mui/material/Alert";
import AuthUser from "../../auth/AuthUser";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Profile = () => {
    const { user } = AuthUser();

    const [updatedData, setUpdatedData] = useState({
        id: user.id,
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.role,
    });

    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');

    const handleClick = (message, severity = 'success') => {
        setMessage(message);
        setSeverity(severity);
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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUpdatedData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const { httpClient } = AuthUser();
    const handleUpdateClick = async () => {
        if (updatedData.password !== updatedData.password_confirmation) {
            handleClick("Passwords do not match", 'error');
            return;
        }

        try {
            const { password_confirmation, ...dataToSend } = updatedData;
            const response = await httpClient.post(`/update/${updatedData.id}`, dataToSend);
            if (response.status === 200) {
                handleClick(response.data.message);
            }
        } catch (error) {
            handleClick(error.response.data.message, 'error');
        }
    };

    return (
        <>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                style={{ marginTop: 46 }}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
            <div className='container mx-auto mt-8 mb-16'>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 600,
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
                                    label="New Email"
                                    name="email"
                                    value={updatedData.email || ''}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="New Password"
                                    name="password"
                                    type="password"
                                    value={updatedData.password || ''}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Confirm New Password"
                                    name="password_confirmation"
                                    type="password"
                                    value={updatedData.password_confirmation || ''}
                                    onChange={handleChange}
                                />
                            </Grid>
                            {updatedData.role !== 'admin' && (
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="role-label">Role</InputLabel>
                                        <Select
                                            labelId="role-label"
                                            id="role"
                                            name="role"
                                            value={updatedData.role}
                                            onChange={handleChange}
                                            label="Role"
                                        >
                                            <MenuItem value="customer">Customer</MenuItem>
                                            <MenuItem value="restaurant_manager">Restaurant Manager</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}

                            <Grid item xs={12} md={6} sx={{ marginX: 25, textAlign: 'center' }}>
                                <Button
                                    onClick={handleUpdateClick}
                                    variant="contained"
                                    color="primary"
                                    style={{ marginTop: 16 }}
                                    endIcon={<EditIcon />}
                                >
                                    Update
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </div>
        </>
    );
};

export default Profile;
