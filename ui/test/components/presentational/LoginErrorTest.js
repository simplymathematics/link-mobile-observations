import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import LoginError from '../../../app/src/scripts/components/presentational/LoginError';

const wrapper = shallow(<LoginError/>);

describe('(Component) LoginError', () => {
    it('renders without exploding', () => {
        expect(wrapper).to.have.lengthOf(1);
    });
});