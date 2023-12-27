import * as React from 'react';
import {useEffect} from 'react';
import AuthUser from "../../auth/AuthUser";
import {Link, useNavigate} from "react-router-dom";
import Logo from "./Logo";
import PopupState, {bindMenu, bindTrigger} from 'material-ui-popup-state';
import {HomeIcon, MagnifyingGlassIcon, ShoppingBagIcon} from "@heroicons/react/16/solid";
import {Menu} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {useShoppingCart} from "../../hooks/ShoppingCartProvider";

function ResponsiveAppBar() {
    const settings = {'Profile': "/profile", 'Dashboard': "/dashboard", 'Logout': "/logout"};
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const {user, setUser} = AuthUser();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const {logout, token, getToken} = AuthUser();
    const isAuthenticated = getToken();

    const logoutUser = () => {
        if (token !== undefined) {
            logout();
        }
    }

    const { shoppingCart, setShoppingCart, fetchAllUserOrders } = useShoppingCart();

    useEffect(() => {
        if (isAuthenticated) {
            const fetchData = async () => {
                await fetchAllUserOrders();
            };
            fetchData();
            setShoppingCart(shoppingCart);
        }
    }, []);




    const handleLogout = () => {
        logoutUser();
        handleCloseUserMenu();
    };
    const navigate = useNavigate();


    return (
        <header
            className='sticky w-full top-0 bg-white z-20 py-3 border-b shadow-sm border-gray-100  mx-auto px-10 p-4'>
            <div className='container-max flex justify-between items-center'>
                <div className='flex items-center gap-2 md:gap-4'>
                    <Logo/>
                </div>

                <ul className='text-zinc-700 ml-auto gap-2 md:gap-4 items-center hidden md:flex'>
                    <li>
                        <Link
                            to='/all-restaurants'
                            className='p-2 md:px-4 hover:bg-gray-50 rounded-md flex items-center gap-2'
                        >
                            <MagnifyingGlassIcon className='w-4 h-4 text-gray-700'/>{' '}
                            <p className='hidden md:block'>Search</p>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to='/'
                            className='p-2 md:px-4 hover:bg-gray-50 rounded-md flex items-center gap-2'
                        >
                            <HomeIcon className='w-4 h-4 text-gray-700'/>{' '}
                            <p className='hidden md:block'>Home</p>
                        </Link>
                    </li>

                    <li>
                        <Link
                            to='/order-details'
                            className='p-2 relative md:px-4 hover:bg-gray-50 rounded-md flex items-center gap-2'
                        >
                            <ShoppingBagIcon className='w-4 h-4 text-gray-700'/>{' '}
                            {isAuthenticated ? (
                                <>
                            <p className='hidden md:block'>Cart</p>
                            {
                                <p className='absolute -top-1 -right-1 bg-orange-500 text-white flex justify-center items-center w-5 h-5 text-xs rounded-full'>
                                    {shoppingCart.length}
                                </p>
                            }</>) : (
                                <p className='hidden md:block'>Cart</p>
                            )}
                        </Link>
                    </li>
                </ul>
                {isAuthenticated ? (
                    <>
                        <PopupState variant="popover"
                                    popupId="demo-popup-menu" disableAutoFocus={true}>
                            {(popupState) => (
                                <React.Fragment>
                                    <Button
                                        style={{
                                            marginLeft: '26px',
                                            backgroundColor: '#FB923C',  // Orange color
                                            color: '#FFFFFF',            // White color
                                            padding: '8px 16px',         // Adjust padding as needed
                                            borderRadius: '4px',         // Adjust border radius as needed
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',                // Hidden by default, make it visible in md viewport
                                        }}
                                        {...bindTrigger(popupState)}>
                                        Account
                                    </Button>
                                    <Menu {...bindMenu(popupState)}>
                                        {Object.entries(settings).map(([setting, route]) => (
                                            ((user?.role === 'admin' || user?.role === 'restaurant_manager') || setting !== 'Dashboard') && (
                                                <MenuItem key={setting}
                                                      onClick={setting === 'Logout' ? handleLogout : handleCloseUserMenu}>
                                                <Link to={route} style={{textDecoration: 'none', color: 'inherit'}}>
                                                    <Typography textAlign="center">{setting}</Typography>
                                                </Link>
                                            </MenuItem>
                                            )
                                        ))}
                                    </Menu>
                                </React.Fragment>
                            )}
                        </PopupState>
                    </>
                ) : (
                    <button
                        onClick={()=>{
                            navigate('/login');
                        }}
                        className='ml-4 bg-orange-400 text-white p-2 px-4 rounded-md items-center gap-2 hidden md:flex'
                    >
                        Login
                    </button>
                )}

            </div>
        </header>
    );
};


export default ResponsiveAppBar;
