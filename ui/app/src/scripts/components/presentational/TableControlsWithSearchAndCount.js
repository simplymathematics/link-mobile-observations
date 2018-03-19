import React from 'react';
import TableSearchBox from './TableSearchBox';
import CountBox from './CountBox';
import GridColumnWrapper from './GridColumnWrapper';

const TableControlsWithSearchAndCount = ({
                                             searchMethod,
                                             resultCount,
                                             searchText,
                                             children
                                         }) => {
    return (
        <div>
            <GridColumnWrapper key="tableSearchWrapper" width="3">
                <TableSearchBox label="Search" placeholder="Search..." value={searchText}
                                onChangeMethod={searchMethod}/>
            </GridColumnWrapper>
            {/*<GridColumnWrapper key="tableControlsWrapper" className="input-field" width="6">*/}
                {/*{children}*/}
            {/*</GridColumnWrapper>*/}
            <GridColumnWrapper key="resultCountWrapper" width="3">
                {/*<CountBox key="tableCount" label="Results" value={resultCount}/>*/}
            </GridColumnWrapper>
        </div>
    );
};

export default TableControlsWithSearchAndCount;