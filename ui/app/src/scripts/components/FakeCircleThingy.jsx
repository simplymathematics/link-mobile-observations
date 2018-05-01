'use strict';
import React from "react";
import {connect} from 'react-redux';
import * as Actions from '../actions';
import { CircleThingy } from './CircleThingy.jsx';

class FakeCircleThingy extends CircleThingy {

    tooltipFunction(tooltip, that) {
        if (tooltip.body && tooltip.body.length > 0 && tooltip.body[0].lines && tooltip.body[0].lines.length > 0) {
            let dataMapping = that.mapping[tooltip.dataPoints[0].index];
            tooltip.body[0].lines[0] = dataMapping.display + ": " + (that.props[dataMapping.type + "Value"] ? that.props[dataMapping.type + "Value"] : 0);
            tooltip.width = that.getWidth(that, tooltip);
        }
    }

    /**
     * Overrides the CircleThingy componentDidMount method, to prevent adding steps for fake circles as well as real ones.
     */
    componentDidMount() {}

    mapData() {
        return new Map([
            ["done", this.props.doneValue ? this.props.doneValue : 0],
            ["error", this.props.errorValue ? this.props.errorValue : 0],
            ["notDone", this.props.notDoneValue ? this.props.notDoneValue : 0]
        ]);
    }
}

function mapStateToProps(state) {
    return {
        summaries: state.data.get("summaries").toJS(),
        joyride: state.joyride
    }
}

export default connect(mapStateToProps, Actions)(FakeCircleThingy);
