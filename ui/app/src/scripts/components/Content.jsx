'use strict';

import React from 'react';
import {connect} from 'react-redux';
import * as Actions from '../actions/JoyrideAction';
import ContentContainer from './presentational/ContentContainer';
import { callFunctionWithParamIfDefined } from '../util/DefinedPathUtils';
import $ from 'jquery';
window.jQuery = window.$ = $;
require ("materialize-css");

class Content extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        Array.from(this.props.controls).forEach(control =>
            callFunctionWithParamIfDefined(this.props.joyride, "stepMapping." + control.props.id + ".data" , this.props.addStep));
    }

    render() {
        return (
            <ContentContainer name={ this.props.name }
                              controls={ this.props.controls }
                              actions= {this.props.actions}
                              contentType={ this.props.contentType }>
                { this.props.children }
            </ContentContainer>
        );
    }
}

function mapStateToProps(state) {
    return {
        joyride: state.joyride
    }
}

export default connect(mapStateToProps, Actions)(Content);