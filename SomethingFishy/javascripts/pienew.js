/*
* Name: Simon Kemmere
* Student number: 10798250
* Course: Programmeerproject
* Description: file containing the script that runs the pie chart
*/
window.onload = function () {

// queue for loading data
  d3.queue()
    .defer(d3.json, "./data/fishPercnew.json");

    var margin = {height: 75, width: 75},
    h = 450,
    w = 450,
    radius = Math.min(w, h) / 2;

    var pieSvg = d3.select("#pie")
                     .append("svg")
                     .attr("id", "pie")
                     .attr("width", w + (2 * margin.width))
                     .attr("height", h + (2 * margin.height))
                     .append("g")

    var color = d3.scaleOrdinal(["#98abc5", "#8a89a6"]);

    var path = d3.arc()
                 .outerRadius(radius - 10)
                 .innerRadius(0);

    var label = d3.arc()
                  .outerRadius(radius - 40)
                  .innerRadius(radius - 40);

    d3.csv("threatenedFishPercentage.csv", function(error, data){
      if (error) throw error;

      data.forEach(function(d){
        d.Value = +d.Value
      })

      console.log(data)
    })
};
