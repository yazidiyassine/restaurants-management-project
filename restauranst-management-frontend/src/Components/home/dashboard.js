import React, {useEffect} from 'react';
import {Card, Tab, Tabs, Typography} from '@mui/material';
import AuthUser from "../../auth/AuthUser";
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import StorefrontIcon from '@mui/icons-material/Storefront';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';

const Dashboard = () => {
    const { user } = AuthUser();
    const [value, setValue] = React.useState(user.role === 'admin' ? 0 : 1);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <Typography variant="h5" component="h1" gutterBottom paddingY={3} align="center">
                Welcome <strong> {user.name}</strong> to Your Dashboard
            </Typography>
            <Tabs value={value} onChange={handleChange} aria-label="icon label tabs example"
                  centered
                  sx={{
                      "& .MuiTabs-indicator": {
                          backgroundColor: "#FB923C",
                      },
                  }}>
                {user.role === 'admin' && (
                    <Tab icon={<GroupAddIcon/>} label="USERS"/>
                )}
                <Tab icon={<QueryStatsIcon/>} label="ANALYTICS"/>
                <Tab icon={<StorefrontIcon/>} label="RESTAURANTS"/>
                <Tab icon={<TableRestaurantIcon/>} label="TABLES"/>
                <Tab icon={<MenuBookIcon/>} label="MENUS"/>
            </Tabs>
            <Grid container spacing={3} alignContent={"center"} justifyContent="center">
                {value === 0 && user.role === 'admin' && (
                    <Grid item xs={6} md={6} lg={4}>
                        <Card sx={{
                            marginTop: 5,
                            border: '1px solid #FB923C'
                        }}>
                            <CardContent>
                                <Typography variant="h5" component="div" gutterBottom>
                                    Users
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Manage your user base efficiently.
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <Link to="/all-users" style={{textDecoration: 'none'}}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<AddIcon/>}
                                        >
                                            Go to All Users
                                        </Button>
                                    </Link>
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {value === (user.role === 'admin' ? 1 : 0) &&  (
                    <Grid item xs={12} md={6} lg={4}>
                        {/* Analytics Card */}
                        <Card sx={{
                            marginTop: 5,
                            border: '1px solid #FB923C'
                        }}>
                            <CardContent>
                                <Typography variant="h5" component="div" gutterBottom>
                                    Analytics
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    View and analyze your data to gain insights.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {value === (user.role === 'admin' ? 2 : 1) && (
                    <>
                        {/* Add Restaurant Cards */}
                        <Grid item xs={12} md={6} lg={4}>
                            {/* Add Restaurant Card */}
                            <Card sx={{
                                marginTop: 5,
                                border: '1px solid #FB923C'
                            }}>
                                <CardContent>
                                    <Typography variant="h5" component="div" gutterBottom>
                                        Add Restaurant
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <Link to="/add-restaurant" style={{textDecoration: 'none'}}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<AddIcon/>}
                                            >
                                                Go to Add Restaurant
                                            </Button>
                                        </Link>
                                    </Typography>
                                </CardContent>
                            </Card>

                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            {/* List Restaurants Card */}
                            <Card sx={{
                                marginTop: 5,
                                border: '1px solid #FB923C'
                            }}>
                                <CardContent>
                                    <Typography variant="h5" component="div" gutterBottom>
                                        List Restaurants
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <Link to="/list-restaurants" style={{textDecoration: 'none'}}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<ReplyAllIcon/>}
                                            >
                                                Go to List Restaurants
                                            </Button>
                                        </Link>
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </>
                )}

                {value === (user.role === 'admin' ? 3 : 2) && (
                    <>
                        <Grid item xs={12} md={6} lg={4}>
                            {/* Table Management Card */}
                            <Card sx={{
                                marginTop: 5,
                                border: '1px solid #FB923C'
                            }}>
                                <CardContent>
                                    <Typography variant="h5" component="div" gutterBottom>
                                        Add Table
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <Link to="/add-table" style={{textDecoration: 'none'}}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<AddIcon/>}
                                            >
                                                Go to Add Table
                                            </Button>
                                        </Link>
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <Card sx={{
                                marginTop: 5,
                                border: '1px solid #FB923C'
                            }}>
                                <CardContent>
                                    <Typography variant="h5" component="div" gutterBottom>
                                        All Tables
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <Link to="/all-tables" style={{textDecoration: 'none'}}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<AddIcon/>}
                                            >
                                                Go to All Tables
                                            </Button>
                                        </Link>
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </>
                )}

                {value === (user.role === 'admin' ? 4 : 3) && (
                    <>
                <Grid item xs={12} md={6} lg={4}>
                    {/* Menu Management Card */}
                    <Card sx={{
                        marginTop: 5,
                        border: '1px solid #FB923C'
                    }}>
                        <CardContent>
                            <Typography variant="h5" component="div" gutterBottom>
                                Add Menu
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <Link to="/add-menu" style={{textDecoration: 'none'}}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddIcon/>}
                                    >
                                        Go to Add Menu
                                    </Button>
                                </Link>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <Card sx={{
                        marginTop: 5,
                        border: '1px solid #FB923C'
                    }}>
                        <CardContent>
                            <Typography variant="h5" component="div" gutterBottom>
                                All Menus
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <Link to="/all-menus" style={{textDecoration: 'none'}}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddIcon/>}
                                    >
                                        Go to All Menus
                                    </Button>
                                </Link>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                    </>
                )}
            </Grid>
        </div>
    );
}

export default Dashboard;