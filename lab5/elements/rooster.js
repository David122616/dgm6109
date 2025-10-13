"use strict"

/****** function rooster (svgCanvas, x, y, showOrigin, flapChoice) ******
 
 OVERVIEW 
 Draws a rooster on an SVG canvas in the specified position. 
 Optionally draws a pink dot indicating the drawing's reference origin point. 
 Optionally changes rooster's wing and leg positions. 
 
 PARAMETERS
 svgCanvas - Takes a D3 SVG drawing canvas.
 x - Takes a number specifying the rooster's horizontal position, relative to origin.
 y - Takes a number specifying the rooster's vertical position, relative to origin.
 showOrigin - Takes a boolean value to toggle visibility of pink origin indicator dot.
 flapChoice - Expects exact string value: "flap"; 
              Toggles option to draw a flapping rooster using alternate wing and leg positions.

 RETURNS
 Returns svgCanvas with rooster drawing added.

 ******/
function rooster(svgCanvas, x, y, showOrigin, flapChoice){

    /* DRAW A ROOSTER */

    // Tail
    svgCanvas.append("polyline")
        .attr("points", closedPolygon(
            x - 75, y - 50, 
            x - 25, y - 50, 
            x, y, 
            x - 50, y,
            x - 75, y + 55, 
            x - 100, y))  
        .attr("fill", "#D5AE45");

    // Main body 
    svgCanvas.append("polyline")
        .attr("points", closedPolygon(
            x - 50, y, 
            x + 100, y, 
            x + 50, y + 50, 
            x - 25, y + 50)) 
        .attr("fill", "#FA965B");

    // Neck
    svgCanvas.append("polyline")
        .attr("points", closedPolygon(
            x + 75, y - 50, 
            x + 100, y, 
            x + 50, y)) 
        .attr("fill", "#FA965B");

    // Head
    svgCanvas.append("polyline")
        .attr("points", closedPolygon(
            x + 65, y - 80, 
            x + 125, y - 50, 
            x + 65, y - 30)) 
        .attr("fill", "#FA965B");

    // Head feather shape
    svgCanvas.append("polyline")
        .attr("points", closedPolygon(
            x + 85, y - 120, 
            x + 100, y - 60, 
            x + 40, y - 95)) 
        .attr("fill", "#D5AE45");

    // Eye
    svgCanvas.append("ellipse")
        .attr("cx", x + 80)
        .attr("cy", y - 60)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("fill", "black");


    /* MAKE INTERACTIVE - Flappable rooster option */
    
    if (flapChoice == "flap") { 

        // Flap wing
        svgCanvas.append("polyline")
            .attr("points", closedPolygon(
                x + 25, y, 
                x, y - 30,  
                x - 25, y + 50)) 
            .attr("fill", "#03C9C9");

        // Jump back leg
        svgCanvas.append("line")
            .attr("x1", x)
            .attr("y1", y + 45) 
            .attr("x2", x - 15)
            .attr("y2", y + 90) 
            .attr("stroke", "black")
            .attr("stroke-width", 1);

        // Jump front leg
        svgCanvas.append("line")
            .attr("x1", x + 25)
            .attr("y1", y + 50)
            .attr("x2", x + 40)
            .attr("y2", y + 90) 
            .attr("stroke", "black")
            .attr("stroke-width", 1);

    } else { 

        // Wing normal
        svgCanvas.append("polyline")
            .attr("points", closedPolygon(
                x + 25, y, 
                x + 50, y + 25,  
                x - 25, y + 50)) 
            .attr("fill", "#75FCFD");

        // Back leg normal
        svgCanvas.append("line")
            .attr("x1", x)
            .attr("y1", y + 45) 
            .attr("x2", x)
            .attr("y2", y + 100) 
            .attr("stroke", "black")
            .attr("stroke-width", 1);

        // Front leg normal
        svgCanvas.append("line")
            .attr("x1", x + 25)
            .attr("y1", y + 50) 
            .attr("x2", x + 25)
            .attr("y2", y + 100) 
            .attr("stroke", "black")
            .attr("stroke-width", 1);

    }

    /* Draw dot to show origin point */

    if (showOrigin) {
        svgCanvas.append("ellipse")
            .attr("cx", x)
            .attr("cy", y)
            .attr("rx", 3)
            .attr("ry", 3)
            .attr("fill", "deeppink");
    }

return canvas;
}
