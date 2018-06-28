/*
* Name: Simon Kemmere
* Student number: 10798250
* Course: Programmeerproject
* Description: file containing the script that runs the bar chart.
*/

// design based on the following: https://bl.ocks.org/mbostock/3885304 &
// https://bl.ocks.org/syncopika/f1c9036b0deb058454f825238a95b6be

// declare global variables needed for upcoming functions
var barSvg, barWidth, barHeight, barPadding, country, xScale, yScale, barTip, fish;

/*
Function that draws the bar chart using data of threatened fishspecies.
It creates a svg on which the bar chart is projected and instantiates a tooltip.
*/
function loadBar(error, threatenedFish) {
    if (error) throw error;

    // set bar chart title to corresponding data
    document.getElementById("barChartTitle").innerHTML = "Bar chart: Poland";

    // declare variables needed to draw svg
    var margin = {height: 75, width: 75},
    svgPadding = 30
    xTipOffset = -20
    yTipOffset = 0;
    barWidth = document.getElementById("barCol").clientWidth - svgPadding;
    barHeight = 500;
    barPadding = 5;
    country = Object.keys(threatenedFish[0]),
    fish = threatenedFish;

    // svg for bar chart
    barSvg = d3.select("#bar")
               .append("svg")
               .attr("id", "barChart")
               .attr("width", barWidth)
               .attr("height", barHeight)
               .append("g")
               .attr("transform", "translate(" + margin.width + "," + (- margin.height) + ")");

   // create tip for bar chart
   barTip = d3.tip()
               .attr("class", "bar-tip")
               .attr("opacity", 0.5)
               .offset([xTipOffset, yTipOffset])
               .html(function(d) {
                 return (d) + " threatened fish species";
               });

    // call tip for bar
    barSvg.call(barTip);

    // x scale for bar chart
    xScale = d3.scaleBand()
               .domain(["Total threatened fish", "Threatened marine fish",
               "Threatened freshwater fish"])
               .rangeRound([0, barWidth - margin.width]);

    // y scale for bar chart
    yScale = d3.scaleLinear()
               .range([barHeight, margin.height])
               .domain([0, 409]);

    // add the x Axis
    barSvg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + barHeight + ")")
            .call(d3.axisBottom(xScale))
            .append("text")
            .attr("x", barWidth/2)
            .attr("dy", "4em")
            .style("tex-anchor", "middle")
            .style("font-size", "14px")
            .style("fill", "black")
            .text("Threatened fish per habitat");

    // add the y Axis
    barSvg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(yScale))
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("x", - margin.height)
            .attr("y", - (0.8 *margin.width))
            .attr("dy", "1em")
            .style("text-anchor", "end")
            .style("font-size", "14px")
            .style("fill", "black")
            .text("Absolute numbers of threatened fish");

    // drawing bars of bar chart
    barSvg.selectAll(".bars")
            .data(fish[0]["Poland"])
            .enter()
            .append("rect")
            .attr("class", "bars")
            .attr("width", xScale.bandwidth() - barPadding)
            .attr("height", function(d) {
              return barHeight - yScale(d);
            })
            .attr("x", function(d, i) {
              return i * (xScale.bandwidth()) + barPadding;
            })
            .attr("y", function(d) {
              return yScale(d);
            })
            .style("fill", "blue")
            .on("mouseover", barTip.show)
            .on("mouseout", barTip.hide);
}

/*
Update data in bar chart, which changes when the user clickes on a country.
*/
function swapBarData(d) {

  // update the title of the bar chart after user has clicked on a country
  document.getElementById("barChartTitle").innerHTML = "Bar chart: " + d.properties.name;

  // remove svg of current bar chart
  barSvg.selectAll(".bars")
        .remove();

  // determine whether data exists for the country that the user has clicked on
  // either call data for said country or leave bar chart empty
  if (typeof fish[0][d.properties.name] === "undefined") {
    barSvg.selectAll(".bars")
          .data([0,0,0])
          .enter()
          .append("rect")
          .attr("class", "bars")
          .attr("width", xScale.bandwidth() - barPadding)
          .attr("height", function(d) {
            return barHeight -yScale(d);
          })
          .attr("x", function(d, i) {
            return i * (xScale.bandwidth()) + barPadding;
          })
          .attr("y", function(d) {
            return yScale(d);
          })
          .style("fill", "blue")
          .on("mouseover", barTip.show)
          .on("mouseout", barTip.hide);
  }
  else {
  barSvg.selectAll(".bars")
        .data(fish[0][d.properties.name])
        .enter()
        .append("rect")
        .attr("class", "bars")
        .attr("width", xScale.bandwidth() - barPadding)
        .attr("height", function(d) {
          return barHeight -yScale(d);
        })
        .attr("x", function(d, i) {
          return i * (xScale.bandwidth()) + barPadding;
        })
        .attr("y", function(d) {
          return yScale(d);
        })
        .style("fill", "blue")
        .on("mouseover", barTip.show)
        .on("mouseout", barTip.hide);
  }
}
