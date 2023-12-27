import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const ConfirmationModal = ({ open, handleClose, handleConfirm }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
                <p>Are you sure you want to proceed?</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleConfirm} color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationModal;
