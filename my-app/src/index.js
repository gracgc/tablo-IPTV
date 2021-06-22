import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'core-js';
import 'raf/polyfill';
import "core-js/stable";
import "regenerator-runtime/runtime";


import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import store from './redux/redux_store';







import App from "./App";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";



ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <App/>
        </Provider>
    </BrowserRouter>, document.getElementById('root'));