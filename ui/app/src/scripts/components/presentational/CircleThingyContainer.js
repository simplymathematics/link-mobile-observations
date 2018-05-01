import React from "react";

const CircleThingyContainer = ({
    id,
    name,
    children
}) => {
    return (
        <div id={ id } className={"circle-thingy-container"}>
            <h6>{ name }</h6>
            { children }
        </div>
    );
};

export default CircleThingyContainer;