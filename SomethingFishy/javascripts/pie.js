/*
* Name: Simon Kemmere
* Student number: 10798250
* Course: Programmeerproject
* Description: file containing the script that runs the pie chart
*/

  var pieWidth, pieHeight, pieSvg, color, path, label, pie, arcBorder, fishes;

  function createPie (error, data) {
    if (error) throw error;

    pieWidth = document.getElementById("pieCol").clientWidth;
    pieHeight = 500;

    var margin = {height: 75, width: 75},
    radius = Math.min(pieWidth, pieHeight) / 2,
    border = 3;
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
       .attr("d", arcBorder)
       .attr("fill", "black")

    arc.append("text")
       .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
       .text((function(d){
         return Math.round(d.data * 100)/100 + "%";
       }));
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
            .attr("transform", "translate(" + 0.5 * pieWidth + "," + 0.5 * pieHeight + ")");

            arc.append("path")
            .attr("d", arcBorder)
            .attr("fill", "black");

            arc.append("text")
               .text("No data available.")

    }
    else {
      var arc = pieSvg.selectAll(".arc")
                      .data(pie(fishes[0][d.properties.name]))
                      .enter()
                      .append("g")
                      .attr("class", "arc")
                      .attr("transform", "translate(" + 0.5 * pieWidth + "," + 0.5 * pieHeight + ")");

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
          return Math.round(d.data * 100)/100 + "%";
        }));
    }
  }
