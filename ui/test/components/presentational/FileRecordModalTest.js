import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import FileRecordModal from '../../../app/src/scripts/components/presentational/FileRecordModal';

const wrapper = shallow(<FileRecordModal/>);

describe('(Component) FileRecordModal', () => {
    it('renders without exploding', () => {
        expect(wrapper).to.have.lengthOf(1);
    });
});