"use strict"

/* Configuration variables: drawing */
let svgWidth = 600;
let svgHeight = 400;
let margin = 75;

/* Resize  div to match width of visualization. */
d3.select("#container")
    .style("width", String(svgWidth) + "px");

/* Create drawing canvas */
let svg = d3.select("#canvas")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

/* Draw canvas border */
svg.append("rect")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

/* Draw margin border. */
svg.append("rect")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-dasharray", "5")
    .attr("x", margin)
    .attr("y", margin)
    .attr("width", svgWidth - margin * 2)
    .attr("height", svgHeight - margin * 2);

let dataset = [
    //Sleep time is measured in hours. Mood (1-5): 1 = bad, 5 = best
    {SleepHours: 11,MorningMood:5 } ,//2025-9-25
    {SleepHours: 9,MorningMood:4} ,//2025-10-4
    {SleepHours:10,MorningMood:4},//2025-10-5
    {SleepHours:11,MorningMood:4},//2025-10-8
    {SleepHours:10,MorningMood:2},//2025-10-10
    {SleepHours:6,MorningMood:2},//2025-10-11
    {SleepHours:10,MorningMood:4},//2025-10-13
    {SleepHours:10,MorningMood:5},//2025-10-15
    {SleepHours:10,MorningMood:5},//2025-10-16
    {SleepHours:12,MorningMood:2},//2025-10-18
    {SleepHours:10,MorningMood:4},//2025-10-20
    {SleepHours:10,MorningMood:3},//2025-10-22
    {SleepHours:7,MorningMood:2},//2025-10-23
    {SleepHours:12,MorningMood:5},//2025-10-24
    {SleepHours:9,MorningMood:3},//2025-10-26
    {SleepHours:9,MorningMood:4},//2025-10-27


];

let xScale = d3.scaleLinear()
    .domain([1, 12])
    .range([margin, svgWidth - margin]);

let yScale = d3.scaleLinear()
    .domain([1, 5])
    .range([svgHeight - margin, margin]);


let circle =svg.selectAll("circle")
.data(dataset)
.join("circle");

circle
.attr("r",3)
.attr("fill","black")
.attr("cx",function(d){return xScale(d.SleepHours);})
.attr("cy",function(d){return yScale(d.MorningMood)});

/**** label the axes ****/
let xAxisLabel = svg.append("text")
    .attr("x", svgWidth / 2)
    .attr("y", svgHeight - (margin / 2))
    .attr("text-anchor", "middle")
    .text("Sleep Hours (hours)");

let yAxisLabel = svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -svgHeight / 2)
    .attr("y", margin / 2)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .text("Morning Mood (1=bad, 5=best)");
    
// X min: "1 h"
    svg.append("text")
  .attr("x", xScale(1))
  .attr("y", svgHeight - margin + 24)
  .attr("text-anchor", "middle")
  .text("1 h");

  //X max: "12 h"
    svg.append("text")
    .attr("x",xScale(12))
    .attr("y",svgHeight-margin + 24)
    .attr("text-anchor", "middle")
    .text("12 h")

    // Y max: "5 (mood)"
    svg.append("text")
    .attr("x",margin - 5)
    .attr("y",yScale(5))
    .attr("text-anchor", "end")
    .attr("alignment-baseline", "middle")
    .text("5 (mood)")
    // Y max："1 (mood)
    svg.append("text")
  .attr("x", margin - 5)
  .attr("y", yScale(1))
  .attr("text-anchor", "end")
  .attr("dominant-baseline", "middle")
  .text("1 (mood)");

