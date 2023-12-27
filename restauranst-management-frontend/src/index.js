import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css'; // Import Tailwind CSS
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import {ShoppingCartProvider} from "./hooks/ShoppingCartProvider";

ReactDOM.render(
    <BrowserRouter>
        <ShoppingCartProvider>
        <App />
        </ShoppingCartProvider>
    </BrowserRouter>,
    document.getElementById('root')
);


if (module.hot) {
    module.hot.accept();
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
