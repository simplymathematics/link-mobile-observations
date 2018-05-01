import React from 'react';

const HeaderContainer = ({
    children
}) => {
    return (
        <div className="navbar-fixed">
            <nav role="navigation">
                <div className="nav-wrapper">
                    <div className="brand-logo">
                        <img src="./images/Paddington_Logo.png" width="84px" height="84px"/>
                    </div>
                    <div>
                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                            { children }
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default HeaderContainer;