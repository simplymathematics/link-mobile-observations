import React from 'react';

const LoginError = ({
    errorMessage
}) => {
    return (
        <div className="errorMsg fade-in" role="alert">
                    <span className="errorBoxIcon left" aria-hidden="true" style={{paddingRight: '5px'}}>
                        <i className="material-icons prefix">info_outline</i>
                    </span>
            {"Error: " + errorMessage}
        </div>
    );
};

export default LoginError;