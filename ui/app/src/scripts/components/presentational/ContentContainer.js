import React from "react";

const ContentContainer = ({
                              name,
                              controls,
                              actions,
                              contentType,
                              children
                          }) => {
    return (
        <div className={"content-card-wrapper " + contentType}>
            <div className="card">
                <div className="card-action content-container">
                    <div className="row">
                        <h5 className="col s6">{ name }</h5>
                        <div className="actions col s6 right-align">
                            { actions }
                        </div>
                    </div>
                    <div className="content-controls row">
                        { controls }
                    </div>
                    <ul className="tabs hide">
                    </ul>
                </div>
                <div className="card-content">
                    { children }
                </div>
            </div>
        </div>
    );
};

export default ContentContainer;