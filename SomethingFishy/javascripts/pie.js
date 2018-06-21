/*
* Name: Simon Kemmere
* Student number: 10798250
* Course: Programmeerproject
* Description: file containing the script that runs the pie chart
*/

  var fishes, pieSvg, color, path, label, pie, arcBorder;

  function createPie (error, data) {
    if (error) throw error;

    var margin = {height: 75, width: 75},
    pieWidth = document.getElementById("pieCol").clientWidth,
    pieHeight = 500,
    radius = Math.min(pieWidth, pieHeight) / 2,
    border = 3,
    fishes = data;

    pieSvg = d3.select("#pie")
               .append("svg")
               .attr("id", "pieChart")
               .attr("width", pieWidth)
               .attr("height", pieHeight)
               .append("g")

    color = d3.scaleOrdinal(["#98abc5", "#8a89a6"]);

    path = d3.arc()
             .outerRadius(radius - border)
             .innerRadius(0);

    label = d3.arc()
              .outerRadius(radius - 40)
              .innerRadius(radius - 40);

    pie = d3.pie()
            .sort(null)
            .value(function(d) {
              return d;
            });

    arcBorder = d3.arc()
                  .outerRadius(radius)
                  .innerRadius(radius - border);

    var arc = pieSvg.selectAll(".arc")
                    .data(pie(fishes[0]["Poland"]))
                    .enter()
                    .append("g")
                    .attr("class", "arc")
                    .attr("transform", "translate(" + 0.5 * pieWidth + "," + 0.5 * pieHeight + ")");

    arc.append("path")
       .attr("fill", function(d) {
          return color(d.data);
       })
       .attr("d", path)

    arc.append("path")
       .attr("fill", "black")
       .attr("d", arcBorder)

    arc.append("text")
       .each(function(d) {
           var centroid = label.centroid(d);
           d3.select(this)
             .attr("x", centroid[0])
             .attr("y", centroid[1])
             .attr("dy", "0.35em")
             .text((Math.round(d.data * 100)/100) + "%");
         });
  }

  function swapPieData(d) {
    // if (error) throw error;

    document.getElementById("pieChartTitle").innerHTML = "Pie chart: " + d.properties.name;

    var arc = pieSvg.selectAll(".arc")
                    .remove()

    if (typeof fishes[0][d.properties.name] === "undefined") {
      arc.selectAll(".arc")
            .data(pie([0,0]))
            .enter()
            .append("path")
            .attr("fill", "black")
            .attr("d", arcBorder)
    }
    else {
        arc.selectAll(".arc")
           .data(pie(fishes[0][d.properties.name]))
           .append("path")
           .attr("inner", path)
           .attr("fill", function(d) {
             return color(d.data);
            })
           .append("path")
           .attr("fill", "black")
           .attr("outer", arcBorder)
           .append("text")
            .each(function(d) {
               var centroid = label.centroid(d);
               d3.select(this)
                 .attr('x', centroid[0])
                 .attr('y', centroid[1])
                 .attr('dy', '0.35em')
                 .text((Math.round(d.fishes * 100)/100) + "%");
             });
    }
  }
