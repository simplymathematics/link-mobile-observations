import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import IndexContainer from '../../../app/src/scripts/components/presentational/IndexContainer';

const wrapper = shallow(<IndexContainer/>);

describe('(Component) IndexContainer', () => {
    it('renders without exploding', () => {
        expect(wrapper).to.have.lengthOf(1);
    });
});