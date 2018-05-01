'use strict';

import $ from 'jquery';
window.jQuery = window.$ = $;
/*For some mad reason, this has to be require instead of
 import here and in Index, otherwise things break.*/
require("materialize-css");
import React from "react";
import {connect} from 'react-redux';
import * as Actions from '../actions';
import {callFunctionWithParamIfDefined} from '../util/DefinedPathUtils';
import {orderRecordsSelector} from '../util/FilterUtils';
import {mapCell} from '../util/RowMappings';
import Measure from 'react-measure';

const {Table, Column, Cell} = require('fixed-data-table-2');
let mapping = null;
let data = null;

class ModalDataTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tableRecords: [],
            tableDimensions: {
                width: -1,
                height: -1
            }
        };

        this.retrieveOrderFromRow = this.retrieveOrderFromRow.bind(this);
    }

    componentDidMount() {
        callFunctionWithParamIfDefined(this.props.joyride, "stepMapping." + this.props.id + "-table", this.props.addStep);
    }

    retrieveOrderFromRow(orderId) {
        this.props.orders.forEach(row => {
            if (equal(row.entityId, orderId)) {
                return row;
            }
        });

        return null;
    }

    createColumns(mappingType, localMapping, orders) {
        let a = localMapping.mappings.map(col =>
            <Column
                key={col.displayName + "-col"}
                header={<Cell key={col.displayName + "-header"}>{col.displayName}</Cell>}
                cell={
                    data => (mapCell(this, orders[data.rowIndex], col, data, data.rowIndex, localMapping.filterTypes, mappingType))
                }
                fixed={col.fixed}
                flexGrow={ col.flexGrow ? col.flexGrow : 0 }
                width={col.columnWidth}
            />);
        return a;
    };

    render() {
        mapping = this.props.mappings[this.props.type];

        return (
            <Measure
                onMeasure={(dimensions) => {
                    this.setState({tableDimensions: dimensions})
                } }
                whitelist={['height', 'width']}>
                <div style={{height: '100%', width: '100%'}}>
                    <Table
                        rowsCount={this.props.orders.length}
                        rowHeight={50}
                        headerHeight={50}
                        width={Math.max(this.state.tableDimensions.width, 600)}
                        height={this.state.tableDimensions.height}
                        {...this.props}>

                        {this.createColumns(this.props.type, mapping, this.props.orders)}
                    </Table>
                </div>
            </Measure>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        mappings: state.data.get("mappings").toJS(),
        orders: orderRecordsSelector(state, ownProps.modalType, ownProps.orderId, ownProps.type, ownProps.searchText),
        joyride: state.joyride
    }
}

export default connect(mapStateToProps, Actions)(ModalDataTable);