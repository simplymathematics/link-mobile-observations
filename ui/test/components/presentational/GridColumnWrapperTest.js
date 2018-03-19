import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import GridColumnWrapper from '../../../app/src/scripts/components/presentational/GridColumnWrapper';

const wrapper = shallow(<GridColumnWrapper/>);

describe('(Component) GridColumnWrapper', () => {
    it('renders without exploding', () => {
        expect(wrapper).to.have.lengthOf(1);
    });
});