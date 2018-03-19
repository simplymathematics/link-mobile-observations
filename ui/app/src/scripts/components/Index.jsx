'use strict';

/*For some mad reason, this has to be require instead of
 import here and in DataTable, otherwise things break.*/
require("materialize-css");
import React from 'react';
import { CSVLink } from 'react-csv';
import dateformat from 'dateformat';
import Joyride from 'react-joyride';
import Cookies from 'js-cookie';
import {connect} from 'react-redux';
import * as Actions from '../actions';
import Header from './Header.jsx';
import Content from './Content.jsx';
import ContentContainer from './presentational/ContentContainer';
import IndexContainer from "./presentational/IndexContainer";
import CircleThingyContainer from "./presentational/CircleThingyContainer";
import CircleThingy from "./CircleThingy.jsx";
import FakeCircleThingy from "./FakeCircleThingy.jsx";
import DataTable from "./DataTable.jsx";
import DataTableToggle from "./presentational/DataTableToggle";
import ModalDataTable from "./ModalDataTable.jsx";
import FileRecordModal from "./presentational/FileRecordModal";
import LoginModal from './presentational/LoginModal';
import LoginForm from './LoginForm.jsx';
import TableControlWithSearchAndCount from './presentational/TableControlsWithSearchAndCount';
import * as JRTypeMappings from "../../resources/mappings/joyride/JRTypeMapping.json";
import {getDefinedOrElse} from '../util/DefinedPathUtils';
import {orderSelector} from '../util/FilterUtils';
import {simpleContent} from '../util/RowMappings';

/*
 * Object.entries for older browsers (pre Chrome-54 & Firefox 47).
 */
Object.entries = typeof Object.entries === 'function' ? Object.entries : obj => Object.keys(obj).map(k => [k, obj[k]]);

let ws;

function getWebsocketUri(pageVal) {
    let loc = window.location, new_uri;

    if (loc.protocol === "https:") {
        new_uri = "wss:";
    } else {
        new_uri = "ws:";
    }
    new_uri += "//" + loc.host + "/ws" + "?" + pageVal;

    return new_uri;
}

function getInitialIndex() {
    let index = parseInt(Cookies.get("guideIndex"));
    return index ? index : 0;
}

function populatePageFromScratch(data, currentPage) {
    // console.log("populate from Scratch: Errors?"+ onErrorPage(currentPage))
    if (onErrorPage(currentPage)) {
        currentPage.props.populateOrders(data.filter(order => hasFailures(order)));
    } else {
        // console.log("data "+ data)
        currentPage.props.populateOrders([data]);
    }
}

function updatePageWithDelta(data, currentPage) {
    if (onErrorPage(currentPage)) {
        currentPage.props.updateOrders(data.filter(order => hasFailures(order)));
        currentPage.props.removeOrders(data.filter(order => noFailures(order)));
    } else {
        currentPage.props.updateOrders(data);
    }
}

function noFailures(data) {
    return data && data.failures && !data.failures.length;
}

function hasFailures(data) {
    return data && data.failures && data.failures.length;
}

function onErrorPage(currentPage) {
    return currentPage.props.control.pageType.includes('Errors');
}

function orderPageHasData(currentPage) {
    return currentPage.props.orders.length;
}

function summaryPageHasData(currentPage) {
    return currentPage.props.summaries.length;
}

