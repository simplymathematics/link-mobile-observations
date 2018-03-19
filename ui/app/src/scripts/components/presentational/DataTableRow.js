import React from "react";

const DataTableRow = ({
    rowName,
    rowData
}) => {
    let i = 0;

    return (
        <tr className={rowName}>
            {rowData.map(col => <td className={"class"+i} key={"col" + i++}>{col}</td>)}
        </tr>
    );
};

export default DataTableRow;