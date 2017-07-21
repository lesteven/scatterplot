//import * as d3 from 'd3';
import {
	selectAll,
	select,
	selection} from 'd3-selection';
import {timeParse} from 'd3-time-format';
import {scaleTime,scaleLinear} from 'd3-scale';
import {range,extent,max} from 'd3-array';
import {axisBottom,axisLeft} from 'd3-axis';
require('./index.css');


const url ='https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
getData(url)


function getData(url){
	fetch(url)
	.then(response=>response.json())
	.then(data=>{
		//console.log(data)
		drawGraph(data)
	})
}
function drawGraph(data){
	//variable holding svg attributes
	const margin ={top:50,bottom:50,left:50,right:50}
	const width = 950;
	const height = 450;
	const innerHeight = height - margin.top - margin.bottom;
	const innerWidth = width - margin.left - margin.right;

	//creates svg
	let svg = select("body")
		.append("svg")
		.attr("width",width)
		.attr("height",height)
		.attr("class","graph")
		.append('g').attr('transform','translate('
			+ margin.left + ',' + margin.top + ')');

	//parse date for x-axis
	let parseTime = timeParse('%M:%S');


	//set ranges
	let xScale = scaleLinear()
		.range([0,innerWidth]);

	let yScale = scaleLinear()
		.range([innerHeight,0]);

	//format data
	/*
	data.forEach(function(d){
		d.Time = parseTime(d.Time)
	})*/

	//set domain
	
	const xDomain = extent(data,d=>{return d.Seconds})
	xScale.domain(swap(xDomain))
	

	const yDomain = extent(data,d=>{return d.Place})
	yScale.domain(swap(yDomain))
	
	//console.log(yScale.domain(),xScale.domain())

	//add dots
	svg.selectAll('dot')
		.data(data)
		.enter().append('circle')
			.attr('r',4)
			.attr('cx',d=> {return xScale(d.Seconds)})
			.attr('cy',d=>{return yScale(d.Place)})

	//add x and y axis
	svg.append('g')
		.attr('class','x-axis')
		.attr('transform','translate(0,'+ innerHeight +')')
		.call(axisBottom(xScale));

	svg.append('g')
		.attr('class','x-axis')
		.call(axisLeft(yScale));
}

function swap(x){
	let temp = x[1];
	x[1] = x[0];
	x[0] = temp;
	return x
}