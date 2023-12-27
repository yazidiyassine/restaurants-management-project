// Import the necessary modules
import React from 'react';
import AuthUser from './auth/AuthUser';
import UserContext from './auth/UserContext';
import Auth from "./Auth-Routes/auth";
import Navbar from "./Components/layouts/Navbar";
import Guest from "./Auth-Routes/guest";

function App() {
    const { user, setUser, getToken } = AuthUser();
     const isAuthenticated = getToken();

    return (
        <UserContext.Provider value={{user, setUser}}>
            <Navbar/>
            {isAuthenticated ? <Auth /> : <Guest />}
        </UserContext.Provider>
    );
}

export default App;
