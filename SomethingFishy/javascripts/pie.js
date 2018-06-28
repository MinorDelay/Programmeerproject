/*
* Name: Simon Kemmere
* Student number: 10798250
* Course: Programmeerproject
* Description: file containing the script that runs the pie chart
*/

// declare global variables
var pieWidth, pieHeight, xArc, yArc, pieSvg, colorList, color, path, label, pie, arcBorder, fishes;

/*
Function that creates the pie chart. It makes a svg, loads data from a predetermined
country and draws the pie chart for said country.
*/
function createPie (error, data) {
  if (error) throw error;

  // set pie chart title to corresponding data
  document.getElementById("pieChartTitle").innerHTML = "Pie chart: Poland";

  // declare variables needed to draw svg and handle data
  var piePadding = 30;
  pieWidth = document.getElementById("pieCol").clientWidth - piePadding,
  pieHeight = 500,
  xArc = 0.5,
  yArc = 0.5;
  var margin = {height: 75, width: 75},
  radius = Math.min(pieWidth, pieHeight) / 2,
  border = 3,
  arc = 60;
  fishes = data,
  colorList = ["#98abc5", "#8a89a6"];

  // svg for pie chart
  pieSvg = d3.select("#pie")
             .append("svg")
             .attr("id", "pieChart")
             .attr("width", pieWidth)
             .attr("height", pieHeight)
             .append("g");

  // scale colors ordinally
  color = d3.scaleOrdinal(colorList);

  // determine size of the pie chart
  path = d3.arc()
           .outerRadius(radius - border)
           .innerRadius(0);

  // determine the positioning of the labels in pie chart
  label = d3.arc()
            .outerRadius(radius - arc)
            .innerRadius(radius - arc);

  // determines size of slices per category
  pie = d3.pie()
          .sort(null)
          .value(function(d) {
            return d;
          });

  // determine positioning of border of pie chart
  arcBorder = d3.arc()
                .outerRadius(radius)
                .innerRadius(radius - border);

  // load data into pie chart
  var arc = pieSvg.selectAll(".arc")
                  .data(pie(fishes[0]["Poland"]))
                  .enter()
                  .append("g")
                  .attr("class", "arc")
                  .attr("transform", "translate(" + xArc * pieWidth + ","
                    + yArc * pieHeight + ")");

  // color slices according to ordinal colorscale
  arc.append("path")
     .attr("fill", function(d) {
        return color(d.data);
     })
     .attr("d", path)

  // append border to pie chart
  arc.append("path")
     .attr("d", arcBorder)
     .attr("fill", "black")

  // append text into pie chart using previously determined label variable
  arc.append("text")
     .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
     .text((function(d){
       var dataTotal = d3.sum(fishes[0]["Poland"])

       return ((d.data / dataTotal)*100).toFixed(2) + "%";
     }));

  // call the legend of the pie chart
  pieLegend()
}

/*
Function that creates a legend for the pie chart. The meaning of the colors
corresponding to those in the pie chart are explained.
*/
function pieLegend() {

  // create variables needed to draw svg and the text in the svg
  var legendHeight = 100,
  legendPadding = 30,
  legendWidth = 1.5 * document.getElementById("dropButton").clientWidth - legendPadding,
  border = 1,
  bordercolor = "black",
  legendText = ["% Of threatened freshwater fish","% Of threatened marine fish"];

  // create svg for legend
  var pieLegend = d3.select("#pieLegend")
                    .append("svg")
                    .attr("id", "pieLeg")
                    .attr("width", legendWidth)
                    .attr("height", legendHeight)
                    .attr("border", border);

  // draw border around svg
  pieLegend.append("rect")
  			   .attr("x", 0)
  			   .attr("y", 0)
  			   .attr("height", legendHeight)
  			   .attr("width", legendWidth)
  			   .style("stroke", bordercolor)
  			   .style("fill", "none")
  			   .style("stroke-width", border);

  // append g element
  pieLegend = pieLegend.append("g")
                       .attr("class", "legendPie");

  // create positioning of and colors themselves explaining variables
  pieLegend.selectAll("circle")
           .data(colorList)
           .enter()
           .append("circle")
           .attr("class", "piePart")
           .attr("transform", function(d,i) {
             return "translate(20," + (35 + (i * 30)) + ")"
           })
           .attr("r", function(d) {
             return "10px";
           })
           .style("fill", function(d){
              return d;
           });

  // determine not only which text should be in the legend, also it's positioning
  pieLegend.selectAll("#piePart")
           .data(legendText)
           .enter()
           .append("text")
           .attr("class", "pieLegendText")
           .attr("transform", function(d,i) {
             return "translate(35," + (40 + (i * 30)) + ")";
           })
           .text(function(d){
             return d;
           });
}

function swapPieData(d) {
  // if (error) throw error;

  document.getElementById("pieChartTitle").innerHTML = "Pie chart: " + d.properties.name;

  pieSvg.selectAll(".arc")
                  .remove()

  if (typeof fishes[0][d.properties.name] === "undefined") {
    var arc = pieSvg.selectAll(".arc")
                    .data(pie([1,1]))
                    .enter()
                    .append("g")
                    .attr("class", "arc")
                    .attr("transform", "translate(" + xArc * pieWidth + "," + yArc * pieHeight + ")");

    arc.append("path")
       .attr("d", arcBorder)
       .attr("fill", "black");

    arc.append("text")
       .text("No data available.");
  }
  else {
    var country = d.properties.name;
    var arc = pieSvg.selectAll(".arc")
                    .data(pie(fishes[0][country]))
                    .enter()
                    .append("g")
                    .attr("class", "arc")
                    .attr("transform", "translate(" + xArc * pieWidth + "," + yArc * pieHeight + ")");

    arc.append("path")
       .attr("d", path)
       .attr("fill", function(d) {
         return color(d.data);
       });

    arc.append("path")
       .attr("fill", "black")
       .attr("d", arcBorder)

    arc.append("text")
       .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
       .text((function(d){
        var dataTotal = d3.sum(fishes[0][country])
        return ((d.data / dataTotal) * 100).toFixed(2) + "%";
      }));
  }
}
