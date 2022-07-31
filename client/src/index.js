import ReactDOM from "react-dom";
import App from "./App";
import store from "./redux/redusx-store";
import React from 'react';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import {BrowserRouter, HashRouter} from "react-router-dom";



    ReactDOM.render(
    <HashRouter>
        <React.StrictMode>
                <Provider store={store}>
                        <App />
                </Provider>
        </React.StrictMode>,
    </HashRouter>,document.getElementById('root'));




// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
