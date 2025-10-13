"use strict";

/*
 Chenkun Zhao Drawing #1 - Panda
 
 This function draws a Panda on the SVG canvas
 posX - horizontal position of the Panda
 posY - vertical position of the Panda
 "normal" or "Mask" for the head part
 It returns the same canvas after drawing.
 */

function panda(svg, posX, posY, showOrigin, headStyle) {
 // Origin is pandaX and pandaY
  const pandaX = posX;
  const pandaY = posY;
  const style = (headStyle || "normal").toLowerCase();


  // panda ear
  svg.append("circle").attr("cx", pandaX - 36).attr("cy", pandaY - 172).attr("r", 40).attr("fill", "black");
  svg.append("circle").attr("cx", pandaX + 36).attr("cy", pandaY - 172).attr("r", 40).attr("fill", "black");

  // panda arm
  svg.append("ellipse").attr("cx", pandaX - 78).attr("cy", pandaY + 0).attr("rx", 30).attr("ry", 70).attr("fill", "black");
  svg.append("ellipse").attr("cx", pandaX + 78).attr("cy", pandaY + 0).attr("rx", 30).attr("ry", 70).attr("fill", "black");

  // panda body
  svg.append("ellipse").attr("cx", pandaX).attr("cy", pandaY).attr("rx", 78).attr("ry", 120).attr("fill", "grey");

  // panda lag
  svg.append("rect").attr("x", pandaX - 50).attr("y", pandaY + 80).attr("width", 40).attr("height", 110).attr("fill", "grey");
  svg.append("rect").attr("x", pandaX + 10).attr("y", pandaY + 80).attr("width", 40).attr("height", 110).attr("fill", "grey");

  // panda feet
  svg.append("polygon")
    .attr("points",
      (pandaX - 50) + "," + (pandaY + 190) + " " +
      (pandaX - 10) + "," + (pandaY + 190) + " " +
      (pandaX - 20) + "," + (pandaY + 210) + " " +
      (pandaX - 40) + "," + (pandaY + 210))
    .attr("fill", "black");

  svg.append("polygon")
    .attr("points",
      (pandaX + 10) + "," + (pandaY + 190) + " " +
      (pandaX + 50) + "," + (pandaY + 190) + " " +
      (pandaX + 40) + "," + (pandaY + 210) + " " +
      (pandaX + 20) + "," + (pandaY + 210))
    .attr("fill", "black");

  // panda head
  svg.append("circle").attr("cx", pandaX + 0).attr("cy", pandaY - 130).attr("r", 70).attr("fill", "grey");

  // panda nose
  svg.append("polygon")
    .attr("points",
      (pandaX - 5)  + "," + (pandaY - 120) + " " +
      (pandaX + 5)  + "," + (pandaY - 120) + " " +
      (pandaX + 10) + "," + (pandaY - 110) + " " +
      (pandaX - 10) + "," + (pandaY - 110))
    .attr("fill", "black");

  // panda eyes
  svg.append("ellipse").attr("cx", pandaX - 12).attr("cy", pandaY - 140).attr("rx", 10).attr("ry", 15).attr("fill", "white");
  svg.append("ellipse").attr("cx", pandaX + 12).attr("cy", pandaY - 140).attr("rx", 10).attr("ry", 15).attr("fill", "white");

  // panda eyes center
  svg.append("circle").attr("cx", pandaX - 12).attr("cy", pandaY - 140).attr("r", 5).attr("fill", "black");
  svg.append("circle").attr("cx", pandaX + 12).attr("cy", pandaY - 140).attr("r", 5).attr("fill", "black");

  // panda mouth
  svg.append("line")
    .attr("x1", pandaX - 12).attr("y1", pandaY - 103)
    .attr("x2", pandaX + 12).attr("y2", pandaY - 103)
    .attr("stroke", "black").attr("stroke-width", 2);

  // panda mask
  if (style === "mask") {
    svg.append("polygon")
      .attr("points",
        (pandaX + 0)  + "," + (pandaY - 40)  + " " +
        (pandaX + 70) + "," + (pandaY - 120) + " " +
        (pandaX - 70) + "," + (pandaY - 120))
      .attr("fill", "green");
  }

  //Show Origin Point
  if (showOrigin) {
    svg.append("circle").attr("cx", pandaX).attr("cy", pandaY).attr("r", 3).attr("fill", "deeppink");
  }

  return svg;
}

