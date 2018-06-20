/*
* Name: Simon Kemmere
* Student number: 10798250
* Course: Programmeerproject
* Description: file containing the script that runs the pie chart
*/

// window.onload = function () {

// function makePie(){}
// queue for loading data
    function createPie (error, data) {
      if (error) throw error;

      var margin = {height: 75, width: 75},
      pieWidth = document.getElementById("pieCol").clientWidth,
      pieHeight = 500,
      radius = Math.min(pieWidth, pieHeight) / 2,
      country = Object.keys(data[0]),
      marineFresh = Object.values(data[0]);

      var pieSvg = d3.select("#pie")
                       .append("svg")
                       .attr("id", "pieChart")
                       .attr("width", pieWidth)
                       .attr("height", pieHeight)
                       .append("g");

      var color = d3.scaleOrdinal(["#98abc5", "#8a89a6"]);

      var path = d3.arc()
                   .outerRadius(radius - 10)
                   .innerRadius(0);

      var label = d3.arc()
                    .outerRadius(radius - 40)
                    .innerRadius(radius - 40);

      var pie = d3.pie()
                  .sort(null)
                  .value(function(d) {
                    return d;
                  });

      var arc = pieSvg.selectAll(".arc")
                      .data(pie(marineFresh[2]))
                      .enter()
                      .append("g")
                      .attr("class", "arc");

      arc.append("path")
         .attr("d", path)
         .attr("fill", function(d) {
            return color(d.data);
         })
         .attr("transform", "translate(250,250)");

      arc.append("text")
          .each(function(d) {
             var centroid = label.centroid(d);
             d3.select(this)
               .attr('x', 250 + centroid[0])
               .attr('y', 250 + centroid[1])
               .attr('dy', '0.35em')
               .text((Math.round(d.data * 100)/100) + "%");
           });
    };
