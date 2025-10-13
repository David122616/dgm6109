'use strict';

/*
Harsh Kumar Drawing #5 - Butterfly
----------------------------------
This function draws a butterfly on an SVG canvas.
Parameters:
- svg: the D3 SVG drawing surface
- x: horizontal position of the butterfly
- y: vertical position of the butterfly
- showOrigin: true/false to show a small pink origin dot
Returns:
- The same SVG canvas with the butterfly added.
*/

function butterfly(svg, x, y, showOrigin) {
    svg.append("rect")
        .attr("x", 245 + x - 250)
        .attr("y", 120 + y - 150)
        .attr("width", 10)
        .attr("height", 160)
        .attr("fill", "#00CC00")
        .attr("stroke", "black");

    svg.append("ellipse")
        .attr("cx", 240 + x - 250)
        .attr("cy", 120 + y - 150)
        .attr("rx", 10)
        .attr("ry", 12)
        .attr("fill", "#FF0000")
        .attr("stroke", "black");

    svg.append("ellipse")
        .attr("cx", 260 + x - 250)
        .attr("cy", 120 + y - 150)
        .attr("rx", 10)
        .attr("ry", 12)
        .attr("fill", "#FF0000")
        .attr("stroke", "black");

    svg.append("polygon")
        .attr("points", `${140 + x - 250},${160 + y - 150} ${225 + x - 250},${100 + y - 150} ${247 + x - 250},${200 + y - 150}`)
        .attr("fill", "#FFFF33")
        .attr("stroke", "black");

    svg.append("polygon")
        .attr("points", `${360 + x - 250},${155 + y - 150} ${275 + x - 250},${100 + y - 150} ${253 + x - 250},${200 + y - 150}`)
        .attr("fill", "#FFFF33")
        .attr("stroke", "black");

    svg.append("polygon")
        .attr("points", `${160 + x - 250},${200 + y - 150} ${247 + x - 250},${200 + y - 150} ${247 + x - 250},${300 + y - 150}`)
        .attr("fill", "#CC6633")
        .attr("stroke", "black");

    svg.append("polygon")
        .attr("points", `${340 + x - 250},${200 + y - 150} ${253 + x - 250},${200 + y - 150} ${253 + x - 250},${300 + y - 150}`)
        .attr("fill", "#CC6633")
        .attr("stroke", "black");

    svg.append("line")
        .attr("x1", 245 + x - 250)
        .attr("y1", 110 + y - 150)
        .attr("x2", 220 + x - 250)
        .attr("y2", 60 + y - 150)
        .attr("stroke", "black");

    svg.append("line")
        .attr("x1", 255 + x - 250)
        .attr("y1", 110 + y - 150)
        .attr("x2", 280 + x - 250)
        .attr("y2", 60 + y - 150)
        .attr("stroke", "black");

    if (showOrigin) {
        svg.append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", 3)
            .attr("fill", "deeppink");
    }

    return svg;
}
