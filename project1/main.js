"use strict"

/*  Variable that enables you to "talk to" your SVG drawing canvas. */
let drawing = d3.select("#canvas")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500);

/* Draw a border that matches the maximum drawing area for this assignment.
    Assign the border to a variable so that:
        (1) We know what the purpose of the shape is, and
        (2) We will have the ability to change it later (in a future assignment)
*/
let border = drawing.append("rect")
    .attr("width", 500)
    .attr("height", 500)
    .attr("fill", "none")
    .attr("stroke", "red");

/* Write your code for Project 1 beneath this comment */

let leftear = drawing.append("circle")
.attr("cx", 214)
.attr("cy", 108)
.attr("r", 40)
.attr("fill", "black");

let rightear = drawing.append("circle")
.attr("cx", 286)
.attr("cy", 108)
.attr("r", 40)
.attr("fill", "black");

let pandaleftarm = drawing.append("ellipse")
.attr("cx", 172)
.attr("cy", 280)
.attr("rx", 30)
.attr("ry", 70)
.attr("fill", "black");

let pandarightarm = drawing.append("ellipse")
.attr("cx", 328)
.attr("cy", 280)
.attr("rx", 30)
.attr("ry", 70)
.attr("fill", "black");

let pandabody = drawing.append("ellipse")
.attr("cx", 250)   
.attr("cy", 280)   
.attr("rx", 78)    
.attr("ry", 120)   
.attr("fill","grey");

let pandleftleg = drawing.append("rect")
.attr("x", 200).attr("y", 360)
.attr("width", 40).attr("height", 110)
.attr("fill", "grey");

let pandrightleg = drawing.append("rect")
.attr("x", 260).attr("y", 360)
.attr("width", 40).attr("height", 110)
.attr("fill", "grey");

let pandafeetleft = drawing.append("polygon")
.attr("points", "200,470 240,470 230,490 210,490")
.attr("fill", "black");

let pandafeetright = drawing.append("polygon")
.attr("points", "260,470 300,470 290,490 270,490")
.attr("fill", "black");

let pandhead = drawing.append("circle")
.attr("cx", 250)
.attr("cy", 150)
.attr("r", 70)
.attr("fill", "grey");

let pandanose = drawing.append("polygon")
.attr("points", closedPolygon(245,160,255,160,260,170,240,170))
.attr("fill","black");

let pandaeyeleft = drawing.append("ellipse")
.attr("cx",238)
.attr("cy",140)
.attr("rx", 10)
.attr("ry", 15)
.attr("fill","white");

let pandareyeright = drawing.append("ellipse")
.attr("cx",262)
.attr("cy",140)
.attr("rx", 10)
.attr("ry", 15)
.attr("fill","white");

let pandaeyeleftcenter = drawing.append("circle")
.attr("cx",238)
.attr("cy", 140)
.attr("r", 5)
.attr("fill", "black");

let pandaeyerightcenter = drawing.append("circle")
.attr("cx", 262)
.attr("cy", 140)
.attr("r", 5)
.attr("fill", "black");

let mouth = drawing.append("line")
.attr("x1", 238)
.attr("y1", 177)
.attr("x2", 262)
.attr("y2", 177)
.attr("stroke", "black")
.attr("stroke-width", 2);

