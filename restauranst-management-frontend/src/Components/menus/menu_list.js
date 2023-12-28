import React, { useEffect, useState } from 'react';
import {
    Grid,
    LinearProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import AuthUser from '../../auth/AuthUser';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props}  />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&::before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));
const MenuList = () => {
    const [menuListData, setMenuListData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);

    const { httpClient, restaurants, setRestaurants, fetchRestaurants } = AuthUser();
    const navigate = useNavigate();
    const { restaurant_id, order_id } = useLocation().state || {};

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            const response = await httpClient.get(`/menu_items/list?restaurant_id=${restaurant_id}`);
            if (response.status === 200) {
                setMenuListData(response.data.menuItems);
                setError(null);
            }
        } catch (error) {
            console.error('Error fetching menu items:', error);
            setError('Error fetching menu items. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClickedMenuItem = (menu) => {
        // Check if the item is already in the selected items
        const existingItemIndex = selectedItems.findIndex((item) => item.id === menu.id);

        if (existingItemIndex !== -1) {
            // If the item is already in the list, update its quantity
            const updatedItems = [...selectedItems];
            updatedItems[existingItemIndex] = {
                ...updatedItems[existingItemIndex],
                quantity: updatedItems[existingItemIndex].quantity + 1,
            };
            setSelectedItems(updatedItems);
        } else {
            // If the item is not in the list, add it with quantity 1
            setSelectedItems((prevItems) => [...prevItems, { ...menu, quantity: 1 }]);
        }
    };


    const handleRemoveSelectedItem = (index) => {
        // Remove the selected menu item from the local state
        const updatedItems = [...selectedItems];
        updatedItems.splice(index, 1);
        setSelectedItems(updatedItems);
    };

    const handleAddToOrder = () => {
        // Redirect to the /add-order-items page with the selected items
        navigate('/add-order-items', { state: { restaurant_id, order_id, selectedItems } });
    };

    useEffect(() => {
        fetchRestaurants();
        setRestaurants(restaurants);
    }, []);

    useEffect(() => {
        if (restaurant_id) {
            fetchMenuItems();
            handleOpen();
        } else {
            // If restaurant_id is null, navigate back to the order page
            navigate('/order-details');
        }
    }, [restaurant_id]);

    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };
    return (
        <Paper elevation={0} style={{ padding: 16, height: '100%', marginTop: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" component="h1" gutterBottom paddingY={3} align="center">
                All Menus <span style={{ color: 'red' }}>for</span> Restaurant #{restaurant_id}
            </Typography>
            {loading && <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={open}
                onClick={handleClose}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>}
            {!loading && error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && (
                menuListData.map((menu) => (
                    <Accordion key={menu.id}>
                        <AccordionSummary>
                            <Typography>{menu.name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <CardContent>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    Menu Item
                                </Typography>
                                <Typography variant="h5" component="div">
                                    {menu.name}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    Price: {menu.price} $
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    {menu.description}
                                </Typography>
                                <Typography variant="body2">{menu.extra_details}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    onClick={() => handleClickedMenuItem(menu)}
                                >
                                    Add to shopping Cart
                                </Button>
                            </CardActions>
                        </AccordionDetails>
                    </Accordion>
                ))
            )}
                {/* Display selected items */}
                {selectedItems.length > 0 && (
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} style={{ padding: 16, height: '100%', display: 'flex', marginTop: 51, flexDirection: 'column', alignItems: 'center' }}>
                            <h3>Selected Items</h3>
                            <TableContainer style={{ maxHeight: 200 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Item Name</TableCell>
                                            <TableCell align="right">Price</TableCell>
                                            <TableCell align="right">Quantity</TableCell>
                                            <TableCell align="right">Remove</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedItems.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell align="right">{item.price} $</TableCell>
                                                <TableCell align="right">{item.quantity}</TableCell>
                                                <TableCell align="right">
                                                    <Button size="small" onClick={() => handleRemoveSelectedItem(index)}>
                                                        Remove
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Button variant="contained" color="primary" onClick={handleAddToOrder} style={{ marginTop: 16 }}>
                                Add to Order
                            </Button>
                        </Paper>
                    </Grid>
                )}
        </Paper>
    );
};

export default MenuList;
