"use strict"
let svgWidth = 800;
let svgHeight = 600;

let marginLeft = 100;
let marginRight = 170;
let marginTop = 60;
let marginBottom = 80;
let DrinkColors = ["blue","yellow","red","pink","black"];

d3.select("#container")
    .style("width", String(svgWidth) + "px");

    let svg = d3.select("#canvas")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    svg.append("rect")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    let dataset = [
    //Sleep time is measured in hours. AfternoonEnergy (1-5): 1 = bad, 5 = best.Energy drinks are recorded six hours before bedtime.Sleep quality (1-10) 1=bad 10=good
    {SleepHours: 11,AfternoonEnergy:4 ,EnergyDrink:0, SleepQuality: 10} ,//2025-9-25
    {SleepHours: 9, AfternoonEnergy:5, EnergyDrink:1, SleepQuality: 7} ,//2025-10-4
    {SleepHours:10, AfternoonEnergy:3, EnergyDrink:1, SleepQuality: 10},//2025-10-5
    {SleepHours:11, AfternoonEnergy:5, EnergyDrink:3, SleepQuality: 9},//2025-10-8
    {SleepHours:10, AfternoonEnergy:3, EnergyDrink:0, SleepQuality: 5},//2025-10-10
    {SleepHours:6,  AfternoonEnergy:2, EnergyDrink:1, SleepQuality: 3},//2025-10-11
    {SleepHours:10, AfternoonEnergy:3, EnergyDrink:0, SleepQuality: 9},//2025-10-13
    {SleepHours:10, AfternoonEnergy:4, EnergyDrink:2, SleepQuality: 9},//2025-10-15
    {SleepHours:10, AfternoonEnergy:5, EnergyDrink:0, SleepQuality: 10},//2025-10-16
    {SleepHours:12, AfternoonEnergy:3, EnergyDrink:1, SleepQuality: 5},//2025-10-18
    {SleepHours:10, AfternoonEnergy:3, EnergyDrink:0, SleepQuality: 9},//2025-10-20
    {SleepHours:10, AfternoonEnergy:2, EnergyDrink:1, SleepQuality: 5},//2025-10-22
    {SleepHours:7,  AfternoonEnergy:2, EnergyDrink:2, SleepQuality: 5},//2025-10-23
    {SleepHours:12, AfternoonEnergy:5, EnergyDrink:0, SleepQuality: 10},//2025-10-24
    {SleepHours:9,  AfternoonEnergy:3, EnergyDrink:2, SleepQuality: 6},//2025-10-26
    {SleepHours:9,  AfternoonEnergy:3, EnergyDrink:1, SleepQuality: 5},//2025-10-27
    {SleepHours:8,  AfternoonEnergy:4, EnergyDrink:0, SleepQuality: 8},//2025-10-28
    {SleepHours:12,  AfternoonEnergy:5, EnergyDrink:0, SleepQuality: 9},//2025-10-29
    {SleepHours:7,  AfternoonEnergy:2, EnergyDrink:3, SleepQuality: 4},//2025-11-2
    {SleepHours:7,  AfternoonEnergy:2, EnergyDrink:3, SleepQuality: 3},//2025-11-12


];

let SleepHoursMin = d3.min(dataset,function(value){
    return value.SleepHours
});
let SleepHoursMax = d3.max(dataset,function(value){
    return value.SleepHours
});

dataset.sort(function(a, b) {
    return b.SleepQuality - a.SleepQuality;
});

let xScale = d3.scaleLinear()
    .domain([1, 12])
    .range([marginLeft + 50, svgWidth - marginRight - 50]);

let yScale = d3.scaleLinear()
    .domain([1, 5])
    .range([svgHeight - marginBottom, marginTop]);

let rScale = d3.scaleLinear()
    .domain([1,10])
    .range([6,24])

    svg.append("line")
    .attr("x1", marginLeft)
    .attr("y1", svgHeight - marginBottom)
    .attr("x2", svgWidth - marginRight)
    .attr("y2", svgHeight - marginBottom)
    .attr("stroke", "black")
    .attr("stroke-width", 2)

svg.append("line")
    .attr("x1", marginLeft)
    .attr("y1", marginTop)
    .attr("x2", marginLeft)
    .attr("y2", svgHeight - marginBottom)
    .attr("stroke", "black")
    .attr("stroke-width", 2)

let circle =svg.selectAll("circle")
    .data(dataset)
    .join("circle");

    circle
    .attr("cx", function(d) { return xScale(d.SleepHours); })
    .attr("cy", function(d) { return yScale(d.AfternoonEnergy); })
    .attr("r", function(d) { return rScale(d.SleepQuality); })
    .attr("opacity", 0.6)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("fill",function(d){
    if (d.EnergyDrink == 0){
        return "blue";;
    }if(d.EnergyDrink == 1){
        return "yellow";
    }
    if(d.EnergyDrink == 2){
        return "red";
    }
    if(d.EnergyDrink == 3){
        return "pink";
    };
    return "black";
});

let xAxisLabel = svg.append("text")
    .attr("x", svgWidth / 2)
    .attr("y", svgHeight - (marginBottom / 3))
    .attr("text-anchor", "middle")
    .text("Sleep Hours (h)");

let yAxisLabel = svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -svgHeight / 2)
    .attr("y", marginLeft / 2)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .text("Afternoon Energy(1-5) 1=bad5=good");

    for(let i = 0; i<=3; i++){
    svg.append("circle")
    .attr("r",5)
    .attr("cx", marginLeft + 10)
    .attr("cy", marginTop + 12 + i * 15)
    .attr("fill",DrinkColors[i])

svg.append("text")
.attr("text-anchor", "start")
.attr("dominant-baseline", "middle")
.attr("x", marginLeft + 20)
.attr("y", marginTop + 12 + i * 15)
.text("Drink cup#" + i);
}

for (let i = 1; i <= 12; i++) {
  let x = xScale(i);
  svg.append("text")
    .attr("x", x)
    .attr("y", svgHeight - marginBottom + 14)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .text(i);
}

for (let i = 1; i<=5; i++){
    let y = yScale(i);
    svg.append("text")
    .attr("y",y)
    .attr("x", marginLeft - 10)
    .attr("text-anchor", "end")
    .attr("dominant-baseline", "middle")
    .text(i);
}

let sizeKeyX = svgWidth - marginRight + 20;
let sizeKeyY = marginTop;


svg.append("text")
    .attr("x", sizeKeyX)
    .attr("y", sizeKeyY + 5)
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("Sleep Quality (1-10)")

    
    let sizeKeyValues = [3, 6, 9];
    let sizeKeyLabels = ["1–4", "5–7", "8–10"];

for (let i = 0; i < sizeKeyValues.length; i++) {
    let currentValue = sizeKeyValues[i];
    let yPosition = sizeKeyY + 30 + (i * 40);

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
        .text(sizeKeyLabels[i]);
    
}

let colorKeyX = svgWidth - marginRight + 20;
let colorKeyY = sizeKeyY + 160;


svg.append("text")
    .attr("x", colorKeyX)
    .attr("y", colorKeyY + 5)
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("Energy Drink")

let colorKeyData = [
    {color: "blue", label: "= 0"},
    {color: "yellow", label: "= 1"},
    {color: "red", label: "= 2"},
    {color:"pink", label:"= 3"},
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