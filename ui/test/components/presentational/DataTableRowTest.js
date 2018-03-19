import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import DataTableRow from '../../../app/src/scripts/components/presentational/DataTableRow';

const wrapper = shallow(<DataTableRow rowData={[0,1]}/>);

describe('(Component) DataTableRow', () => {
    it('renders without exploding', () => {
        expect(wrapper).to.have.lengthOf(1);
    });
});