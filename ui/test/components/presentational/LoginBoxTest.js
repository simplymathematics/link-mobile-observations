import React from 'react';
import { shallow } from 'enzyme';
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'
var expect = chai.expect;
chai.use(chaiEnzyme());
import LoginBox from '../../../app/src/scripts/components/presentational/LoginBox';

const wrapper = shallow(<LoginBox/>);

describe('(Component) LoginBox', () => {
    it('renders without exploding', () => {
        expect(wrapper).to.have.lengthOf(1);
    });

    it('renders with an error class when an error is present', () => {
        let wrapperWithErrors = shallow(<LoginBox error="An Error Is Here (Oh no!)" />);
        expect(wrapperWithErrors.find("#loginBox")).to.have.className("error");
    });

    it('renders without an error class when an error is not present', () => {
        expect(wrapper.find("#loginBox")).to.not.have.className("error");
    });
});