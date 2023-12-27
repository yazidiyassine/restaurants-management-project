// ShoppingCartProvider.js
import React, { createContext, useContext, useState } from 'react';
import AuthUser from "../auth/AuthUser";

const ShoppingCartContext = createContext();

const ShoppingCartProvider = ({ children }) => {
    const [shoppingCart, setShoppingCart] = useState([]);

    const addToCart = (item) => {
        setShoppingCart((prevCart) => [...prevCart, item]);
    };

    const {httpClient} = AuthUser();

    const fetchAllUserOrders = async () => {
        try {
            const response = await httpClient.get('/all-user-orders');

            if (response.status === 200) {
                setShoppingCart(response.data.orders);
            }
        }catch (err){
            console.error('Error fetching all user orders:', err);
        }
    }

    const value = {
        shoppingCart,
        addToCart,
        // Add other functions related to the shopping cart
        fetchAllUserOrders,
        setShoppingCart
    };

    return (
        <ShoppingCartContext.Provider value={value}>
            {children}
        </ShoppingCartContext.Provider>
    );
};

const useShoppingCart = () => {
    const context = useContext(ShoppingCartContext);
    if (!context) {
        throw new Error('useShoppingCart must be used within a ShoppingCartProvider');
    }
    return context;
};

export { ShoppingCartProvider, useShoppingCart };
