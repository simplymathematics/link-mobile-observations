import React from "react";

const DataTableHead = ({
    headData
}) => {
    let i = 0;
    
    return (
        <tr>
            {headData.map(col => <th key={"col" + i++}>{col}</th>)}
        </tr>
    );
};

export default DataTableHead;