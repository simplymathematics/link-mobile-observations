import React from 'react';

const LoginBox = ({
    onSubmitMethod,
    error,
    children
}) => {
    return (
        <div className="valign-wrapper">
            <div className="login-container">
                <form id="loginForm" className="login-form" onSubmit={onSubmitMethod}>
                    <div className="login-ribbon">
                        <nav role="navigation">
                            <div className="ribbon-wrapper">
                                <div className="login-logo center">
                                    <img src="./images/Paddington_Logo.png" width="84px" height="84px"/>
                                </div>
                            </div>
                        </nav>
                    </div>

                    { error }

                    <div className={ (error ? 'error' : '') + " login" } id="loginBox">
                        { children }
                        <div className="row">
                            <button type="submit"
                                    className="col s10 login-form-submit waves-effect waves-light btn right">
                                Login
                            </button>
                            <div className="right"><a href="https://access.isp.sky.com/otpc/index.cgi" className="">Forgotten
                                password?</a></div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginBox;