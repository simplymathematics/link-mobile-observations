'use strict';

import React from 'react';
import HeaderContainer from './presentational/HeaderContainer'
import DropDownContainer from './presentational/DropDownContainer'
import DropDownItem from './presentational/DropDownItem'
import DropDownDivider from './presentational/DropDownDivider'
import HeaderButton from './presentational/HeaderButton'
import { connect } from 'react-redux';
import * as Actions from '../actions/JoyrideAction';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.triggerPageChange = this.triggerPageChange.bind(this);
        this.resetJoyride = this.resetJoyride.bind(this);
    }

    triggerPageChange(page) {
        this.props.callbackParent(page.target.className);
    }

    resetJoyride() {
        this.props.joyrideCallback();
    }

    componentDidMount() {}

    render() {
        return (
            <HeaderContainer>
                <DropDownContainer name="dashboardDropDown"
                                   label="Dashboard">
                    <DropDownItem
                        name="Dev"
                        label="Dev"
                        onClickFunction={this.triggerPageChange}/>
                    {/*<DropDownDivider/>*/}
                    {/*<DropDownItem*/}
                        {/*name="Test"*/}
                        {/*label="Test"*/}
                        {/*onClickFunction={this.triggerPageChange}/>*/}
                    {/*<DropDownDivider/>*/}
                </DropDownContainer>
                
            </HeaderContainer>
        );
    }
}

function mapStateToProps(state) {
    return {
        joyride: state.joyride
    }
}

export default connect(mapStateToProps, Actions)(Header);