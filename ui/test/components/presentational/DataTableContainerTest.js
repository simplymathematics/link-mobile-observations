import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import DataTableContainer from '../../../app/src/scripts/components/presentational/DataTableContainer';

const wrapper = shallow(<DataTableContainer/>);

describe('(Component) DataTableContainer', () => {
    it('renders without exploding', () => {
        expect(wrapper).to.have.lengthOf(1);
    });
});