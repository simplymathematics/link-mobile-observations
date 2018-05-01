import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import ContentContainer from '../../../app/src/scripts/components/presentational/ContentContainer';

const wrapper = shallow(<ContentContainer/>);

describe('(Component) ContentContainer', () => {
    it('renders without exploding', () => {
        expect(wrapper).to.have.lengthOf(1);
    });
});