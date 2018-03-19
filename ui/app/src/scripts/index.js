'use strict';

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Index from './components/Index.jsx';
import store from './store/store.js';

ReactDOM.render(
    <Provider store={store}>
        <Index/>
    </Provider>,
    document.getElementById('index')
);