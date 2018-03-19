import React from 'react';

const LoginModal = ({
    children
}) => {
    return (
        <div id="loginModal" className="modal">
            <div className="modal-content">
                { children }
            </div>
        </div>
    );
};

export default LoginModal;