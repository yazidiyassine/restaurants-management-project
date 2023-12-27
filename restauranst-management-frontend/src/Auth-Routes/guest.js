// Import the necessary modules
import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import SignUp from '../auth/SignUp';
import Login from '../auth/Login';
import Home from '../Components/home/home';
import AllRestaurant from "../Components/restaurants/all-restaurants";
import GetRestaurantInfo from "../Components/restaurants/GetRestaurantInfo";
import Error from "../Components/layouts/Error";

function Guest() {

    return (
        <Routes>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/" element={<Home/>}/>
            <Route path="/all-restaurants" element={<AllRestaurant />}/>
            <Route path={"/get-restaurant-info/:id"} element={<GetRestaurantInfo />}/>
            <Route path="*" element={<Navigate to="/login"/>}/>
            <Route path={"/error"} element={<Error />}/>
        </Routes>
    );
}

export default Guest;
