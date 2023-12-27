import React, { useEffect, useState } from 'react';
import AllRestaurant from '../restaurants/all-restaurants';
import AuthUser from "../../auth/AuthUser";
import FoodList from './FoodList';
import Banner from "./Banner";
import BannerList from "./BannerList"; // Import the FoodList component

function Home() {
    const [banners, setBanners] = useState([]);
    const { fetchRestaurants, httpClient, restaurants } = AuthUser();
    const [isLoading, setIsLoading] = useState(true);
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await httpClient.get('/all-restaurants');
                if (response.status === 200) {
                    setBanners(response.data.restaurants);
                }
                // Fetch menu items from the API
                const menuItemsResponse = await httpClient.get('http://localhost:8000/api/list-menu-items');
                if (menuItemsResponse.status === 200) {
                    setMenuItems(menuItemsResponse.data.menuItems);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='bg-white relative py-8 px-10'>
            <BannerList isLoading={isLoading} banners={banners} />
            <FoodList menuItems={menuItems} />

            <AllRestaurant isLoading={isLoading} />

        </div>
    );
}

export default Home;
