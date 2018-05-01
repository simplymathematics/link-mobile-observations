import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import IconButton from '../../../app/src/scripts/components/presentational/IconButton';

const wrapper = shallow(<IconButton />);

describe('(Component) IconButton', () => {
    it('renders without exploding', () => {
        expect(wrapper).to.have.lengthOf(1);
    });
});
