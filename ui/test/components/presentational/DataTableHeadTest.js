import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import DataTableHead from '../../../app/src/scripts/components/presentational/DataTableHead';

const wrapper = shallow(<DataTableHead headData={[0,1]}/>);

describe('(Component) DataTableHead', () => {
    it('renders without exploding', () => {
        expect(wrapper).to.have.lengthOf(1);
    });
});