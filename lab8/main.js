"use strict"

/* Configuration variables: drawing */
let svgWidth = 800;
let svgHeight = 600;

let marginLeft = 100;
let marginRight = 170;
let marginTop = 60;
let marginBottom = 80;

let DrinkColors = ["green","blue","yellow","purple","red"]

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



let dataset = [
    //Sleep time is measured in hours. Mood (1-5): 1 = bad, 5 = best.Energy drinks are recorded six hours before bedtime.Sleep quality (1-10) 1=bad 10=good
    {SleepHours: 11,MorningMood:5 ,EnergyDrink:0, SleepQuality: 10} ,//2025-9-25
    {SleepHours: 9, MorningMood:4, EnergyDrink:1, SleepQuality: 7} ,//2025-10-4
    {SleepHours:10, MorningMood:4, EnergyDrink:1, SleepQuality: 10},//2025-10-5
    {SleepHours:11, MorningMood:4, EnergyDrink:3, SleepQuality: 9},//2025-10-8
    {SleepHours:10, MorningMood:2, EnergyDrink:0, SleepQuality: 5},//2025-10-10
    {SleepHours:6,  MorningMood:2, EnergyDrink:1, SleepQuality: 3},//2025-10-11
    {SleepHours:10, MorningMood:4, EnergyDrink:0, SleepQuality: 9},//2025-10-13
    {SleepHours:10, MorningMood:5, EnergyDrink:2, SleepQuality: 9},//2025-10-15
    {SleepHours:10, MorningMood:5, EnergyDrink:0, SleepQuality: 10},//2025-10-16
    {SleepHours:12, MorningMood:2, EnergyDrink:1, SleepQuality: 5},//2025-10-18
    {SleepHours:10, MorningMood:4, EnergyDrink:0, SleepQuality: 9},//2025-10-20
    {SleepHours:10, MorningMood:3, EnergyDrink:1, SleepQuality: 5},//2025-10-22
    {SleepHours:7,  MorningMood:2, EnergyDrink:2, SleepQuality: 5},//2025-10-23
    {SleepHours:12, MorningMood:5, EnergyDrink:0, SleepQuality: 10},//2025-10-24
    {SleepHours:9,  MorningMood:3, EnergyDrink:2, SleepQuality: 6},//2025-10-26
    {SleepHours:9,  MorningMood:4, EnergyDrink:1, SleepQuality: 5},//2025-10-27


];
// Draw larger bubbles first so smaller ones are on top (reduces occlusion).
dataset.sort(function(a, b) {
    return b.SleepHours - a.SleepHours;
});
// Scales: map data values to pixel positions/sizes
let xScale = d3.scaleLinear()
    .domain([0, 4])
    .range([marginLeft + 50, svgWidth - marginRight - 50]);

let yScale = d3.scaleLinear()
    .domain([1, 5])
    .range([svgHeight - marginBottom, marginTop]);

let rScale = d3.scaleLinear()
    .domain([1,12])
    .range([1,12])

svg.append("line")
    .attr("x1", xScale(0) - 50)
    .attr("y1", svgHeight - marginBottom)
    .attr("x2", xScale(4) + 50)
    .attr("y2", svgHeight - marginBottom)
    .attr("stroke", "black")
    .attr("stroke-width", 2)

svg.append("line")
    .attr("x1", marginLeft)
    .attr("y1", yScale(1))
    .attr("x2", marginLeft)
    .attr("y2", yScale(5))
    .attr("stroke", "black")
    .attr("stroke-width", 2)

let circle =svg.selectAll("circle")
    .data(dataset)
    .join("circle");

circle
    .attr("cx", function(d) { return xScale(d.EnergyDrink); })
    .attr("cy", function(d) { return yScale(d.MorningMood); })
    .attr("r", function(d) { return rScale(d.SleepHours); })
    .attr("opacity", 0.6)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("fill", function(d) {
        if (d.SleepQuality <= 4){
            return "red";
        } else if (d.SleepQuality <= 7) {
            return "yellow";
        } else {
            return "green";
        }
    });

/**** label the axes ****/
let xAxisLabel = svg.append("text")
    .attr("x", svgWidth / 2)
    .attr("y", svgHeight - (marginBottom / 3))
    .attr("text-anchor", "middle")
    .text("Energy Drinks (cups)");

let yAxisLabel = svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -svgHeight / 2)
    .attr("y", marginLeft / 2)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .text("Morning Mood (1=bad, 5=best)");
    

// X min: "0 cup"
svg.append("text")
    .attr("x", xScale(0))
    .attr("y", svgHeight - marginBottom + 20)
    .attr("text-anchor", "middle")
    .text("0");

// X max: "4 cups"
svg.append("text")
    .attr("x", xScale(4))
    .attr("y", svgHeight - marginBottom + 20)
    .attr("text-anchor", "middle")
    .text("4")

// Y max: "5 (best)"
svg.append("text")
    .attr("x", marginLeft - 10)
    .attr("y", yScale(5))
    .attr("text-anchor", "end")
    .attr("alignment-baseline", "middle")
    .text("5 (best)")

// Y min："1 (bad)
svg.append("text")
    .attr("x", marginLeft - 10)
    .attr("y", yScale(1))
    .attr("text-anchor", "end")
    .attr("dominant-baseline", "middle")
    .text("1 (bad)");

let sizeKeyX = svgWidth - marginRight + 20;
let sizeKeyY = marginTop;


svg.append("text")
    .attr("x", sizeKeyX)
    .attr("y", sizeKeyY + 5)
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("Sleep Hours")

let sizeKeyValues = [4, 8, 12];

for (let i = 0; i < sizeKeyValues.length; i++) {
    let currentValue = sizeKeyValues[i];
    let yPosition = sizeKeyY + 30 + (i * 35);

    svg.append("circle")
        .attr("cx", sizeKeyX + 20)
        .attr("cy", yPosition)
        .attr("r", rScale(currentValue))
        .attr("fill", "gray")
        .attr("stroke", "black")
        .attr("opacity", 0.6)

    svg.append("text")
        .attr("x", sizeKeyX + 45)
        .attr("y", yPosition)
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "middle")
        .text(currentValue + " hours");
    
}


let colorKeyX = svgWidth - marginRight + 20;
let colorKeyY = sizeKeyY + 160;


svg.append("text")
    .attr("x", colorKeyX)
    .attr("y", colorKeyY + 5)
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("Sleep Quality")

let colorKeyData = [
    {color: "red", label: "Poor (1-4)"},
    {color: "yellow", label: "Moderate (5-7)"},
    {color: "green", label: "Good (8-10)"}
];

for (let i = 0; i < colorKeyData.length; i++) {

    let yPosition = colorKeyY + 25 + (i * 25);

    svg.append("circle")
        .attr("cx", colorKeyX + 10)
        .attr("cy", yPosition)
        .attr("r", 8)
        .attr("fill", colorKeyData[i].color)
        .attr("stroke", "black")
        .attr("opacity", 0.6);

    svg.append("text")
        .attr("x", colorKeyX + 25)
        .attr("y", yPosition)
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "middle")
        .text(colorKeyData[i].label);
    
}



