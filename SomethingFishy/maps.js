window.onload = function () {

// queue for loading data
d3.queue()
  .defer(d3.json, "map.topojson")
  .defer(d3.csv, "plasticWaste.csv")
  .await(createMap);

  var width = 700,
  height = 500,
  initX,
  mouseClicked = false,
  s = 1,
  rotated = 0;

  //need to store this because on zoom end, using mousewheel, mouse position is NAN
  var mouse;

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

    var svg = d3.select("body")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g");


    var projection = d3.geoMercator()
                       .scale(115)
                       .translate([width/2,height/1.5])
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
                                     return "unknown"
                                 }}
                                 return "The plastic production in " + location(d) + " is " + production(d);
                    });

    // call tip function
    svg.call(mapTip);

    d3.json("https://unpkg.com/world-atlas@1/world/110m.json", function(error, world) {
      if(error) throw error;

      // drawing countries and select tooltip
      svg.selectAll(".countries")
         .data(countries)
         .enter()
         .append("path")
         .attr("class", "countries")
         .attr("d", path)
         .style("fill", function(d) {
           if (myCountries.includes(d.properties.name)){
             var a = myCountries.indexOf(d.properties.name)
             return "rgba(0," + ((maxProd[a] / maxPlastic) * 255)+ ", 50, 0.6)"
           }
           else {
             return "pink";
           }
         })
         .on("mouseover", mapTip.show)
         .on("mouseout", mapTip.hide)
    });

    moveMap(svg, path)
  }

  // function to make the world map
  function moveMap(svg, path) {

    var zoom = d3.zoom()
                 .scaleExtent([1, 5])
                 .on("zoom", zoomed)
                 .on("end", zoomended);

    svg.on("wheel", function() {
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

      svg.selectAll("path")
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

      svg.attr("transform", "translate(" + t + ")scale(" + s + ")");

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
}
