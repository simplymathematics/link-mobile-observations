import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import TableSearchBox from '../../../app/src/scripts/components/presentational/TableSearchBox';

const wrapper = shallow(<TableSearchBox/>);

describe('(Component) TableSearchBox', () => {
    it('renders without exploding', () => {
        expect(wrapper).to.have.lengthOf(1);
    });
});