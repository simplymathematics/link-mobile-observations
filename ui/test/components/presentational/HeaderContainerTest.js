import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import HeaderContainer from '../../../app/src/scripts/components/presentational/HeaderContainer';

const wrapper = shallow(<HeaderContainer/>);

describe('(Component) HeaderContainer', () => {
    it('renders without exploding', () => {
        expect(wrapper).to.have.lengthOf(1);
    });
});