/*
* Name: Simon Kemmere
* Student number: 10798250
* Course: Programmeerproject
* Description: file containing the script that runs the bar chart
*/
// window.onload = function() {

  // queue for loading data
  d3.queue()
    .defer(d3.json, "./data/threatenedFish.json")
    .await(loadBar);

  var margin = {height: 75, width: 75},
  w = document.getElementById("barCol").clientWidth,
  h = 500,
  barPadding = 5;

  console.log(w)

function loadBar(error, threatenedFish) {
    if (error) throw error;

    // svg for barchart
    var barSvg = d3.select("#bar")
                     .append("svg")
                     .attr("id", "barChart")
                     .attr("width", w)
                     .attr("height", h)
                     .append("g")
                     .attr("transform", "translate(" + margin.width + "," + (- margin.height) + ")");

   // create tip for barchart
   var barTip = d3.tip()
               .attr("class", "bar-tip")
               .attr("opacity", 0.5)
               .offset([-20, 0])
               .html(function(d) {
                 return (d) + " threatened fish species";
               });

    // call tip for bar
    barSvg.call(barTip)

    // x scale for bar chart
    var xScale = d3.scaleBand()
                   .domain(["Total threatened fish", "Threatened marine fish", "Threatened freshwater fish"])
                   .rangeRound([0, w - margin.width]);

    // y scale for bar chart
    var yScale = d3.scaleLinear()
                   .range([h, margin.height])
                   .domain([0, 409])

    // add the x Axis
    barSvg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + h + ")")
            .call(d3.axisBottom(xScale))
            .append("text")
            .attr("x", w/2)
            .attr("dy", "3em")
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
            .attr("y", - (0.6 * margin.width))
            .attr("dy", "1em")
            .style("text-anchor", "end")
            .style("font-size", "14px")
            .style("fill", "black")
            .text("Absolute numbers of threatened fish");

    // drawing bars of bar chart
    barSvg.selectAll(".bars")
            .data(threatenedFish[0]["Belgium"])
            .enter()
            .append("rect")
            .attr("class", "bars")
            .attr("width", xScale.bandwidth() - barPadding)
            .attr("height", function(d) {return h - yScale(d)})
            .attr("x", function(d, i) {
              return i * (xScale.bandwidth()) + barPadding;
            })
            .attr("y", function(d) {return yScale(d)})
            .style("fill", "blue")
            .on("mouseover", barTip.show)
            .on("mouseout", barTip.hide)


    // // change data in bar chart, changes when clicked on country
    // function swapData(d) {
    //   barChart.selectAll(".bars")
    //           .remove()
    //   barChart.selectAll(".bars")
    //           .data(function (d) {
    //             if (myCountries.indexOf(d.properties.name))
    //           .enter()
    //           .append("rect")
    //           .attr("class", "bars")
    //           .attr("width", xScale.bandwidth() - barPadding)
    //           .attr("height", function(d) {return h -yScale(d)})
    //           .attr("x", function(d, i) {
    //             return i * (xScale.bandwidth()) + barPadding;
    //           })
    //           .attr("y", function(d) {return yScale(d)})
    //           .style("fill", "blue")
    //           .on("mouseover", barTip.show)
    //           .on("mouseout", barTip.hide)
    }
  // }
