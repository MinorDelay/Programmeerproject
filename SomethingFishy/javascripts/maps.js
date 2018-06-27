
// queue for loading data
  function createMap(error, map, plasticData) {

    if (error) throw error;

    var mapHeight = 650,
    mapPadding = 30,
    mapWidth = (document.getElementById("worldmap").clientWidth) - mapPadding,
    rotated = 0,
    mapScale = 6.5,
    xMap = 2,
    yMap = 1.5,
    red = 100,
    green = 255,
    blue = 200,
    alpha = 0.6,
    plasticPerCountry = [],

    maxProd = [],
    myCountries = [];

    plasticData.forEach(function(d) {
      plasticPerCountry.push({[d.Country] : +d.Waste});
      maxProd.push(+d.Waste);
      myCountries.push(d.Country);
    });

    // dictionaries and list for tooltip map
    var maxPlastic = d3.max(maxProd),
    minPlastic = d3.min(maxProd),
    countries = topojson.feature(map, map.objects.countries1).features,
    color = d3.scaleThreshold()
                 .domain([10000,
                          100000,
                          1000000,
                          10000000,
                          100000000])
                .range(["#005832", "#006932", "#008232", "#009A32", "#00B332"]);

    var mapSvg = d3.select("#map")
                   .append("svg")
                   .attr("id", "worldmap")
                   .attr("width", mapWidth)
                   .attr("height", mapHeight)
                   .append("g");


    var projection = d3.geoMercator()
                       .scale(mapWidth/mapScale)
                       .translate([mapWidth/xMap,mapHeight/yMap])
                       .rotate([rotated,0,0]);

    var path = d3.geoPath()
                 .projection(projection);

    // create tooltip that returns a label for selected country
    var mapTip = d3.tip()
                  .attr("class", "map-tip")
                  .offset([0, 0])
                  .html(function(d) {
                    var location = function (d){
                      if (myCountries.includes(d.properties.name)){
                         var a = myCountries.indexOf(d.properties.name)
                         return myCountries[a];
                      }
                      else {
                        return d.properties.name;
                      }
                    }
                    var production = function (d){
                      if (myCountries.includes(d.properties.name)){
                        var a = myCountries.indexOf(d.properties.name)
                        return maxProd[a] + " tonnes.";
                      }
                      else {
                        return "unknown.";
                      }
                    }
                      return "The plastic production in " + location(d) + " is " + production(d);
                    });

    // call tip function
    mapSvg.call(mapTip);

    mapSvg.selectAll(".countries")
          .data(countries)
          .enter()
          .append("path")
          .attr("class", "countries")
          .attr("d", path)
          .style("fill", function(d) {
           if (myCountries.includes(d.properties.name)){
             var a = myCountries.indexOf(d.properties.name)
             return "rgba(" + red + "," + ((maxProd[a] / maxPlastic) * green)+ "," + blue + "," + alpha + ")";
           }
           else {
             return "lightgrey";
           }
          })
          .on("mouseover", mapTip.show)
          .on("mouseout", mapTip.hide)
          .on("click", function (d){
            swapBarData(d)
            swapPieData(d);
          });

    moveMap(mapSvg, path, mapWidth, mapHeight, rotated, projection)
    Legend(mapWidth, minPlastic, maxPlastic, color)
  };

  // legend function
    function Legend(mapWidth, minPlastic, maxPlastic, color) {

      var legendHeight = 75;

      // drawing svg for legend
      var legendSvg = d3.select("#mapLegend")
                        .append("svg")
                        .attr("id", "mapLegendSvg")
                        .attr("height", legendHeight)
                        .attr("width", mapWidth)
                        .append("g")
                        .attr("id", "mapLegend-id");
                        console.log(minPlastic, maxPlastic)
      // x scale for legend
      var xScaleLegend = d3.scaleLinear()
                      .domain([minPlastic, maxPlastic])
                      .range([1, mapWidth + 2 * legendHeight]);

      // call x-axis legend
      var xAxisLegend = d3.axisBottom(xScaleLegend)
                          .tickSize(7)
                          .tickValues(color.domain())

      var legend = d3.select("#mapLegend-id")
                     .call(xAxisLegend)

      // drawing of the mini bars of the legend
      legend.selectAll("rect")
               .data(color.range().map(function(d) {
                 var a = color.invertExtent(d)
                 if (a[0] == null) a[0] = xScaleLegend.domain()[0];
                 if (a[1] == null) a[1] = xScaleLegend.domain()[1];
                 return a;
               }))
               .enter()
               .insert("rect", "tick")
               .attr("height", 8)
               .attr("width", function(d) {
                 console.log(d)
                 return xScaleLegend(d[1]) - xScaleLegend(d[0]);
               })
               .attr("x", function(d) {
                 return xScaleLegend(d[0]);
               })
               .attr("fill", function(d) {
                 return color(d[0]);
               })

        // text of legend
        legend.append("text")
                  .attr("id", "legend-text")
                  .attr("text-anchor", "end")
                  .attr("font-size", "14px")
                  .attr("fill", "black")
                  .attr("x", 150)
                  .attr("y", 35)
                  .text("Height of average wage")
  }

  // function to make the world map
  function moveMap(mapSvg, path, mapWidth, mapHeight, rotated, projection) {

    var initX,
    mouse,
    minZoom = 1,
    maxZoom = 5,
    degrees = 360,
    mouseClicked = false,
    s = 1;

    var zoom = d3.zoom()
                 .scaleExtent([minZoom, maxZoom])
                 .on("zoom", zoomed)
                 .on("end", zoomended);

    mapSvg.on("wheel", function() {
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

      mapSvg.selectAll("path")
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

      mapSvg.attr("transform", "translate(" + t + ")scale(" + s + ")");

      //adjust the stroke width based on zoom level
      d3.selectAll(".countries").style("stroke-width", 1 / s);

      mouse = d3.mouse(this);

      if(s !== 1 && mouseClicked) {
        rotateMap(mouse[0]);
        return;
      }
    }
  }
