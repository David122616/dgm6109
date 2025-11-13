// Code structure adapted from Lab 8 starter files and class examples
// D3.js v7.6.1 - https://d3js.org/
// Color scale technique from Week 6 lecture on continuous scales

"use strict";

// Canvas dimensions
let svgWidth = 800;
let svgHeight = 600;
let margin = { left: 100, right: 170, top: 60, bottom: 80 };

// Setup container and SVG
d3.select("#container").style("width", svgWidth + "px");

let svg = d3.select("#canvas")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

svg.append("rect")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Original dataset
let rawData = [
    {SleepHours: 11, AfternoonEnergy: 4, EnergyDrink: 0, SleepQuality: 10},
    {SleepHours: 9, AfternoonEnergy: 5, EnergyDrink: 1, SleepQuality: 7},
    {SleepHours: 10, AfternoonEnergy: 3, EnergyDrink: 1, SleepQuality: 10},
    {SleepHours: 11, AfternoonEnergy: 5, EnergyDrink: 3, SleepQuality: 9},
    {SleepHours: 10, AfternoonEnergy: 3, EnergyDrink: 0, SleepQuality: 5},
    {SleepHours: 6, AfternoonEnergy: 2, EnergyDrink: 1, SleepQuality: 3},
    {SleepHours: 10, AfternoonEnergy: 3, EnergyDrink: 0, SleepQuality: 9},
    {SleepHours: 10, AfternoonEnergy: 4, EnergyDrink: 2, SleepQuality: 9},
    {SleepHours: 10, AfternoonEnergy: 5, EnergyDrink: 0, SleepQuality: 10},
    {SleepHours: 12, AfternoonEnergy: 3, EnergyDrink: 1, SleepQuality: 5},
    {SleepHours: 10, AfternoonEnergy: 3, EnergyDrink: 0, SleepQuality: 9},
    {SleepHours: 10, AfternoonEnergy: 2, EnergyDrink: 1, SleepQuality: 5},
    {SleepHours: 7, AfternoonEnergy: 2, EnergyDrink: 2, SleepQuality: 5},
    {SleepHours: 12, AfternoonEnergy: 5, EnergyDrink: 0, SleepQuality: 10},
    {SleepHours: 9, AfternoonEnergy: 3, EnergyDrink: 2, SleepQuality: 6},
    {SleepHours: 9, AfternoonEnergy: 3, EnergyDrink: 1, SleepQuality: 5},
    {SleepHours: 8, AfternoonEnergy: 4, EnergyDrink: 0, SleepQuality: 8},
    {SleepHours: 12, AfternoonEnergy: 5, EnergyDrink: 0, SleepQuality: 9},
    {SleepHours: 7, AfternoonEnergy: 2, EnergyDrink: 3, SleepQuality: 4},
    {SleepHours: 7, AfternoonEnergy: 2, EnergyDrink: 3, SleepQuality: 3}
];

// Array.filter(): Focus on adequate sleep (8+ hours) to isolate energy drink effects
// This removes sleep deprivation as a confounding variable
let dataset = rawData.filter(d => d.SleepHours >= 8);

// Array.sort(): Sort by sleep hours (low to high)
// Creates a gradient effect where longer sleep appears on top
dataset.sort((a, b) => a.SleepHours - b.SleepHours);

// Scales
let xScale = d3.scaleLinear()
    .domain([0, 3])
    .range([margin.left + 40, svgWidth - margin.right - 40]);

let yScale = d3.scaleLinear()
    .domain([1, 10])
    .range([svgHeight - margin.bottom, margin.top]);

let rScale = d3.scaleLinear()
    .domain([6, 12])
    .range([8, 20]);

// Color scale for afternoon energy (continuous)
let colorScale = d3.scaleSequential()
    .domain([1, 5])
    .interpolator(d3.interpolateRdYlGn); // Red (low) to Green (high)

// Axes
svg.append("line")
    .attr("x1", margin.left)
    .attr("y1", svgHeight - margin.bottom)
    .attr("x2", svgWidth - margin.right)
    .attr("y2", svgHeight - margin.bottom)
    .attr("stroke", "black")
    .attr("stroke-width", 2);

