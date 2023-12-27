// Import the necessary modules
import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import SignUp from '../auth/SignUp';
import Login from '../auth/Login';
import AddRestaurantForm from '../Components/restaurants/add_restaurant';
import AuthUser from '../auth/AuthUser';
import Dashboard from '../Components/home/dashboard';
import Home from "../Components/home/home";
import RestaurantList from "../Components/restaurants/restaurant_list";
import AllRestaurant from "../Components/restaurants/all-restaurants";
import AddMenuForm from "../Components/menus/menu_add";
import AddTableForm from "../Components/tables/add_table";
import TableList from "../Components/tables/table_list";
import BookATable from "../Components/orders/bookATable";
import {ShoppingCartProvider} from "../hooks/ShoppingCartProvider";
import OrderDetails from "../Components/orders/OrderDetails";
import MenuList from "../Components/menus/menu_list";
import AddOrderItems from "../Components/orders/AddOrderItems";
import GetRestaurantInfo from "../Components/restaurants/GetRestaurantInfo";
import Error from "../Components/layouts/Error";
import AllUsers from "../Components/users/AllUsers";
import Profile from "../Components/home/profile";

function Auth() {
    const {getToken, user} = AuthUser();

    const isAuthenticated = getToken();

    return (
            <ShoppingCartProvider>
            <Routes>
                <Route path="/signup" element={<SignUp/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route
                    path="/dashboard"
                    element={isAuthenticated && user.role !== "customer" ? <Dashboard/> : <Navigate to="/"/>}
                />
                <Route path="/add-restaurant"
                       element={isAuthenticated ? <AddRestaurantForm/> : <Navigate to='/login'/>}/>
                <Route path="/" element={<Home/>}/>

                <Route path="/list-restaurants" element={isAuthenticated ? <RestaurantList /> : <Navigate to='/login'/>}/>

                <Route path="/all-restaurants" element={<AllRestaurant/>}/>

                <Route path="/add-menu" element={isAuthenticated ?
                    <AddMenuForm /> : <Navigate to='/login'/>}/>

                <Route path="/add-table" element={isAuthenticated ?
                    <AddTableForm /> : <Navigate to='/login'/>}/>
                <Route path="/all-tables" element={isAuthenticated ?
                    <TableList/> : <Navigate to='/login'/>}/>
                <Route path={"/order"} element={isAuthenticated ? <BookATable /> : <Navigate to='/login'/>}/>
                <Route path={"/order-details"} element={isAuthenticated ? <OrderDetails /> : <Navigate to='/login'/>}/>
               <Route path={"/add-order-items"} element={isAuthenticated ? <AddOrderItems /> : <Navigate to='/login'/>}/><Route path={"/all-menus"} element={isAuthenticated ? <MenuList /> : <Navigate to='/login'/>}/>
                <Route path={"/get-restaurant-info/:id"} element={<GetRestaurantInfo />}/>
                <Route path="/all-tables/:id" element={isAuthenticated ?
                    <TableList/> : <Navigate to='/login'/>}/>
                <Route path={"/error"} element={<Error />}/>
                <Route path={"/all-users"} element={isAuthenticated && user.role === 'admin' ? <AllUsers/> :
                    <Navigate to='/login'/>}/>
                <Route path={"/all-menus"}
                       element={isAuthenticated ? <MenuList/> : <Navigate to='/login'/>}/>
                <Route path={"/profile"} element={isAuthenticated ? <Profile/> : <Navigate to='/login'/>}/>
                <Route
                    path={"/all-menus"} element={isAuthenticated ? <MenuList/> : <Navigate to='/login'/>}/>
            </Routes>
            </ShoppingCartProvider>
    );
}

export default Auth;
