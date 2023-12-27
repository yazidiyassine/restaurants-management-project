import React, {useEffect, useState} from 'react';
import {LinearProgress, Paper, Snackbar, Table, TableBody, TableCell, TableHead, TableRow} from '@mui/material';
import AuthUser from "../../auth/AuthUser";
import Button from "@mui/material/Button";

import UpdateRestaurantModal from "./UpdateUserModel";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MuiAlert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import ConfirmationModal from "../restaurants/ConfirmationModel";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AllUsers = () => {

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

    const [users, setUsers] = useState([]);

    const {httpClient} = AuthUser();

    const fetchUsers = async () => {
        try {
            const response = await httpClient.get('/users/all');
            if (response.status === 200) {
                setUsers(response.data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }
    useEffect(() => {
        fetchUsers();
    }, [users]);

    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState({});

    const handleUpdate = (userId) => {
        setSelectedUserId(userId);
        const user = users.find((user) => user.id === userId);
        setSelectedUser(user);
        setUpdateModalOpen(true);
    };



    const handleArchive = (restaurantId) => {
        setSelectedUserId(restaurantId);
        setConfirmationOpen(true);
    };

    const handleConfirm = () => {
        // Perform update or archive action based on the selectedRestaurantId
        // Call the API endpoint for update or archive here
        try {
            const response = httpClient.delete(`/users/archive/${selectedUserId}`);
            if (response.status === 200) {
                handleClick(response.data.message);
            }
            fetchUsers();
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
            setTimeoutMessage('No users found.');
        }, 5000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div className='container mx-auto mt-8 mb-16'>
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
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Update</TableCell>
                        <TableCell>Archive</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users && users.length > 0 ? (
                        users.map((user) => (
                            /* user.role !== 'admin' && (*/
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell><Button variant="outlined"
                                                   color="primary"
                                                   endIcon={<EditIcon/>}
                                                   onClick={() => handleUpdate(user.id)}>Update</Button> </TableCell>
                                <TableCell><Button
                                    variant="outlined"
                                    color="error"
                                    disabled={user.role === 'admin'}
                                    endIcon={<DeleteForeverIcon/>}
                                    onClick={() => handleArchive(user.id)}>Delete</Button> </TableCell>
                            </TableRow>
                            /*)*/
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
                    selectedUser={selectedUser}
                />
            )}
        </div>
    );
};

export default AllUsers;