svg.append("line")
    .attr("x1", margin.left)
    .attr("y1", margin.top)
    .attr("x2", margin.left)
    .attr("y2", svgHeight - margin.bottom)
    .attr("stroke", "black")
    .attr("stroke-width", 2);

// Data points
svg.selectAll("circle.datapoint")
    .data(dataset)
    .join("circle")
    .attr("class", "datapoint")
    .attr("cx", d => xScale(d.EnergyDrink))
    .attr("cy", d => yScale(d.SleepQuality))
    .attr("r", d => rScale(d.SleepHours))
    .attr("opacity", 0.65)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("fill", d => colorScale(d.AfternoonEnergy));

// Axis labels
svg.append("text")
    .attr("x", svgWidth / 2)
    .attr("y", svgHeight - margin.bottom / 3)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Energy Drinks (cups, within 6h before bed)");

svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -svgHeight / 2)
    .attr("y", margin.left / 3)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Sleep Quality (1=poor, 10=excellent)");

// X-axis ticks
for (let i = 0; i <= 3; i++) {
    svg.append("text")
        .attr("x", xScale(i))
        .attr("y", svgHeight - margin.bottom + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text(i);
}

// Y-axis ticks
for (let i = 2; i <= 10; i += 2) {
    svg.append("text")
        .attr("x", margin.left - 10)
        .attr("y", yScale(i))
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "middle")
        .style("font-size", "12px")
        .text(i);
}

// Size legend
let sizeKeyX = svgWidth - margin.right + 20;
let sizeKeyY = margin.top;

svg.append("text")
    .attr("x", sizeKeyX)
    .attr("y", sizeKeyY)
    .attr("font-weight", "bold")
    .style("font-size", "12px")
    .text("Sleep Hours");

[{val: 8, label: "8h"}, {val: 10, label: "10h"}, {val: 12, label: "12h"}].forEach((item, i) => {
    const y = sizeKeyY + 30 + i * 40;
    
    svg.append("circle")
        .attr("cx", sizeKeyX + 20)
        .attr("cy", y)
        .attr("r", rScale(item.val))
        .attr("fill", "gray")
        .attr("opacity", 0.65)
        .attr("stroke", "black");
    
    svg.append("text")
        .attr("x", sizeKeyX + 50)
        .attr("y", y)
        .attr("dominant-baseline", "middle")
        .style("font-size", "11px")
        .text(item.label);
});

// Color legend
let colorKeyY = sizeKeyY + 160;

svg.append("text")
    .attr("x", sizeKeyX)
    .attr("y", colorKeyY)
    .attr("font-weight", "bold")
    .style("font-size", "12px")
    .text("Afternoon Energy");

// Create color gradient legend
let gradientHeight = 100;
let gradientWidth = 20;

// Define gradient
let defs = svg.append("defs");
let gradient = defs.append("linearGradient")
    .attr("id", "energy-gradient")
    .attr("x1", "0%")
    .attr("y1", "100%")
    .attr("x2", "0%")
    .attr("y2", "0%");

gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", colorScale(1));

gradient.append("stop")
    .attr("offset", "50%")
    .attr("stop-color", colorScale(3));

gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", colorScale(5));

// Draw gradient rectangle
svg.append("rect")
    .attr("x", sizeKeyX)
    .attr("y", colorKeyY + 15)
    .attr("width", gradientWidth)
    .attr("height", gradientHeight)
    .style("fill", "url(#energy-gradient)")
    .attr("stroke", "black");

// Gradient labels
svg.append("text")
    .attr("x", sizeKeyX + gradientWidth + 5)
    .attr("y", colorKeyY + 15)
    .attr("dominant-baseline", "hanging")
    .style("font-size", "11px")
    .text("5 (high)");

svg.append("text")
    .attr("x", sizeKeyX + gradientWidth + 5)
    .attr("y", colorKeyY + 15 + gradientHeight / 2)
    .attr("dominant-baseline", "middle")
    .style("font-size", "11px")
    .text("3");

svg.append("text")
    .attr("x", sizeKeyX + gradientWidth + 5)
    .attr("y", colorKeyY + 15 + gradientHeight)
    .attr("dominant-baseline", "baseline")
    .style("font-size", "11px")
    .text("1 (low)");
