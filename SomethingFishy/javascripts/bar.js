/*
* Name: Simon Kemmere
* Student number: 10798250
* Course: Programmeerproject
* Description: file containing the script that runs the bar chart
*/
// window.onload = function() {
  var barSvg, barWidth, barHeight, barPadding, country, xScale, yScale, barTip, fish;

function loadBar(error, threatenedFish) {
    if (error) throw error;

    document.getElementById("barChartTitle").innerHTML = "Bar chart: Poland";

    var margin = {height: 75, width: 75},
    svgPadding = 30
    xTipOffset = -20
    yTipOffset = 0;

    barWidth = document.getElementById("barCol").clientWidth - svgPadding;
    barHeight = 500;
    barPadding = 5;
    country = Object.keys(threatenedFish[0]),
    fish = threatenedFish;

    // svg for barchart
    barSvg = d3.select("#bar")
               .append("svg")
               .attr("id", "barChart")
               .attr("width", barWidth)
               .attr("height", barHeight)
               .append("g")
               .attr("transform", "translate(" + margin.width + "," + (- margin.height) + ")");

   // create tip for barchart
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
                   .domain(["Total threatened fish", "Threatened marine fish", "Threatened freshwater fish"])
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
            .on("mouseout", barTip.hide)
  }

    // change data in bar chart, changes when clicked on country
    function swapBarData(d) {
      document.getElementById("barChartTitle").innerHTML = "Bar chart: " + d.properties.name

      barSvg.selectAll(".bars")
            .remove()

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
            .on("mouseout", barTip.hide)
    }
}
