/*
* Name: Simon Kemmere
* Student number: 10798250
* Course: Programmeerproject
* Description: file containing the script that runs the pie chart
*/
window.onload = function () {

// queue for loading data
  d3.queue()
    .defer(d3.json, "fishPerc.json")
    .await(createPie);


    function createPie (error, fishPerc) {
      if (error) throw error;

      console.log(fishPerc)
      // var svg = d3.select("svg"),
      //     width = +svg.attr("width"),
      //     height = +svg.attr("height"),
      //     radius = Math.min(width, height) / 2,
      //     g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
      //
      // var color = d3.scaleOrdinal(["#98abc5", "#8a89a6"]);

      // var pie = d3.pie()
      //     .sort(null)
      //     .value(function(d) { return d.; });
      //
      // var path = d3.arc()
      //     .outerRadius(radius - 10)
      //     .innerRadius(0);
      //
      // var label = d3.arc()
      //     .outerRadius(radius - 40)
      //     .innerRadius(radius - 40);
      //
      var marineFish = [];
      var freshFish = [];
      d3.json("fishPerc.json", function (data) {
        console.log(data)
      
      });

      // }, function(error, data) {
      //   if (error) throw error;
      //
      //   var arc = g.selectAll(".arc")
      //     .data(pie(data))
      //     .enter().append("g")
      //       .attr("class", "arc");
      //
      //   arc.append("path")
      //       .attr("d", path)
      //       .attr("fill", function(d) { return color(d.data.age); });
      //
      //   arc.append("text")
      //       .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
      //       .attr("dy", "0.35em")
      //       .text(function(d) { return d.data.age; });
    }};
