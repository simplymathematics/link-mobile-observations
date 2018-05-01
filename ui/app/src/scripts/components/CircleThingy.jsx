'use strict';
import React from "react";
import {helpers} from 'chart.js';
import {Doughnut, Chart} from "react-chartjs-2";
import {connect} from 'react-redux';
import * as Actions from '../actions';
import { callFunctionWithParamIfDefined } from '../util/DefinedPathUtils';

export class CircleThingy extends React.Component {
    mapping = {
        0: {type: "done", display: "Done"},
        1: {type: "error", display: "Error"},
        2: {type: "notDone", display: "Not Done"}
    };

    static sumArray(array) {
        return array.reduce(function (a, b) {
            return a + b;
        }, 0)
    }

    static calculatePercentage(element, data) {
        return element / CircleThingy.sumArray(data) * 100;
    }

    tooltipFunction(tooltip, that) {
        if (tooltip.body && tooltip.body.length > 0 && tooltip.body[0].lines && tooltip.body[0].lines.length > 0) {
            let dataMapping = that.mapping[tooltip.dataPoints[0].index];
            tooltip.body[0].lines[0] = dataMapping.display + ": " + that.props.summaries[that.props.name].counts[dataMapping.type];
            tooltip.width = that.getWidth(that, tooltip);
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            options: {
                responsiveAnimationDuration: 200,
                responsive: true,
                legend: {
                    display: false
                },
                tooltips: {
                    enabled: true,
                    custom: (tooltip) => this.tooltipFunction(tooltip, this)
                },
                cutoutPercentage: 75,
                radiusBackground: {
                    color: '#D1D1D1'
                }
            },

            labels: [
                "Done",
                "Error",
                "Not Done"
            ],
            datasets: [
                {
                    borderWidth: 0.01,
                    data: [0, 0, 0],
                    backgroundColor: [
                        "#65E109",
                        "#D60B0B",
                        "#E0E0E0"
                    ],
                    hoverBackgroundColor: [
                        "#65E109",
                        "#D60B0B",
                        "#E0E0E0"
                    ]
                }
            ]
        };
    }

    componentDidMount() {
        callFunctionWithParamIfDefined(this.props.joyride, "stepMapping." + this.props.id + ".data", this.props.addStep);
    }

    getWidth(that, tooltip) {
        let width = 0;

        let ctx = that.refs.chart.chart_instance.chart.ctx;

        let widthPadding = 0;
        let maxLineWidth = function (line) {
            width = Math.max(width, ctx.measureText(line).width + widthPadding);
        };

        helpers.each(tooltip.title, maxLineWidth);

        helpers.each(tooltip.beforeBody.concat(tooltip.afterBody), maxLineWidth);

        widthPadding = tooltip.displayColors ? (tooltip.bodyFontSize + 2) : 0;
        helpers.each(tooltip.body, function (bodyItem) {
            helpers.each(bodyItem.before, maxLineWidth);
            helpers.each(bodyItem.lines, maxLineWidth);
            helpers.each(bodyItem.after, maxLineWidth);
        });

        helpers.each(tooltip.footer, maxLineWidth);

        width += 2 * tooltip.xPadding;

        return width;
    }

    mapData() {
        return new Map([
            ["done", this.props.summaries[this.props.name].counts.done],
            ["error", this.props.summaries[this.props.name].counts.error],
            ["notDone", this.props.summaries[this.props.name].counts.notDone]
        ]);
    }

    render() {
        let circleData = this.state.datasets[0];

        if (!(Object.keys(this.props.summaries).length === 0 && this.props.summaries.constructor === Object)) {
            let data;
            data = this.mapData();

            data = new Map(
                Array.from(data)
                    .map(element => [
                        element[0],
                        CircleThingy.calculatePercentage(element[1], [...data.values()])
                    ])
                    .map(element => [
                        element[0],
                        (0 < element[1] && element[1] < 1) ? 1 : Math.round(element[1])
                    ]));

            let sumData = CircleThingy.sumArray([...data.values()]);

            if (sumData > 100) {
                let delta = sumData - 100;
                let maxKey = Array.from(data).sort((o1, o2) => o1[1] > o2[1]).pop()[0];
                data.set(maxKey, data.get(maxKey) - delta);
            }

            circleData = {
                ...this.state.datasets[0],
                data: [...data.values()]
            };
        }

        return (
            <div className={"circle-wrapper" + (this.props.hidden ? ' hidden' : '')}>
                <Doughnut ref='chart' data={ { datasets: [circleData], labels: this.state.labels } }
                          options={ this.state.options } className="circles"
                          width={ 220 }
                          height={ 220 }/>
            </div>
        );
    }
}

let backgroundFunction = function (chartInstance) {
    if (chartInstance.options.radiusBackground) {
        let x = chartInstance.chart.canvas.clientWidth / 2,
            y = chartInstance.chart.canvas.clientHeight / 2,
            ctx = chartInstance.chart.ctx;

        ctx.beginPath();
        ctx.arc(x, y, chartInstance.outerRadius - (chartInstance.radiusLength / 2), 0, 2 * Math.PI);
        ctx.lineWidth = chartInstance.radiusLength;
        ctx.strokeStyle = chartInstance.options.radiusBackground.color || '#d1d1d1';
        ctx.stroke();

        ctx.save();
    }
};

Chart.pluginService.register({
    beforeDraw: function (chart) {
        let width = chart.chart.width,
            height = chart.chart.height,
            ctx = chart.chart.ctx;

        let fontSize = (height / 70).toFixed(2);

        let chartData = chart.data;

        ctx.restore();
        ctx.textBaseline = "middle";

        let text = (CircleThingy.sumArray(chartData.datasets[0].data)) ? chartData.datasets[0].data[0] + "%" : "No Data",
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 2;

        if (chartData.datasets[0].data[1] > 0) {
            let errFontSize = (height / 70).toFixed(2);
            fontSize = (height / 90).toFixed(2);
            ctx.font = "bold " + errFontSize + "em sans-serif";

            textY = height * 0.4;

            let errText = chartData.datasets[0].data[1] + "%",
                errTextX = Math.round((width - ctx.measureText(errText).width) / 2),
                errTextY = height * 0.6;

            ctx.fillStyle = "#D60B0B";
            ctx.fillText(errText, errTextX, errTextY);
        }

        ctx.font = fontSize + "em sans-serif";
        ctx.fillStyle = "#65E109";
        ctx.fillText(text, textX, textY);

        ctx.save();
    },

    beforeDatasetsDraw: backgroundFunction,

    resize: backgroundFunction
});


function mapStateToProps(state) {
    return {
        summaries: state.data.get("summaries").toJS(),
        joyride: state.joyride
    }
}

export default connect(mapStateToProps, Actions)(CircleThingy);
