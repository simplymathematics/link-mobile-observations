import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'
chai.use(chaiEnzyme());
import * as Icons from '../../app/src/scripts/util/TableIcons';

describe("completedStatusIcon", function() {
    it("should return green 'done' icon if true", function () {
        let icon = shallow(Icons.completedStatusIcon(true));

        expect(icon).to.have.text('done');
        expect(icon).to.have.className('green-text');
    });

    it("should return red 'close' icon if true", function () {
        let icon = shallow(Icons.completedStatusIcon(false));
        expect(icon).to.have.text('close');
        expect(icon).to.have.className('red-text');
    });
});

describe("errorStatusIcon", function() {
    it("should return red 'error_outline' icon if true", function () {
        let icon = shallow(Icons.errorStatusIcon(true));
        expect(icon).to.have.text('error_outline');
        expect(icon).to.have.className('red-text');
    });

    it("should return empty string if false", function () {
        let icon = Icons.errorStatusIcon(false);
        expect(icon).to.have.lengthOf(0);
    });
});