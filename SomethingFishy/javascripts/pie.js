/*
* Name: Simon Kemmere
* Student number: 10798250
* Course: Programmeerproject
* Description: file containing the script that runs the pie chart
*/

  var pieWidth, pieHeight, xArc, yArc, pieSvg, colorList, color, path, label, pie, arcBorder, fishes;

  function createPie (error, data) {
    if (error) throw error;

    document.getElementById("pieChartTitle").innerHTML = "Pie chart: Poland";

    var piePadding = 30;


    pieWidth = document.getElementById("pieCol").clientWidth - piePadding,
    pieHeight = 500,
    xArc = 0.5,
    yArc = 0.5;

    var margin = {height: 75, width: 75},
    radius = Math.min(pieWidth, pieHeight) / 2,
    border = 3,

    arc = 40;
    fishes = data,
    colorList = ["#98abc5", "#8a89a6"];

    pieSvg = d3.select("#pie")
               .append("svg")
               .attr("id", "pieChart")
               .attr("width", pieWidth)
               .attr("height", pieHeight)
               .append("g")


    color = d3.scaleOrdinal(colorList);

    path = d3.arc()
             .outerRadius(radius - border)
             .innerRadius(0);

    label = d3.arc()
              .outerRadius(radius - arc)
              .innerRadius(radius - arc);

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
                    .attr("transform", "translate(" + xArc * pieWidth + "," + yArc * pieHeight + ")");

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
         var dataTotal = d3.sum(fishes[0]["Poland"])

         return ((d.data / dataTotal)*100).toFixed(2) + "%";
       }));
    pieLegend()
  }

  function pieLegend() {

    var legendHeight = 100,
    legendPadding = 30,
    legendWidth = 1.5 * document.getElementById("dropButton").clientWidth - legendPadding,
    border = 1,
    bordercolor = "black",
    legendText = ["% Of threatened freshwater fish","% Of threatened marine fish"];

    // create legend

    var pieLegend = d3.select("#pieLegend")
                     .append("svg")
                     .attr("id", "pieLeg")
                     .attr("width", legendWidth)
                     .attr("height", legendHeight)
                     .attr("border", border);

    pieLegend.append("rect")
    			.attr("x", 0)
    			.attr("y", 0)
    			.attr("height", legendHeight)
    			.attr("width", legendWidth)
    			.style("stroke", bordercolor)
    			.style("fill", "none")
    			.style("stroke-width", border);

    pieLegend = pieLegend.append("g")
                  .attr("class", "legendPie");

    // create color for legend
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
             })

    pieLegend.selectAll("#piePart")
         .data(legendText)
         .enter()
         .append("text")
         .attr("class", "pieLegendText")
         .attr("transform", function(d,i) {
           return "translate(35," + (40 + (i * 30)) + ")"
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
               .text("No data available.")

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
