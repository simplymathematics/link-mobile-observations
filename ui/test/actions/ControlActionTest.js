import { expect } from 'chai';
import * as actionCreator from '../../app/src/scripts/actions/ControlAction'

describe('(REDUX) ControlAction dataReducer(string)', function() {
   it('should return object with type \'TOGGLE_FILTER_CRITERIA\' and message content \'COMPLETED\' when passed COMPLETED as parameter.', function() {
       let action = actionCreator.toggleFilterCriteria(actionCreator.COMPLETED)

       expect(action).to.deep.equal({
           "type": "TOGGLE_FILTER_CRITERIA",
           "content":{
               "criteria":actionCreator.COMPLETED
           }
       })
   });

    it('should return object with type \'TOGGLE_FILTER_CRITERIA\' and message content \'OUTSTANDING\' when passed OUTSTANDING AS parameter', function() {
        let action = actionCreator.toggleFilterCriteria(actionCreator.OUTSTANDING)

        expect(action).to.deep.equal({
            "type": "TOGGLE_FILTER_CRITERIA",
            "content":{
                "criteria":actionCreator.OUTSTANDING
            }
        })
    });
});

describe('(REDUX) ControlAction setPageType(string)', function() {
    it('should return object with type \'SET_PAGE_TYPE\' and pageType content \'index\'', function () {
        let action = actionCreator.setPageType("index");

        expect(action).to.deep.equal({
            "type": "SET_PAGE_TYPE",
            "content":{
                "pageType":"index"
            }
        })
    });
});

describe('(REDUX) ControlAction setSearchText(string)', function() {
    it('should return object with type \'SET_SEARCH_TEXT\' and searchText content \'Mango\'', function () {
        let action = actionCreator.setSearchText("Mango");

        expect(action).to.deep.equal({
            "type": "SET_SEARCH_TEXT",
            "content":{
                "searchText":"Mango"
            }
        })
    });
});

