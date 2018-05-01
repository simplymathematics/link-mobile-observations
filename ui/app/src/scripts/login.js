'use strict';

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Login from './components/Login.jsx';
import store from './store/store';

ReactDOM.render(
    <Provider store={store}>
        <Login/>
    </Provider>,
    document.getElementById('login')
);