'use strict';

import React from 'react';
import LoginForm from './LoginForm.jsx';
import "materialize-css";

class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <LoginForm />
        );
    }
}

export default Login;