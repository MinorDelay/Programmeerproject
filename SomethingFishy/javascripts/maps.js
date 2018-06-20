// window.onload = function () {

// queue for loading data
d3.queue()
  .defer(d3.json, "javascripts/map.topojson")
  .defer(d3.csv, "./data/plasticWaste.csv")
  .await(createMap);

  var width = document.getElementById("mapCol").clientWidth,
  height = 500,
  initX,
  mouse,
  mouseClicked = false,
  s = 1,
  rotated = 0;

  function createMap(error, map, plasticData) {

    if (error) throw error;
    var plasticPerCountry = [];
    var maxProd = [];
    var myCountries = [];

    plasticData.forEach(function(d) {
      plasticPerCountry.push({[d.Country] : +d.Waste});
      maxProd.push(+d.Waste);
      myCountries.push(d.Country);
    });

    // dictionaries and list for tooltip map
    var maxPlastic = d3.max(maxProd);

    var countries = topojson.feature(map, map.objects.countries1).features;

    var mapSvg = d3.select("#map")
                .append("svg")
                .attr("id", "worldmap")
                .attr("width", width)
                .attr("height", height)
                .append("g");


    var projection = d3.geoMercator()
                       .scale(100)
                       .translate([width/2.1,height/1.5])
                       .rotate([rotated,0,0]);

    var path = d3.geoPath()
                 .projection(projection);

    // create tooltip that returns a label for selected country
    var mapTip = d3.tip()
                  .attr("class", "map-tip")
                  .offset([0, 0])
                  .html(function(d) {
                    var location = function (d){ if (myCountries.includes(d.properties.name)){
                                   var a = myCountries.indexOf(d.properties.name)
                                   return myCountries[a];
                                 }
                                 else {
                                   return d.properties.name;
                               }}
                    var production = function (d){ if (myCountries.includes(d.properties.name)){
                                   var a = myCountries.indexOf(d.properties.name)
                                   return maxProd[a] + " tonnes.";
                                 }
                                 else {
                                     return "unknown."
                                 }}
                                 return "The plastic production in " + location(d) + " is " + production(d);
                    });

    // call tip function
    mapSvg.call(mapTip);

    d3.json("https://unpkg.com/world-atlas@1/world/110m.json", function(error, world) {
      if(error) throw error;

      // drawing countries and select tooltip

      mapSvg.selectAll(".countries")
         .data(countries)
         .enter()
         .append("path")
         .attr("class", "countries")
         .attr("d", path)
         .style("fill", function(d) {
           if (myCountries.includes(d.properties.name)){
             var a = myCountries.indexOf(d.properties.name)
             return "rgba(100," + ((maxProd[a] / maxPlastic) * 255)+ ", 200, 0.6)"
           }
           else {
             return "grey";
           }
         })
         .on("mouseover", mapTip.show)
         .on("mouseout", mapTip.hide)
    });

    moveMap(mapSvg, path)
  }

  // function to make the world map
  function moveMap(mapSvg, path) {

    var zoom = d3.zoom()
                 .scaleExtent([1, 5])
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
      projection.rotate([(rotated + (endX - initX) * 360) / (s * width),0,0]);

      mapSvg.selectAll("path")
         .attr("d", path);
    }

    function zoomended(){
      if(s !== 1) return;
      // rotated = rotated + ((d3.mouse(this)[0] - initX) * 360 / (s * width));
      rotated = rotated + ((mouse[0] - initX) * 360 / (s * width));
      mouseClicked = false;
    }

    function zoomed() {
      var t = [d3.event.transform.x,d3.event.transform.y];
      s = d3.event.transform.k;
      var h = 0;

      t[0] = Math.min(
        (width/height)  * (s - 1),
        Math.max( width * (1 - s), t[0] )
      );


      t[1] = Math.min(
        h * (s - 1) + h * s,
        Math.max(height  * (1 - s) - h * s, t[1])
      );

      mapSvg.attr("transform", "translate(" + t + ")scale(" + s + ")");

      //adjust the stroke width based on zoom level
      d3.selectAll(".countries").style("stroke-width", 1 / s);

      mouse = d3.mouse(this);

      if(s === 1 && mouseClicked) {
        // rotateMap(d3.mouse(this)[0]);
        rotateMap(mouse[0]);
        return;
      }
    }
  }
// }
