"use strict"

/* *** START Do not modify this section of code ***** */
document.getElementById("action").addEventListener("click", processForm);

/* ************ function processForm () *****
PURPOSE:
Read the user input, clear the drawing area, and pass execution to makeDrawing()

REQUIREMENTS:
* d3.js v3 or higher
* Form fields to provide required data
* SVG canvas wrapped by d3

PARAMETERS:
none

RETURNS:
Nothing
****************************************************************** */

function processForm() {

    let choice1 = document.getElementById("choice1").value;
    let x1 = Number(document.getElementById("x1").value);
    let y1 = Number(document.getElementById("y1").value);

    let choice2 = document.getElementById("choice2").value;
    let x2 = Number(document.getElementById("x2").value);
    let y2 = Number(document.getElementById("y2").value);

    let showOrigin = document.getElementById("origins").value == "yes";
    drawing.selectAll('svg>*').remove();
    
    makeDrawing(drawing, choice1, x1, y1, choice2, x2, y2, showOrigin)
}

let drawing = d3.select("#canvas")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500);

let border = drawing.append("rect")
    .attr("width", 500)
    .attr("height", 500)
    .attr("fill", "none")
    .attr("stroke", "red");

/* *** END Do not modify this section of code ***** */

/* ************ function makeDrawing (canvas, choice1, x1, y1, choice2, x2, y2, showOrigin) *****
PURPOSE:
Draws to the canvas based on user preferences

REQUIREMENTS:
d3.js v3 or higher

PARAMETERS:
canvas:     an SVG group or canvas wrapped by d3
choice1:    selected option from first select menu
x1:         horizontal position for drawing choice1 (type: Number, range: 0-500)
y1:         vertical position for drawing choice1 (type: Number, range: 0-500)
choice2:    selected option from second select menu
x1:         horizontal position for drawing choice2 (type: Number, range: 0-500)
y1:         vertical position for drawing choice2 (type: Number, range: 0-500)

RETURNS:
Nothing
****************************************************************** */

function makeDrawing (canvas, choice1, x1, y1, choice2, x2, y2, showOrigin) {

 const headStyle = document.getElementById('pandaMode').value;
 const ladyHead    = document.getElementById('ladybugHead')?.value || 'normal';
const roosterMode = document.getElementById('roosterMode')?.value || '';


    let item1 = canvas.append("g");
    if (choice1 == "panda") {            
    panda(item1, x1, y1, showOrigin,headStyle);       
    } else if (choice1 == "ladybug"){
         ladybug(item1, x1, y1, showOrigin, ladyHead); 
    }else if (choice1 == "rooster"){ 
        rooster(item1, x1, y1, showOrigin, roosterMode); 
    } else if (choice1 == "butterfly"){ 
        butterfly(item1, x1, y1, showOrigin); 
    }

    let item2 = canvas.append("g");
    if (choice2 == "panda") {           
    panda(item2, x2, y2, showOrigin,headStyle);
    } else if (choice2 == "ladybug"){
         ladybug(item2, x2, y2, showOrigin, ladyHead); 
    }else if (choice2 == "rooster"){ 
        rooster(item2, x2, y2, showOrigin, roosterMode); 
    }else if (choice2 == "butterfly"){ 
        butterfly(item2, x2, y2, showOrigin); 
    }
    

    switcheroo(item1, x1, y1, item2, x2, y2);

}

/* ************ function switcheroo (i1, x1, y1, i2, x2, y2) *****
PURPOSE:
Swaps the positions of the two drawings after a half-second delay.

REQUIREMENTS:
d3.js v3 or higher

PARAMETERS:
i1: first drawing object (type: d3-wrapped SVG group)
x1: horizontal position for i1 (type: Number, range: 0-500)
y1: vertical position for i1 (type: Number, range: 0-500)
i2: first drawing object (type: d3-wrapped SVG group)
x2: horizontal position for i2 (type: Number, range: 0-500)
y2: vertical position for i2 (type: Number, range: 0-500)

RETURNS:
Nothing

USAGE NOTES:
* delay() determines how long to delay, in milliseconds
* duration() determines how long the animation should take, in milliseonds

You can also comment out the two lines in this function's body if you want to see
your results withuot them animating on you. Please return values to the defaults
before submitting your project.

****************************************************************** */

function switcheroo(i1, x1, y1, i2, x2, y2) {
    i1.transition().delay(500).duration(500).attr("transform", `translate(${x2-x1},${y2-y1})`);
    i2.transition().delay(500).duration(500).attr("transform", `translate(${x1-x2},${y1-y2})`);
}