function ordersAsCSV(orders, mappings, currentPage, separator = ',') {
    let csvContent = ordersWithHeaders(orders, mappings, currentPage);
    return csvContent.map(row => {
        return row.join(separator).replace(/"/g, '')
    }).join(`\n`);
}

function ordersWithHeaders(orders, mappings, currentPage) {
    let downloadableMappings = getDefinedOrElse(mappings[currentPage], "mappings", []).filter(mapping => mapping.downloadable);
    let headers = downloadableMappings.map(mapping => getDefinedOrElse(mapping, "displayName", ""));
    let ordersWithDownloadableFields = orders.map(order => {
        return downloadableMappings.map(mapping => {
            return simpleContent(order, mapping);
        });
    });
    return [headers].concat(ordersWithDownloadableFields);
}

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            date: new Date(),
            keyIncrementor: 0,
            searchText: "",
            resultCount: 0,
            modal: {
                orderId: "",
                fileRecordsModal: null,
                searchText: "",
                mappingType: "receivedFileRecords",
                resultCount: 0
            },
            tableDimensions: {
                width: 100,
                height: 100
            }
        };

        this.mainHandler = this.mainHandler.bind(this);
        this.createWebsocket = this.createWebsocket.bind(this);
    }

    componentDidMount() {
        let pageHash = window.location.hash.replace(/^#\/?|\/$/g, '').split('/')[0];
        let pageState = pageHash === "" ? "portInDash" : pageHash;

        this.props.setPageType(pageState);

        this.createWebsocket(pageState);

        $("#loginModal").modal({dismissible: false});

        this.props.setStepIndex(getInitialIndex());
    }

    createWebsocket(pageVal) {
        console.log("Create WebSocket " + pageVal)
        let currentPage = this;
        ws = new WebSocket(getWebsocketUri(pageVal));

        ws.onerror = () => {
            window.location.replace("/");
        };

        ws.onmessage = event => {
            let message = JSON.parse(event.data);
            console.log("message(event.data) "+ event.data)
            // console.log("message "+ message)
            if( message.ping > 0){

            }else {
                populatePageFromScratch(message, currentPage);
            }
            // currentPage.props.updateSummaries(message.data);
            // switch (message.type) {
            //     case "summaries":
            //         if (summaryPageHasData(currentPage)) {
            //             currentPage.props.updateSummaries(message.data);
            //         } else {
            //             currentPage.props.populateSummaries(message.data);
            //         }
            //         break;
            //     case "orders":
            //         if (orderPageHasData(currentPage)) {
            //             updatePageWithDelta(message.data, currentPage);
            //         } else {
            //             populatePageFromScratch(message.data, currentPage);
            //         }
            //         break;
            //     default:
            //         console.log("Invalid data received through Websocket.");
            // }
        };
    }

    mainHandler(pageVal) {
        if (pageVal !== this.props.control.pageType) {
            ws.close();
            this.props.setSearchText("");
            this.props.clearOrders();
            this.props.clearSummaries();
            this.props.setStepIndex(0);
            this.props.clearSteps();
            this.props.setPageType(pageVal);
            this.createWebsocket(pageVal);
        }
    }

    resetJoyride() {
        let currentCookies;
        try {
            currentCookies = JSON.parse(Cookies.get('completedGuideSteps'));
        } catch (e) {
            currentCookies = [];
        }

        let genIdsOnPage =
            Object.entries(this.props.joyride.stepMapping)
                .filter(mapping => (mapping[1].data.id.includes("GEN") && document.getElementById(mapping[0])))
                .map(mapping => mapping[1].data.id);

        /*
         Remove IDs from cookies for all tutorials specific to this page, plus any general ones on this page,
         with the exception of the tutorial for the Replay Button itself (GEN-REPLAY), which would not need to be shown again.
         */
        Cookies.set(
            'completedGuideSteps',
            currentCookies.filter(id =>
                !(id.includes(JRTypeMappings[this.props.control.pageType]) ||
                (id !== "GEN-REPLAY" && id.includes("GEN") && genIdsOnPage.includes(id)))), {expires: 3650});

        this.props.clearSteps();
        this.setState({keyIncrementor: (this.state.keyIncrementor + 1)});
        this.props.setStepIndex(0);
    }

    toggleFilterCriteria = (criteria) => {
        this.props.toggleFilterCriteria(criteria);
    };

    createCircleThingies(prefix) {
        return Object.keys(this.props.summaries).map(summary => {
            let summaryId = prefix + summary.toLowerCase().replace(/ /g, '-') + "-circle";
            let fakeCircle, fakeDone, fakeNotDone;

            if (this.props.joyride.steps[this.props.joyride.stepIndex] && this.props.joyride.steps[this.props.joyride.stepIndex].selector.includes(summaryId)) {
                fakeCircle = true;
                fakeDone = getDefinedOrElse(this.props.joyride, "stepMapping." + summaryId + ".counts.done", Math.floor(Math.random() * 70) + 30);
                fakeNotDone = getDefinedOrElse(this.props.joyride, "stepMapping." + summaryId + ".counts.notDone", Math.floor(Math.random() * 50) + 10);
            }

            return (
                <CircleThingyContainer id={ summaryId } name={ summary } key={ summary }>
                    {[
                        <CircleThingy id={ summaryId } key={ summary + this.state.keyIncrementor } name={ summary }
                                      hidden={ fakeCircle }/>,
                        <FakeCircleThingy key={ "fake" + summary } name={ summary }
                                          doneValue={ fakeDone }
                                          notDoneValue={ fakeNotDone }
                                          hidden={ !fakeCircle }/>
                    ]}
                </CircleThingyContainer>
            );
        });
    }

    searchMethod(context) {
        return searchText => {
            context.props.setSearchText(searchText);
        }
    };

    modalSearchMethod(context) {
        return searchText => {
            context.setState({
                modal: {
                    ...context.state.modal,
                    searchText: searchText
                }
            });
        }
    };

    resultCountCallback(context) {
        return count => {
            context.setState({resultCount: count});
        }
    };

    createTable(title, pageType, controls, actions) {
        let tableId = pageType.replace(/([a-z][a-z]*)([A-Z])/g, '$1-$2').toLowerCase() + "-table";
        return <Content name={title}
                        key={pageType + this.state.keyIncrementor}
                        contentType="table"
                        controls={
                            <TableControlWithSearchAndCount searchMethod={this.searchMethod(this)}
                                                            searchString={this.props.control.searchText}
                                                            resultCount={this.state.resultCount}>
                                {controls}
                            </TableControlWithSearchAndCount>
                        }
                        actions={actions}>
            <DataTable id={tableId}
                       key={pageType + "-table-" + this.state.keyIncrementor}
                       type={pageType}
                       resultCountCallback={this.resultCountCallback(this)}/>
        </Content>;
    }

    render() {
        let controls = {
            "outstanding": <DataTableToggle id="outstanding-button"
                                            name="Outstanding"
                                            key="outstanding"
                                            onClick={() => this.toggleFilterCriteria(Actions.OUTSTANDING)}
                                            toggleVal={ this.props.control.shouldShowOutstanding }/>,
            "completed": <DataTableToggle id="completed-button"
                                          name="Completed"
                                          key="completed"
                                          onClick={() => this.toggleFilterCriteria(Actions.COMPLETED)}
                                          toggleVal={ this.props.control.shouldShowCompleted }/>

        };

        let actions = {
            "export": <CSVLink key="export"
                               className="icon-button tooltipped"
                               filename={dateformat(this.state.date, "'PortInFile'-yyyy-mm-dd'T'HH-MM'.csv'")}
                               data-position="bottom"
                               data-delay="1000"
                               data-tooltip="Export to CSV"
                               data={ordersAsCSV(this.props.orders, this.props.mappings, this.props.control.pageType)}
                               onClick={ () => this.setState({"date": new Date()}) }
                               ref={ () => $('.tooltipped').tooltip() }>
                <i id='export-button' className='material-icons'>
                    file_download
                </i>
            </CSVLink>
        };

        let completedControl =
            <DataTableToggle id="completed-button"
                             name="Completed"
                             key="completed"
                             onClick={() => this.toggleFilterCriteria(Actions.COMPLETED)}
                             toggleVal={ this.props.control.shouldShowCompleted }/>;

        let curPage;
        let modals = [
            <LoginModal key="loginModal">
                <LoginForm successMethod={ () => $('#loginModal').modal('close') }/>
            </LoginModal>
        ];

        let fileModal = <ModalDataTable key="MDT"
                                        orderId={this.state.modal.orderId}
                                        type={this.state.modal.mappingType}
                                        modalType={this.state.modal.type}
                                        resultCountCallback={this.resultCountCallback(this)}
                                        searchText={this.state.modal.searchText}/>;

        let pageType = this.props.control.pageType;

        let createFileRecordModal = context => {
            return (type, orderId, mappingType) => {
                context.setState({
                    modal: {
                        ...context.state.modal,
                        orderId: orderId,
                        searchText: "",
                        type: type,
                        mappingType: mappingType
                    }
                });
            }
        };

        if (pageType && pageType.includes("Dash")) {
            console.log("mappings "+ pageType)
            let mapping = this.props.mappings[pageType];
            console.log("mappings "+ mapping)
            curPage = this.createTable(
                mapping.title, pageType,
                getDefinedOrElse(mapping, "filterTypes", []).map(type => controls[type]),
                getDefinedOrElse(mapping, "actions", []).map(type => actions[type]));
        }

        switch (pageType) {
            case "portInDash":
                curPage =
                    <Content name="Kinesis Observations"
                                 key={pageType}
                                 contentType="table"
                                 controls={
                                     <TableControlWithSearchAndCount searchMethod={this.searchMethod(this)}
                                                                     searchText={this.props.control.searchText}
                                                                     resultCount={this.state.resultCount}>
                                         {[completedControl]}
                                     </TableControlWithSearchAndCount>
                                 }>
                            <DataTable key={pageType}
                                       type={pageType}
                                       fileRecordModalInitialiser={createFileRecordModal(this)}
                                       resultCountCallback={this.resultCountCallback(this)}/>
                        </Content>;

                modals = modals.concat(
                    <FileRecordModal name="fileRecordModal"
                                     key="fileRecordModal"
                                     title="File Failed Records"
                                     controls={
                                         <TableControlWithSearchAndCount searchMethod={this.modalSearchMethod(this)}
                                                                         searchText={this.state.modal.searchText}
                                                                         resultCount={this.state.resultCount}>
                                             {[<div key="noControls" className="section"/>]}
                                         </TableControlWithSearchAndCount>
                                     }>
                        {fileModal}
                    </FileRecordModal>).concat(
                    <FileRecordModal name="fileRejectedModal"
                                     key="fileRejectedModal"
                                     title="File Failure"
                                     controls={[<div key="noControls" className="section"/>]}>
                        {fileModal}
                    </FileRecordModal>
                );

                break;
            case "portOutDash":
                curPage =
                    <ContentContainer name="Port Out Dashboard"
                                      key={pageType}
                                      contentType="summary">
                        { this.createCircleThingies("port-out-dash-") }
                    </ContentContainer>;
                break;
            case "subPortDash":
                curPage =
                    <ContentContainer name="Sub Port Dashboard"
                                      key={pageType}
                                      contentType="summary">
                        { this.createCircleThingies("sub-port-dash-") }
                    </ContentContainer>;
                break;
            case "receivedFiles":
                curPage =
                    <Content name="Received Files"
                             key={pageType}
                             contentType="table"
                             controls={
                                 <TableControlWithSearchAndCount searchMethod={this.searchMethod(this)}
                                                                 searchText={this.props.control.searchText}
                                                                 resultCount={this.state.resultCount}>
                                     {[completedControl]}
                                 </TableControlWithSearchAndCount>
                             }>
                        <DataTable key={pageType}
                                   type={pageType}
                                   fileRecordModalInitialiser={createFileRecordModal(this)}
                                   resultCountCallback={this.resultCountCallback(this)}/>
                    </Content>;

                modals = modals.concat(
                    <FileRecordModal name="fileRecordModal"
                                     key="fileRecordModal"
                                     title="File Failed Records"
                                     controls={
                                         <TableControlWithSearchAndCount searchMethod={this.modalSearchMethod(this)}
                                                                         searchText={this.state.modal.searchText}
                                                                         resultCount={this.state.resultCount}>
                                             {[<div key="noControls" className="section"/>]}
                                         </TableControlWithSearchAndCount>
                                     }>
                        {fileModal}
                    </FileRecordModal>).concat(
                    <FileRecordModal name="fileRejectedModal"
                                     key="fileRejectedModal"
                                     title="File Failure"
                                     controls={[<div key="noControls" className="section"/>]}>
                        {fileModal}
                    </FileRecordModal>
                );
                break;

            case "writtenFiles":
                curPage =
                    <Content name="Generated Files"
                             key={pageType}
                             contentType="table"
                             title="File Records"
                             controls={
                                 <TableControlWithSearchAndCount searchMethod={this.searchMethod(this)}
                                                                 searchText={this.props.control.searchText}
                                                                 resultCount={this.state.resultCount}>
                                     {[<div key="noControls" className="section"/>]}
                                 </TableControlWithSearchAndCount>
                             }>
                        <DataTable key={pageType}
                                   type={pageType}
                                   fileRecordModalInitialiser={createFileRecordModal(this)}
                                   resultCountCallback={this.resultCountCallback(this)}/>
                    </Content>;

                modals = modals.concat(
                    <FileRecordModal name="fileRecordModal"
                                     key="fileRecordModal"
                                     controls={
                                         <TableControlWithSearchAndCount searchMethod={this.modalSearchMethod(this)}
                                                                         searchText={this.state.modal.searchText}
                                                                         resultCount={this.state.resultCount}>
                                             {[<div key="noControls" className="section"/>]}
                                         </TableControlWithSearchAndCount>
                                     }>
                        {fileModal}
                    </FileRecordModal>);
                break;
        }

        let isGenResetGuideStep = this.props.joyride.steps[this.props.joyride.stepIndex] && this.props.joyride.steps[this.props.joyride.stepIndex].id === "GEN-REPLAY";

        return (
            <IndexContainer
                header={<Header callbackParent={this.mainHandler.bind(this)}
                                joyrideCallback={this.resetJoyride.bind(this)}
                                initialPage={this.props.control.pageType}/>}
                modals={ modals }>
                { curPage }
                <Joyride ref={c => (this.joyride = c)}
                         run={true}
                         scrollOffset={80}
                         autoStart={true}
                         type="continuous"
                         stepIndex={this.props.joyride.stepIndex}
                         steps={this.props.joyride.steps}
                         debug={false}
                         disableOverlay={true}
                         callback={(data) => joyrideCallback(data, this)}
                         showSkipButton={!isGenResetGuideStep}
                         showBackButton={!isGenResetGuideStep}
                         showStepsProgress={true}/>
            </IndexContainer>
        );
    }
}

