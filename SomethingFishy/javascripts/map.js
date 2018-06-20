/*
* Name: Simon Kemmere
* Student number: 10798250
* Course: Programmeerproject
* Description: file containing the script that runs the worldmap
*/

window.onload = function() {

  // queue for loading data
  d3.queue()
    .defer(d3.json, "map.topojson")
    .defer(d3.csv, "plasticWaste.csv")
    .await(createMap);

  // margins, height, width and padding
  var margin = {height: 75, width: 75}
  var h = 450
  var w = 450
  var rotate = 60
  var maxLat = 83;

  // function to make the world map
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

    // projection for map
    var projection = d3.geoMercator()
                       .rotate([rotate, 0])
                       .translate([0.7 * w, 0.5 * h])
                       .scale(0.8);

    // find the top left and bottom right of current projection
    function mercatorBounds(projection, maxLat) {
       var yaw = projection.rotate()[0],
           xymax = projection([-yaw+180-1e-6,-maxLat]),
           xymin = projection([-yaw-180+1e-6, maxLat]);

       return [xymin,xymax];
    }

    // set up the scale extent and initial scale for the projection
    var b = mercatorBounds(projection, maxLat),
       s = w/(b[1][0]-b[0][0]),
       scaleExtent = [s, 10*s];

    projection
       .scale(scaleExtent[0]);

    var zoom = d3.behavior.zoom()
       .scaleExtent(scaleExtent)
       .scale(projection.scale())
       .translate([0,0])               // not linked directly to projection
       .on("zoom", redraw);

    // determine path for map
    var path = d3.geoPath()
                 .projection(projection);

    // svg for map
    var svg = d3.selectAll("body")
               .append("svg")
               .attr("id", "chart")
               .attr("height", h + margin.height)
               .attr("width", 1.5*w + margin.width)
               .append("g")
               .call(zoom);

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
                                  return "Unknown"
                              }}
                              return "The plastic production in " + location(d) + " is " + production(d);
                 });

    // call tip function
    svg.call(mapTip);

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
    // //      .on("click", swapData)

    d3.json("https://raw.githubusercontent.com/d3/d3-geo/master/test/data/world-50m.json", function ready(error, world) {

        svg.selectAll('path')
            .data(topojson.feature(world, world.objects.countries).features)
          .enter().append('path')

        redraw();       // update path data
    });

    // track last translation and scale event we processed
    var tlast = [0,0],
        slast = null;

    function redraw() {
        if (d3.event) {
            var scale = d3.event.scale,
                t = d3.event.translate;

            // if scaling changes, ignore translation (otherwise touch zooms are weird)
            if (scale != slast) {
                projection.scale(scale);
            } else {
                var dx = t[0]-tlast[0],
                    dy = t[1]-tlast[1],
                    yaw = projection.rotate()[0],
                    tp = projection.translate();

                // use x translation to rotate based on current scale
                projection.rotate([yaw+360.*dx/w*scaleExtent[0]/scale, 0, 0]);
                // use y translation to translate projection, clamped by min/max
                var b = mercatorBounds(projection, maxLat);
                if (b[0][1] + dy > 0) dy = -b[0][1];
                else if (b[1][1] + dy < h) dy = h-b[1][1];
                projection.translate([tp[0],tp[1]+dy]);
            }
            // save last values.  resetting zoom.translate() and scale() would
            // seem equivalent but doesn't seem to work reliably?
            slast = scale;
            tlast = t;
        }

        svg.selectAll('path')       // re-project path data
            .attr('d', path);
    }
  }
}
