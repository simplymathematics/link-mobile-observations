import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import DropDownDivider from '../../../app/src/scripts/components/presentational/DropDownDivider';

const wrapper = shallow(<DropDownDivider/>);

describe('(Component) DropDownDivider', () => {
    it('renders without exploding', () => {
        expect(wrapper).to.have.lengthOf(1);
    });
});