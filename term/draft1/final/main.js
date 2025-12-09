"use strict"
let svgWidth = 800;
let svgHeight = 600;

let marginLeft = 100;
let marginRight = 170;
let marginTop = 60;
let marginBottom = 80;

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

let data;

(async function () {
    data = await d3.json("data.json");
    buildVisualization(data);
})();

/***function bulidVisualization(dataset) 
 * 
 * Description:
 * Creates a scatter plot visualization showing the relationship between 
 *  Sleep Hours (x-axis) and Morning Mood (y-axis). Each circle's size 
 *  represents Sleep Quality, and each circle's color represents Energy 
 *  Drink intake. The function also draws custom axes, numeric tick labels, 
 *  and legend keys for both size and color.
 * 
 * 
 * Parameters:
 * dataset(array <Object>):
 * An array of data objects. Each object contains:
 * SleepHours   – hours of sleep for that day
 * MorningMood  – self-reported mood in the morning (1–5), 1=bad 5=good
 * EnergyDrink  – number of energy drinks consumed (0–3)
 * SleepQuality – self-reported sleep quality (1–10), 1=poor 10=excellent
 * 
 * returns: Nothing. This function does not return a value; 
 * instead, it draws the visualization directly onto the global SVG as a side effect.
 * 
 * Global variables used:
 * svg: main SVG drawing area created at the top of the file.
 * svgWidth: width of the SVG in pixels
 * svgHeight: height of the SVG in pixels
 * marginLeft, marginRight, marginTop, marginBottom :margin values used to position axes, points, and legend elements.
 * 
*/
function buildVisualization(dataset) {

    // Find min and max Sleep Hours for x-axis domain
let SleepHoursMin = d3.min(dataset,function(value){
    return value.SleepHours
});
let SleepHoursMax = d3.max(dataset,function(value){
    return value.SleepHours
});

// Find min and max Morning Mood for y-axis domain
let moodMin = d3.min(dataset, function(d) { 
    return d.MorningMood; });
let moodMax = d3.max(dataset, function(d) { 
    return d.MorningMood; });


// Sort data so points with higher Sleep Quality (larger radius) are drawn first,
// preventing smaller circles from being hidden behind bigger ones.
dataset.sort(function(a, b) {
    return b.SleepQuality - a.SleepQuality;
});

// Create a linear x-scale mapping Sleep Hours to horizontal pixel positions.
let xScale = d3.scaleLinear()
    .domain([SleepHoursMin, SleepHoursMax])
    .range([marginLeft + 50, svgWidth - marginRight - 50]);
// Create a linear y-scale mapping Morning Mood to vertical pixel positions.
let yScale = d3.scaleLinear()
    .domain([moodMin, moodMax])
    .range([svgHeight - marginBottom, marginTop]);
// Create a linear radius scale mapping Sleep Quality to circle radii.
let rScale = d3.scaleLinear()
    .domain([1,10])
    .range([6,24])

// Draw the x-axis line along the bottom of the plotting area.
svg.append("line")
    .attr("x1", marginLeft)
    .attr("y1", svgHeight - marginBottom)
    .attr("x2", svgWidth - marginRight)
    .attr("y2", svgHeight - marginBottom)
    .attr("stroke", "black")
    .attr("stroke-width", 2)

// Draw the y-axis line along the left side of the plotting area.
svg.append("line")
    .attr("x1", marginLeft)
    .attr("y1", marginTop)
    .attr("x2", marginLeft)
    .attr("y2", svgHeight - marginBottom)
    .attr("stroke", "black")
    .attr("stroke-width", 2)

// Bind the dataset to circle elements and create one circle per data point.
let circle =svg.selectAll("circle")
    .data(dataset)
    .join("circle");

// Set circle position, size, and color based on the encoded data values.
// cx, cy → plot position from Sleep Hours (x) and Morning Mood (y)
// r      → circle radius based on Sleep Quality (1–10)
// fill   → color determined by Energy Drink intake (0–3)
    circle
    .attr("cx", function(d) { return xScale(d.SleepHours); })
    .attr("cy", function(d) { return yScale(d.MorningMood); })
    .attr("r", function(d) { return rScale(d.SleepQuality); })
    .attr("opacity", 0.6)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("fill",function(d){
    if (d.EnergyDrink == 0){
        return "blue";
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

// Add the x-axis label centered below the horizontal axis.
let xAxisLabel = svg.append("text")
    .attr("class", "axisLabel")
    .attr("x", svgWidth / 2)
    .attr("y", svgHeight - (marginBottom / 3))
    .attr("text-anchor", "middle")
    .text("Sleep Hours (h)");

// Add the y-axis label centered beside the vertical axis.
let yAxisLabel = svg.append("text")
    .attr("class", "axisLabel")
    .attr("transform", "rotate(-90)")
    .attr("x", -svgHeight / 2)
    .attr("y", marginLeft / 2)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .text("Morning Mood(1-5) 1=bad5=good");

// Draw numeric tick labels for the x-axis (Sleep Hours).
for (let i = SleepHoursMin; i <= SleepHoursMax; i++) {
  let x = xScale(i);
  svg.append("text")
    .attr("x", x)
    .attr("y", svgHeight - marginBottom + 14)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .text(i);
}

// Draw numeric tick labels for the y-axis (Morning Mood).
for (let i = moodMin; i<=moodMax; i++){
    let y = yScale(i);
    svg.append("text")
    .attr("y",y)
    .attr("x", marginLeft - 10)
    .attr("text-anchor", "end")
    .attr("dominant-baseline", "middle")
    .text(i);
}

// Position of the size legend (Sleep Quality) within the SVG.
let sizeKeyX = svgWidth - marginRight + 20;
let sizeKeyY = marginTop;

// Add the title for the size legend (Sleep Quality).
svg.append("text")
    .attr("class", "keyTitle")
    .attr("x", sizeKeyX)
    .attr("y", sizeKeyY + 5)
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .attr("font-family", "fantasy")
    .text("Sleep Quality (1-10)")

    // Example values and corresponding labels used in the size legend for Sleep Quality.
    let sizeKeyValues = [3, 6, 9];// Representative sleep quality values
    let sizeKeyLabels = ["1-4", "5-7", "8-10"];// Grouped ranges shown in the legend

// Loop through each legend value and compute the vertical position for each row.
// yPosition offsets each circle downward so the legend items do not overlap.
for (let i = 0; i < sizeKeyValues.length; i++) {
    let currentValue = sizeKeyValues[i];
    
    let yPosition = sizeKeyY + 30 + (i * 40);

// Draw a legend circle whose radius represents a sample Sleep Quality value.
svg.append("circle")
        .attr("cx", sizeKeyX + 20)
        .attr("cy", yPosition)
        .attr("r", rScale(currentValue))
        .attr("fill", "gray")
        .attr("stroke", "black")
        .attr("opacity", 0.6)
// Add the label text for each size legend entry (Sleep Quality range).
svg.append("text")
        .attr("class", "keyTitle")
        .attr("x", sizeKeyX + 45)
        .attr("y", yPosition)
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "middle")
        .attr("font-family", "fantasy")
        .text(sizeKeyLabels[i]);
    
}

// Position of the color legend (Energy Drink), placed below the size legend.
let colorKeyX = svgWidth - marginRight + 20;// align horizontally with size legend
let colorKeyY = sizeKeyY + 160;// vertical offset to appear beneath it

// Add the title for the color legend (Energy Drink).
svg.append("text")
    .attr("x", colorKeyX)
    .attr("y", colorKeyY + 5)
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .attr("font-family", "fantasy")
    .text("Energy Drink")

// Data for the color legend: maps each Energy Drink value (0–3) to a display color.
let colorKeyData = [
    {color: "blue", label: "= 0"},
    {color: "yellow", label: "= 1"},
    {color: "red", label: "= 2"},
    {color:"pink", label:"= 3"},
];

// Draw each item in the color legend. For every Energy Drink value, create a
// small colored circle and a label indicating what the color represents.
for (let i = 0; i < colorKeyData.length; i++) {

    let yPosition = colorKeyY + 25 + (i * 25);// vertical spacing between legend rows

    svg.append("circle")
        .attr("class", "keyTitle")
        .attr("cx", colorKeyX + 10)
        .attr("cy", yPosition)
        .attr("r", 8)
        .attr("fill", colorKeyData[i].color)
        .attr("stroke", "black")
        .attr("opacity", 0.6);

    svg.append("text")
        .attr("class", "keyTitle")
        .attr("x", colorKeyX + 25)
        .attr("y", yPosition)
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "middle")
        .attr("font-family", "fantasy")
        .text(colorKeyData[i].label);
    
}

}