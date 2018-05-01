import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import CountBox from '../../../app/src/scripts/components/presentational/CountBox';

const wrapper = shallow(<CountBox/>);

describe('(Component) CountBox', () => {
    it('renders without exploding', () => {
        expect(wrapper).to.have.lengthOf(1);
    });
});