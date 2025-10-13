"use strict";

/*
 Qing Dan Drawing #13 - Ladybug
 
 This function draws a ladybug on the SVG canvas
 posX - horizontal position of the ladybug
 posY - vertical position of the ladybug
 "normal" or "after" for the head shape
 It returns the same canvas after drawing.
 */

function ladybug(svgCanvas, posX, posY, showOrigin, choice) {


    // Origin is bugX and bugY:
    let bugX = posX;
    let bugY = posY;

    // Head
    if (choice === "normal") {
        // Normal Trapezoid Head
        let headBottomW = 60;  
        let headTopW    = 40;  
        let headBottomY = bugY - 40;      
        let headTopY    = bugY - 75;

        let headPoints = [
            (bugX - headBottomW/2) + "," + headBottomY,
            (bugX - headTopW/2)    + "," + headTopY,
            (bugX + headTopW/2)    + "," + headTopY,
            (bugX + headBottomW/2) + "," + headBottomY
        ].join(" ");

        svgCanvas.append("polygon")
            .attr("points", headPoints)
            .attr("fill", "blue")
            .attr("stroke", "black");

    } else if (choice === "after") {
        // After Triangle Head
        let side = 60;
        let height = Math.sqrt(3) / 2 * side;

        let headPoints = [
            bugX + "," + (bugY - 75),                       
            (bugX - side/2) + "," + (bugY - 75 + height),
            (bugX + side/2) + "," + (bugY - 75 + height)
        ].join(" ");

        svgCanvas.append("polygon")
            .attr("points", headPoints)
            .attr("fill", "blue")
            .attr("stroke", "black");
    }

    // Bug Body
    svgCanvas.append("circle")
        .attr("cx", bugX)
        .attr("cy", bugY)
        .attr("r", 50)
        .attr("fill", "orange"); 

    // Body Middle Line
    svgCanvas.append("line")
        .attr("x1", bugX)
        .attr("y1", bugY-50)
        .attr("x2", bugX)
        .attr("y2", bugY+50)
        .attr("stroke", "black")
        .attr("stroke-width", 1.5);
    
    // Bug Spots
    let spx = bugX - 20;     
    let spy = bugY - 20;     

    // left side
    svgCanvas.append("circle")
        .attr("cx", spx)
        .attr("cy", spy)
        .attr("r", 15)
        .attr("fill", "yellow");
    svgCanvas.append("circle")
        .attr("cx", spx-15)
        .attr("cy", spy+20)
        .attr("r", 8)
        .attr("fill", "yellow");
    svgCanvas.append("circle")
        .attr("cx", spx)
        .attr("cy", spy+40)
        .attr("r", 15)
        .attr("fill", "yellow");
    
    // right side
    svgCanvas.append("circle")
        .attr("cx", spx+40)
        .attr("cy", spy)
        .attr("r", 15)
        .attr("fill", "yellow");
    svgCanvas.append("circle")
        .attr("cx", spx+55)
        .attr("cy", spy+20)
        .attr("r", 8)
        .attr("fill", "yellow");
    svgCanvas.append("circle")
        .attr("cx", spx+40)
        .attr("cy", spy+40)
        .attr("r", 15)
        .attr("fill", "yellow");

    // Bug Eyes
    svgCanvas.append("circle")
        .attr("cx", spx+5)
        .attr("cy", spy-40)
        .attr("r", 6)
        .attr("fill", "yellow");
    svgCanvas.append("circle")
        .attr("cx", spx+33)
        .attr("cy", spy-40)
        .attr("r", 6)
        .attr("fill", "yellow");

    // Bug Feet
    svgCanvas.append ("line")
        .attr("x1", bugX-80)
        .attr("y1", bugY-50)
        .attr("x2", bugX-35)
        .attr("y2", bugY-20)
        .attr("stroke", "black");
    svgCanvas.append ("line")
        .attr("x1", bugX-80)
        .attr("y1", bugY-10)
        .attr("x2", bugX-35)
        .attr("y2", bugY-10)
        .attr("stroke", "black");
    svgCanvas.append ("line")
        .attr("x1", bugX-60)
        .attr("y1", bugY+30)
        .attr("x2", bugX-35)
        .attr("y2", bugY+10)
        .attr("stroke", "black");
    svgCanvas.append ("line")
        .attr("x1", bugX-60)
        .attr("y1", bugY+30)
        .attr("x2", bugX-70)
        .attr("y2", bugY+60)
        .attr("stroke", "black");

    svgCanvas.append ("line")
        .attr("x1", bugX+80)
        .attr("y1", bugY-50)
        .attr("x2", bugX+35)
        .attr("y2", bugY-20)
        .attr("stroke", "black");
    svgCanvas.append ("line")
        .attr("x1", bugX+80)
        .attr("y1", bugY-10)
        .attr("x2", bugX+35)
        .attr("y2", bugY-10)
        .attr("stroke", "black");
    svgCanvas.append ("line")
        .attr("x1", bugX+60)
        .attr("y1", bugY+30)
        .attr("x2", bugX+35)
        .attr("y2", bugY+10)
        .attr("stroke", "black");
    svgCanvas.append ("line")
        .attr("x1", bugX+60)
        .attr("y1", bugY+30)
        .attr("x2", bugX+70)
        .attr("y2", bugY+60)
        .attr("stroke", "black");

    // Show Origin Point
    if (showOrigin) {
        svgCanvas.append("circle")
            .attr("cx", bugX)
            .attr("cy", bugY)
            .attr("r", 3)
            .attr("fill", "deeppink");
    }

    return svgCanvas;
}
