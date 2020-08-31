import React, { Component } from 'react';
import { Element } from 'react-faux-dom';
import * as d3 from 'd3';
import styles from "./AssetSummaryGraph.module.scss"

// const data = [
//     {
//         stream_name: 'S1',
//         value: 273
//     },
//     {
//         stream_name: 'S2',
//         value: 2420
//     },
//     {
//         stream_name: 'S3',
//         value: 1270
//     },
//     {
//         stream_name: 'S4',
//         value: 553
//     },
// ];

let data = []

const margin = {
    top: 60,
    bottom: 100,
    left: 80,
    right: 40
};

class AssetSummaryGraph extends Component {
    state = {
        mounted: false,
        shouldRerender: true,
    }

    componentDidMount() {
        const element = document.getElementById('chart_container');
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        // this.setState({ width, height })
        this.setState({ mounted: true })
        this.drawChart(width, height, element)
    }

    componentWillUnmount() {
        this.setState({ shouldRerender: true })
    }

    // shouldComponentUpdate(props) { return this.state.shouldRerender }

    drawChart(width, height, element) {
        this.setState({ chart: "<span>Loading</span>" })
        const sources = this.props.data.filter(datum => `${datum}`.indexOf('T_') === 0)
        const parsedSources = sources.reduce((acc, curr) => {
            const sourceName = curr.split(' ')[0]
            let count = acc[sourceName] || 0
            acc[sourceName] = ++count
            return acc
        }, {})

        Object.keys(parsedSources).forEach(key => {
            data.push({
                stream_name: key,
                value: parsedSources[key]
            })
        });
        // console.log({data, parsedSources, sources})


        console.log({ width, height })

        const el = new Element('div');

        const svg = d3.select(el)

            .append('svg')
            .attr('id', 'chart')
            .attr('width', width)
            .attr('height', height);
        svg.selectAll(".bar-label").remove();


        const chart = svg.append('g')
            .classed('display', true)
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom
        this.plot(chart, chartWidth, chartHeight);

        this.setState({ shouldRerender: false })
        this.setState({ chart: el.toReact() });
        return
    }

    plot = (chart, width, height) => {
        const xScale = d3.scaleBand()
            .domain(data.map(d => d.stream_name))
            .range([0, width]);
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([height, 0]);
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        chart.selectAll(".bar")
            .data(data)
            .enter()
            .append('rect')
            .classed('bar', true)
            .attr('x', d => xScale(d.stream_name))
            .attr('y', d => yScale(d.value))
            .attr('height', d => (height - yScale(d.value)))
            .attr('width', d => xScale.bandwidth())
            .style('fill', (d, i) => colorScale(i));

        chart.selectAll('.bar-label')
            .data(data)
            .enter()
            .append('text')
            .classed('bar-label', true)
            .attr('x', d => xScale(d.stream_name) + xScale.bandwidth() / 2)
            .attr('dx', 0)
            .attr('y', d => yScale(d.value))
            .attr('dy', -6)
            .text(d => d.value);

        const yGridlines = d3.axisLeft()
            .scale(yScale)
            .ticks(5)
            .tickSize(-width, 0, 0)
            .tickFormat('-')

        chart.append('g')
            .call(yGridlines)
            .classed('gridline', true);

        const xAxis = d3.axisBottom()
            .scale(xScale);


        chart.append('g')
            .classed('x axis', true)
            .attr('transform', `translate(0,${height})`)
            .call(xAxis);

        chart.select('.y.axis')
            .append('text')
            .attr('x', 10)
            .attr('y', yScale(d3.max(data, d => d.value)))
            // .attr('transform', `translate(-50, ${height / 3}), rotate(-90)`)
            .attr('fill', '#000')
            .style('font-size', '20px')
            .style('text-anchor', 'middle')
            .text('Number of events per stream');

        chart.append("text")
            .attr("id", "a")
            .attr('x', 60)
            .attr('y', -20)
            .attr('fill', '#000')
            .style('font-size', '20px')
            .style('text-anchor', 'middle')
            .text('Number of events per stream');
        chart.append("text")
            .attr("id", "a")
            .attr('x', width - 70)
            .attr('y', height + 40)
            .attr('fill', '#000')
            .style('font-size', '20px')
            .style('text-anchor', 'middle')
            .text('Streams');
    }

    render() {
        const {
            width, height,
            mounted,
            chart,
        } = this.state
        console.log({ chart })
        return (
            <div id='chart_container' className={styles.container}>
                {mounted && chart}
            </div>
        )
    }
}

export default AssetSummaryGraph;
