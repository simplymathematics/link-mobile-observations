import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import DropDownContainer from '../../../app/src/scripts/components/presentational/DropDownContainer';

const wrapper = shallow(<DropDownContainer/>);

describe('(Component) DropDownContainer', () => {
    it('renders without exploding', () => {
        expect(wrapper).to.have.lengthOf(1);
    });
});