import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import DropDownItem from '../../../app/src/scripts/components/presentational/DropDownItem';

const wrapper = shallow(<DropDownItem/>);

describe('(Component) DropDownItem', () => {
    it('renders without exploding', () => {
        expect(wrapper).to.have.lengthOf(1);
    });
});