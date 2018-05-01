import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import LoginModal from '../../../app/src/scripts/components/presentational/LoginModal';

const wrapper = shallow(<LoginModal/>);

describe('(Component) LoginModal', () => {
    it('renders without exploding', () => {
        expect(wrapper).to.have.lengthOf(1);
    });
});