import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
var LoginField = require('../../../app/src/scripts/components/presentational/LoginField').default;
// import LoginField from '../../../app/src/scripts/components/presentational/LoginField';

const wrapper = shallow(<LoginField label="label"/>);

describe('(Component) LoginField', () => {
    it('renders without exploding', () => {
        expect(wrapper).to.have.lengthOf(1);
    });
});