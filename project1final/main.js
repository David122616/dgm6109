"use strict"

document.getElementById("action").addEventListener("click", processForm);

let xInput, yInput, choice;

function processForm() {
    
    xInput = Number(document.getElementById("xInput").value);
    yInput = Number(document.getElementById("yInput").value);

   choice = document.getElementById("pandaMode").value;
   drawing.selectAll('svg>*').remove(); 
    drawImage();}


let drawing = d3.select("#canvas")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500);

let border = drawing.append("rect")
    .attr("width", 500)
    .attr("height", 500)
    .attr("fill", "none")
    .attr("stroke", "red");



function drawImage() {

    
let pandaX = xInput;
let pandaY = yInput;

let leftear = drawing.append("circle")
  .attr("cx", pandaX - 36)
  .attr("cy", pandaY - 172)
  .attr("r", 40)
  .attr("fill", "black");

let rightear = drawing.append("circle")
  .attr("cx", pandaX + 36)
  .attr("cy", pandaY - 172)
  .attr("r", 40)
  .attr("fill", "black");

let pandaleftarm = drawing.append("ellipse")
  .attr("cx", pandaX - 78)
  .attr("cy", pandaY + 0)
  .attr("rx", 30)
  .attr("ry", 70)
  .attr("fill", "black");

let pandarightarm = drawing.append("ellipse")
  .attr("cx", pandaX + 78)
  .attr("cy", pandaY + 0)
  .attr("rx", 30)
  .attr("ry", 70)
  .attr("fill", "black");

let pandabody = drawing.append("ellipse")
  .attr("cx", pandaX)
  .attr("cy", pandaY)
  .attr("rx", 78)
  .attr("ry", 120)
  .attr("fill", "grey");

let pandleftleg = drawing.append("rect")
  .attr("x", pandaX - 50)
  .attr("y", pandaY + 80)
  .attr("width", 40)
  .attr("height", 110)
  .attr("fill", "grey");

let pandrightleg = drawing.append("rect")
  .attr("x", pandaX + 10)
  .attr("y", pandaY + 80)
  .attr("width", 40)
  .attr("height", 110)
  .attr("fill", "grey");

let pandafeetleft = drawing.append("polygon")
  .attr("points",
    (pandaX - 50) + "," + (pandaY + 190) + " " +
    (pandaX - 10) + "," + (pandaY + 190) + " " +
    (pandaX - 20) + "," + (pandaY + 210) + " " +
    (pandaX - 40) + "," + (pandaY + 210)
  )
  .attr("fill", "black");

let pandafeetright = drawing.append("polygon")
  .attr("points",
    (pandaX + 10) + "," + (pandaY + 190) + " " +
    (pandaX + 50) + "," + (pandaY + 190) + " " +
    (pandaX + 40) + "," + (pandaY + 210) + " " +
    (pandaX + 20) + "," + (pandaY + 210)
  )
  .attr("fill", "black");

let pandhead = drawing.append("circle")
  .attr("cx", pandaX + 0)
  .attr("cy", pandaY - 130)
  .attr("r", 70)
  .attr("fill", "grey");

let pandanose = drawing.append("polygon")
  .attr("points",
    (pandaX - 5)  + "," + (pandaY - 120) + " " +
    (pandaX + 5)  + "," + (pandaY - 120) + " " +
    (pandaX + 10) + "," + (pandaY - 110) + " " +
    (pandaX - 10) + "," + (pandaY - 110)
  )
  .attr("fill", "black");


let pandaeyeleft = drawing.append("ellipse")
  .attr("cx", pandaX - 12)
  .attr("cy", pandaY - 140)
  .attr("rx", 10)
  .attr("ry", 15)
  .attr("fill", "white");

let pandaeyeright = drawing.append("ellipse")
  .attr("cx", pandaX + 12)
  .attr("cy", pandaY - 140)
  .attr("rx", 10)
  .attr("ry", 15)
  .attr("fill", "white");

let pandaeyeleftcenter = drawing.append("circle")
  .attr("cx", pandaX - 12)
  .attr("cy", pandaY - 140)
  .attr("r", 5)
  .attr("fill", "black");

let pandaeyerightcenter = drawing.append("circle")
  .attr("cx", pandaX + 12)
  .attr("cy", pandaY - 140)
  .attr("r", 5)
  .attr("fill", "black");

let mouth = drawing.append("line")
  .attr("x1", pandaX - 12)
  .attr("y1", pandaY - 103)
  .attr("x2", pandaX + 12)
  .attr("y2", pandaY - 103)
  .attr("stroke", "black")
  .attr("stroke-width", 2);



    if (choice === "mask") {
  
  drawing.append("polygon")
    .attr("points",
      (pandaX + 0)  + "," + (pandaY - 40) + " " +  
      (pandaX + 70) + "," + (pandaY - 120) + " " +  
      (pandaX - 70) + "," + (pandaY - 120)        
    )
    .attr("fill", "green");
}




    /***** DO NOT ADD OR EDIT ANYTHING BELOW THIS LINE ******/
}
