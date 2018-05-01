'use strict';

var React                   = require('react');
var ReactDOM                = require('react-dom');
var Router                  = require('react-router').Router;
var browserHistory          = require('react-router').browserHistory;

// const rootRoute = {
//     getChildRoutes(partialNextState, callback) {
//         require.ensure([], function (require) {
//             callback(null, [
//                 require('./paddington'),
//                 require('./login-page')
//             ])
//         })
//     }
// }

const rootRoute = {
    childRoutes: [ {
        path: '/',
        // component: require('./components/App'),
        childRoutes: [
            require('./index'),
            require('./login')
        ]
    } ]
};

ReactDOM.render(<Router
    history={browserHistory}
    routes={rootRoute}/>
, document.getElementById('root'));