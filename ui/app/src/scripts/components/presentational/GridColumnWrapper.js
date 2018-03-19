import React from 'react';

const GridColumnWrapper = ({
    width,
    children
}) => {
    return (
        <div className={"col s" + width}>
            {children}
        </div>
    );
};

export default GridColumnWrapper;