"use strict"

/* Configuration variables: drawing */
let svgWidth = 600;
let svgHeight = 400;
let margin = 75;
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
    //Sleep time is measured in hours. Mood (1-5): 1 = bad, 5 = best.Energy drinks are recorded six hours before bedtime.
    {SleepHours: 11,MorningMood:5 ,EnergyDrink:0} ,//2025-9-25
    {SleepHours: 9,MorningMood:4,EnergyDrink:1} ,//2025-10-4
    {SleepHours:10,MorningMood:4,EnergyDrink:1},//2025-10-5
    {SleepHours:11,MorningMood:4,EnergyDrink:3},//2025-10-8
    {SleepHours:10,MorningMood:2,EnergyDrink:0},//2025-10-10
    {SleepHours:6,MorningMood:2,EnergyDrink:1},//2025-10-11
    {SleepHours:10,MorningMood:4,EnergyDrink:0},//2025-10-13
    {SleepHours:10,MorningMood:5,EnergyDrink:2},//2025-10-15
    {SleepHours:10,MorningMood:5,EnergyDrink:0},//2025-10-16
    {SleepHours:12,MorningMood:2,EnergyDrink:1},//2025-10-18
    {SleepHours:10,MorningMood:4,EnergyDrink:0},//2025-10-20
    {SleepHours:10,MorningMood:3,EnergyDrink:1},//2025-10-22
    {SleepHours:7,MorningMood:2,EnergyDrink:2},//2025-10-23
    {SleepHours:12,MorningMood:5,EnergyDrink:0},//2025-10-24
    {SleepHours:9,MorningMood:3,EnergyDrink:2},//2025-10-26
    {SleepHours:9,MorningMood:4,EnergyDrink:1},//2025-10-27


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
.attr("r",5)
.attr("cx",function(d){return xScale(d.SleepHours);})
.attr("cy",function(d){return yScale(d.MorningMood)})
.attr("opacity", .5)
.attr("fill",function(d){
    if (d.EnergyDrink == 0){
        return "green";
    }if(d.EnergyDrink == 1){
        return "blue";
    }
    if(d.EnergyDrink == 2){
        return "yellow";
    }
    if(d.EnergyDrink == 3){
        return "purple";
    }
    if(d.EnergyDrink == 4){

        return "red";
    };
    return "black";
});

for(let i = 0; i<=4; i++){
    svg.append("circle")
    .attr("r",5)
    .attr("cx",margin + 10)
    .attr("cy",margin + 12 + i * 15)
    .attr("fill",DrinkColors[i])

svg.append("text")
.attr("text-anchor", "start")
.attr("dominant-baseline", "middle")
.attr("x",margin+20)
.attr("y",margin + 12+ i * 15)
.text("Drink cup#" + i);
}

for (let i = 1; i <= 12; i++) {
  let x = xScale(i);
  svg.append("text")
    .attr("x", x)
    .attr("y", svgHeight - margin + 14)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .text(i + " h");
}

for (let i = 1; i<=5; i++){
    let y = yScale(i);
    svg.append("text")
    .attr("y",y)
    .attr("x",margin - 10)
    .attr("text-anchor", "end")
    .attr("dominant-baseline", "middle")
    .text(i);
}

/**** label the axes ****/
let xAxisLabel = svg.append("text")
    .attr("x", svgWidth / 2)
    .attr("y", svgHeight - (margin / 5))
    .attr("text-anchor", "middle")
    .text("Sleep Hours (hours)");

let yAxisLabel = svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -svgHeight / 2)
    .attr("y", margin / 2)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .text("Morning Mood (1=bad, 5=best)");
    

