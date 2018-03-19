import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import HeaderButton from '../../../app/src/scripts/components/presentational/HeaderButton';

const wrapper = shallow(<HeaderButton/>);

describe('(Component) HeaderButton', () => {
    it('renders without exploding', () => {
        expect(wrapper).to.have.lengthOf(1);
    });
});