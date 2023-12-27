import axios from 'axios';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Error from "../Components/layouts/Error";

export default function AuthUser(){
    const navigate = useNavigate();

    const getToken = () =>{
        const tokenString = sessionStorage.getItem('token');
        return JSON.parse(tokenString);
    }

    const getUser = () =>{
        const userString = sessionStorage.getItem('user');
        return JSON.parse(userString);
    }


    const [token,setToken] = useState(getToken());
    const [user,setUser] = useState(getUser());
    const [restaurants ,setRestaurants] = useState([]);

    const saveToken = (user,token) =>{
        sessionStorage.setItem('token',JSON.stringify(token));
        sessionStorage.setItem('user',JSON.stringify(user));

        setToken(token);
        setUser(user);
        navigate('/dashboard');
    }


    const logout = () => {
        sessionStorage.clear();
        navigate('/login');
    }

    const httpClient = axios.create({
        baseURL:"http://localhost:8000/api",
        headers:{
            "Content-type" : "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });

    const fetchRestaurants = async () => {
        try {
            const response = await httpClient.get('/all-restaurants')
            if (response.status === 200) {
                setRestaurants(response.data.restaurants);
            }
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        }
    };


    const fetchRestaurantsOwned = async () => {
        try {
            const response = await httpClient.get('/restaurants/list')
            if (response.status === 200) {
                setRestaurants(response.data.restaurants);
            }
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        }
    };

    httpClient.interceptors.response.use(
        response => response,
        error => {
            if (  error.response.status === 401) {
               navigate('/login');
                logout();
            }else if(error.response.status === 404){
                navigate('/error');
                return <Error />
            }
            return Promise.reject(error);
        }
    );
    return {
        setToken:saveToken,
        token,
        user,
        getToken,
        httpClient,
        logout,
        restaurants,
        fetchRestaurants,
        setRestaurants,
        setUser,
        fetchRestaurantsOwned
    }
}