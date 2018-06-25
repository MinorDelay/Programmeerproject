
// queue for loading data
  function createHarbour(error, map, harbours) {

    if (error) throw error;

    var beginYear = 2014;
    console.log(beginYear)

    selectedData = harbours[0][beginYear];

    console.log(harbours)

    var mapHeight = 500,
    mapWidth = (document.getElementById("harbour").clientWidth),
    rotated = 0
    coords2014 = [],
    waste2014 = [],
    harbour2014 = [],
    coords2015 = [],
    waste2015 = [],
    harbour2015 = [],
    coords2016 = [],
    waste2016 = []
    harbour2016 = [];

     selectedData.forEach(function(d){
       coords2014.push([+d["Longitude"],+d["Latitude"]])
       waste2014.push(d["Weight of waste"]);
       harbour2014.push(d["Harbour"])
     });
     // harbours["harbourData"][0]["2015"].forEach(function(d){
     //   coords2015.push([+d["Longitude"],+d["Latitude"]])
     //   waste2015.push(d["Weight of waste"]);
     // });
     // harbours["harbourData"][0]["2016"].forEach(function(d){
     //   coords2016.push([+d["Longitude"],+d["Latitude"]])
     //   waste2016.push(d["Weight of waste"]);
     // });

    var countries = topojson.feature(map, map.objects.countries1).features;

    var harbourSvg = d3.select("#harbourMap")
                .append("svg")
                .attr("id", "harbours")
                .attr("width", mapWidth)
                .attr("height", mapHeight);
                // .append("g");


    var projection = d3.geoMercator()
                       .scale(mapWidth/3)
                       .translate([mapWidth/2,mapHeight/0.7])
                       .rotate([rotated,0,0]);

    var path = d3.geoPath()
                 .projection(projection);

    harbourSvg.append("g")
          .selectAll(".countries")
          .data(countries)
          .enter()
          .append("path")
          .attr("class", "countries")
          .attr("d", path)
          // .on("mouseover", mapTip.show)
          // .on("mouseout", mapTip.hide)

    harbourSvg.selectAll("circle")
           .data(coords2014)
           .enter()
           .append("circle")
           .attr("class", "harbourloca")
           .attr("transform", function(d){
             return "translate(" + projection([
               d[0],d[1]]) + ")";
           })
           .attr("r", "4px")
           .attr("fill", "red");

    moveMap(harbourSvg, path, mapWidth, mapHeight, rotated, projection, harbourSvg)
    // updateHarbour()
  };

  // function updateHarbour(){
  //
  // }

  // function to make the world map
  function moveMap(harbourSvg, path, mapWidth, mapHeight, rotated, projection, harbourSvg) {



    var initX,
    mouse,
    mouseClicked = false,
    s = 1;

    var zoom = d3.zoom()
                 .scaleExtent([1, 5])
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
      projection.rotate([(rotated + (endX - initX) * 360) / (s * mapWidth),0,0]);

      harbourSvg.selectAll("path")
         .attr("d", path);
    };

    function zoomended(){
      if(s !== 1) return;
      if (mouseClicked === true) {
        return;
      }
      else {
        rotated = rotated + ((mouse[0] - initX) * 360 / (s * mapWidth));
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
        return "translate(" + projection([d[0],d[1]]) + ")";
      });



      //adjust the stroke width based on zoom level
      d3.selectAll(".countries").style("stroke-width", 1 / s);
      console.log('hoi')
      d3.selectAll(".harbourloca").attr("r", 4/s);

      // d3.selectAll(".harbourloca").attr("r", s + "px")

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
