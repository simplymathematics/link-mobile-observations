import React from "react";

const IndexContainer = ({
    header,
    children,
    modals
}) => {
    return (
        <div>
            { header }
            { children }
            { modals }
        </div>
    );
};

export default IndexContainer;