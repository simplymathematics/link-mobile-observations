import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import DataTableToggle from '../../../app/src/scripts/components/presentational/DataTableToggle';

const wrapper = shallow(<DataTableToggle />);

describe('(Component) DataTableToggle', () => {
    it('renders without exploding', () => {
        expect(wrapper).to.have.lengthOf(1);
    });

    it('renders "Hide" when toggleVal is true', () => {
        let toggleTrueWrapper = shallow(<DataTableToggle toggleVal={true} />);
        expect(toggleTrueWrapper.text()).to.contain("Hide");
    });

    it('renders "Show" when toggleVal is false', () => {
        let toggleFalseWrapper = shallow(<DataTableToggle toggleVal={false} />);
        expect(toggleFalseWrapper.text()).to.contain("Show");
    });
});
