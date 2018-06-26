  var startYear = 2014, currentYear;

  function getHarbourData(error, map, harbours) {

    currentYear = startYear;
    createHarbour(error, map, harbours, currentYear);
  }


// queue for loading data
  function createHarbour(error, map, harbours, currentYear) {

    if (error) throw error;

    selectedData = harbours[0][currentYear];

    var mapHeight = 500,
    mapWidth = (document.getElementById("harbour").clientWidth),
    rotated = 0,
    mapScale = 2,
    xMap = 2,
    yMap = 0.6,
    // coordsYear = [],
    wasteYear = [],
    harbourYear = [];


     selectedData.forEach(function(d){
       // coordsYear.push([+d["Longitude"],+d["Latitude"]])
       wasteYear.push(d["Weight of waste"]);
       harbourYear.push(d["Harbour"])
     });

    var countries = topojson.feature(map, map.objects.countries1).features,
    harbourSize = d3.max(wasteYear);

    var harbourSvg = d3.select("#harbourMap")
                .append("svg")
                .attr("id", "harbours")
                .attr("width", mapWidth)
                .attr("height", mapHeight)
                .append("g");


    var projection = d3.geoMercator()
                       .scale(mapWidth/mapScale)
                       .translate([mapWidth/xMap,mapHeight/yMap])
                       .rotate([rotated,0,0]);

    var path = d3.geoPath()
                 .projection(projection);

    harbourSvg.selectAll(".countries")
          .data(countries)
          .enter()
          .append("path")
          .attr("class", "countries")
          .attr("d", path)
          // .on("mouseover", mapTip.show)
          // .on("mouseout", mapTip.hide)

    harbourSvg.selectAll("circle")
           .data(selectedData)
           .enter()
           .append("circle")
           .attr("class", "harbourloca")
           .attr("transform", function(d){
             return "translate(" + projection([
               d["Longitude"],d["Latitude"]]) + ")";
           })
           .attr("r", function(d){
             return console.log(Math.LN10((harbourSize/d["Weight of waste"]))) + "px";
           })
           .attr("fill", "red");

    moveHarbour(harbourSvg, path, mapWidth, mapHeight, rotated, projection, harbourSize);
    changeYear(error, map, harbours, currentYear);
  };

  function changeYear(error, map, harbours, currentYear){

    d3.select("select")
      .on("change",function(d){
        var selectedYear = d3.select("#myDropdown").node().value;
        currentYear = selectedYear;
        d3.select("#harbours").remove();
        createHarbour(error, map, harbours, currentYear);
      })
  }

  // function to make the world map
  function moveHarbour(harbourSvg, path, mapWidth, mapHeight, rotated, projection, harbourSize) {

    var initX,
    mouse,
    minZoom = 1,
    maxZoom = 10,
    mouseClicked = false,
    degrees = 360;
    s = 1;

    var zoom = d3.zoom()
                 .scaleExtent([minZoom, maxZoom])
                 .on("zoom", zoomed)
                 .on("end", zoomended);

    harbourSvg.on("wheel", function() {
            //zoomend needs mouse coords
            initX = d3.mouse(this)[0];
          })
          .on("mousedown", function() {
            //only if scale === 1
            if(s !== 1) return;
            initX = d3.mouse(this)[0];
            mouseClicked = true;
          })
          .call(zoom);

    function rotateMap(endX) {
      projection.rotate([(rotated + (endX - initX) * degrees) / (s * mapWidth),0,0]);

      harbourSvg.selectAll("path")
         .attr("d", path);
    };

    function zoomended(){
      if(s !== 1) return;
      if (mouseClicked === true) {
        return;
      }
      else {
        rotated = rotated + ((mouse[0] - initX) * degrees / (s * mapWidth));
        mouseClicked = false;
      }
    };

    function zoomed() {
      var t = [d3.event.transform.x,d3.event.transform.y];
      s = d3.event.transform.k;
      var h = 0;

      t[0] = Math.min(
        (mapWidth/mapHeight)  * (s - 1),
        Math.max( mapWidth * (1 - s), t[0] )
      );


      t[1] = Math.min(
        h * (s - 1) + h * s,
        Math.max(mapHeight  * (1 - s) - h * s, t[1])
      );


      harbourSvg.attr("transform", "translate(" + t + ")scale(" + s + ")");
      harbourSvg.selectAll(".harbourloca").attr("transform", function(d){
        return "translate(" + projection([d["Longitude"],d["Latitude"]]) + ")";
      });


      //adjust the stroke width based on zoom level
      d3.selectAll(".countries").style("stroke-width", 1 / s);
      d3.selectAll(".harbourloca").attr("r", function(d){
         return Math.log((harbourSize/d["Weight of waste"])/s) + "px";
       });


      mouse = d3.mouse(this);

      if(s !== 1 && mouseClicked) {
        rotateMap(mouse[0]);
        return;
      }
    }
  }


  // // legend function
  // function Legend() {
  //
  //   // drawing svg for legend
  //   var legendSvg = d3.select("#legend")
  //                     .append("svg")
  //                     .attr("id", "legend-svg")
  //                     .attr("height", margin.height)
  //                     .attr("width", 1.5 * w)
  //                     .append("g")
  //                     .attr("transform", "translate(" + 0.5 * margin.width + ",0)")
  //                     .attr("id", "legend-id")
  //
  //   // x scale for legend
  //   var xScaleLegend = d3.scaleLinear()
  //                   .domain([d3.min(maxWage), d3.max(maxWage)])
  //                   .range([1, w + 2 * margin.width])
  //
  //   // call x-axis legend
  //   var xAxisLegend = d3.axisBottom(xScaleLegend)
  //                       .tickSize(7)
  //                       .tickValues(color.domain())
  //
  //   var legend = d3.select("#legend-id")
  //                  .call(xAxisLegend)
  //
  //   // drawing of the mini bars of the legend
  //   legend.selectAll("rect")
  //            .data(color.range().map(function(d) {
  //              var a = color.invertExtent(d)
  //              if (a[0] == null) a[0] = xScaleLegend.domain()[0];
  //              if (a[1] == null) a[1] = xScaleLegend.domain()[1];
  //              return a;
  //            }))
  //            .enter()
  //            .insert("rect", "tick")
  //            .attr("height", 8)
  //            .attr("width", function(d) { return xScaleLegend(d[1]) - xScaleLegend(d[0]); })
  //            .attr("x", function(d) { return xScaleLegend(d[0]); })
  //            .attr("fill", function(d) { return color(d[0]); })
  //
  //     // text of legend
  //     legend.append("text")
  //               .attr("id", "legend-text")
  //               .attr("text-anchor", "end")
  //               .attr("font-size", "14px")
  //               .attr("fill", "black")
  //               .attr("x", 150)
  //               .attr("y", 35)
  //               .text("Height of average wage")
  // }
  //
  // // call legend
  // Legend();
