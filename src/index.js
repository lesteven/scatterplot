//import * as d3 from 'd3';
import {
	selectAll,
	select,
	selection,
	html} from 'd3-selection';
import {timeParse} from 'd3-time-format';
import {scaleTime,scaleLinear} from 'd3-scale';
import {range,extent,max} from 'd3-array';
import {axisBottom,axisLeft} from 'd3-axis';
import {transition} from 'd3-transition';
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
	const margin ={top:20,bottom:50,left:50,right:50}
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
	let lead = data.slice(0,1)
	lead = lead[0].Seconds

	data.forEach(function(d){
		d.Seconds -= lead
	})

	//set domain
	const xDomain = extent(data,d=>{return d.Seconds})
	xScale.domain(swap(xDomain))
	
	const yDomain = extent(data,d=>{return d.Place})
	yScale.domain(swap(yDomain))
	
	//shows data on mousehover
	let div = select("body").append("div")
		.attr("class","tooltip")
		.style("opacity",0);

	//add dots
	svg.selectAll('dot')
		.data(data)
		.enter().append('circle')
			.attr('r',4)
			.attr('cx',d=> {return xScale(d.Seconds)})
			.attr('cy',d=>{return yScale(d.Place)})
			.style("fill",function(d){
				if(d.Doping !== ""){
					return "#990000"
				}
				else{
					return "#004c4c"
				}
			})
			.on("mouseover",function(d){
				div.transition()
					.duration(200)
					.style("opacity",.9)
				div.html(d.Name + ": " + d.Nationality +"</br>"+
						"Year: " + d.Year + ", "+
						"Time: " + d.Time + "</br>"+ "</br>" +
						d.Doping)
					.style("left",(event.pageX-80)+"px")
					.style("top",(event.pageY+50)+"px")
				
			})
			.on("mouseout",function(d){
				div.transition()
					.duration(500)
					.style("opacity",0)
			})

	//add x and y axis
	svg.append('g')
		.attr('class','x-axis')
		.attr('transform','translate(0,'+ innerHeight +')')
		.call(axisBottom(xScale));

	svg.append('g')
		.attr('class','x-axis')
		.call(axisLeft(yScale));

	getDescription(svg)
	addLegend(svg)
}

function swap(x){
	let temp = x[1];
	x[1] = x[0];
	x[0] = temp;
	return x
}
function getDescription(svg){
	svg.append("text")
		.attr("class","description")
		.attr("x","33%")
		.attr("y","95%")
		.text("Seconds Behind Fastest Time")
	svg.append("text")
		.attr("class","yAxis-des")
		.attr("transform","translate(-28,50) rotate(-90)")
		.text("Ranking")
}
function addLegend(svg){
	let legend = svg.append('g')
		.attr("class","legend")
		.attr("transform","translate(650,300)")
	legend.append("circle")
		.attr('r',4)
		.style("fill","#990000")
		.attr("cx","0%")
		.attr("cy","0%")
	legend.append("text")
		.attr("x","1%")
		.attr("y","1%")
		.text("With doping allegations")
	legend.append("circle")
		.attr('r',4)
		.style("fill","#004c4c")
		.attr("cx","0%")
		.attr("cy","5%")
	legend.append("text")
		.attr("x","1%")
		.attr("y","6%")
		.text("No doping allegations")
}