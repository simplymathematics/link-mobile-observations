import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import CircleThingyContainer from '../../../app/src/scripts/components/presentational/CircleThingyContainer';

const wrapper = shallow(<CircleThingyContainer/>);

describe('(Component) CircleThingyContainer', () => {
    it('renders without exploding', () => {
        expect(wrapper).to.have.lengthOf(1);
    });
});