function updateCookie(cookie, values) {
    let newCookie;

    try {
        newCookie = new Set(JSON.parse(cookie));
    } catch (e) {
        newCookie = new Set();
    }

    values.forEach(value => newCookie.add(value.toString()));

    return JSON.stringify(Array.from(newCookie));
}

function joyrideCallback(data, that) {
    switch (data.type) {
        case "step:before":
            that.props.setStepIndex(data.index);
            if (data.index === 0) {
                that.props.addStep(that.props.joyride.stepMapping["joyride-replay-button"].data);
            }
            return;
        case "tooltip:before":
            if (that.props.joyride.stepIndex !== data.index) {
                that.props.setStepIndex(data.index);
            }
            return;
        case "step:after":
            Cookies.set(
                'completedGuideSteps',
                updateCookie(Cookies.get('completedGuideSteps'), [data.step.id]),
                {expires: 3650});
            return;
        case "finished":
            if (data.isTourSkipped) {
                that.props.addStep(that.props.joyride.stepMapping["joyride-replay-button"].data);
            }
            that.props.setStepIndex(data.steps.length);
            Cookies.set(
                'completedGuideSteps',
                updateCookie(Cookies.get('completedGuideSteps'), data.steps.map(step => step.id)),
                {expires: 3650});
            return;
        default:
            return;
    }
}

function mapStateToProps(state) {
    return {
        control: state.control,
        mappings: state.data.get("mappings").toJS(),
        summaries: state.data.get("summaries").toJS(),
        orders: orderSelector(state, state.control.searchText),
        joyride: state.joyride
    }
}

export default connect(mapStateToProps, Actions)(Index);
