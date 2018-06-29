/*
* Name: Simon Kemmere
* Student number: 10798250
* Course: Programmeerproject
* Description: File containing the map script which draws the main map.
*/


/*
Function that creates the worldmap with fish data. Firstly data is made accessible.
Svg is drawn, tooltip is made, and countries are drawn. Next functions are
called.
*/

function createFishMap(error, map, data){

  if (error) throw error;

  // create variables for drawing svg and accessing data
  fishData = data;
  var mapHeight = 650,
  mapPadding = 30,
  mapWidth = (document.getElementById("worldmap").clientWidth) - mapPadding,
  rotated = 0,
  mapScale = 6.5,
  xMap = 2,
  yMap = 1.5,
  country = Object.keys(fishData[0]);


  // determine min and max of plastic data for domain and range purposes
  var countries = topojson.feature(map, map.objects.countries1).features;

  // create svg for worldmap
  var mapSvg = d3.select("#map")
                 .append("svg")
                 .attr("id", "mapWorld")
                 .attr("width", mapWidth)
                 .attr("height", mapHeight)
                 .append("g")
                 .attr("id", "map-g");

  // create projection
  var projection = d3.geoMercator()
                     .scale(mapWidth/mapScale)
                     .translate([mapWidth/xMap,mapHeight/yMap])
                     .rotate([rotated,0,0]);

  // create path using projection
  var path = d3.geoPath()
               .projection(projection);

  // create tooltip that returns a label for selected country
  var mapTip = d3.tip()
                .attr("class", "map-tip")
                .offset([0, 0])
                .html(function(d) {

                  // determine the name of the country
                  var location = function (d){
                    if (country.includes(d.properties.name)){
                       var a = country.indexOf(d .properties.name)
                       return country[a];
                    }
                    else {
                      return d.properties.name;
                    }
                  }

                  // if country is in data, determine plastic production
                  var fishy = function (d){
                    if (country.includes(d.properties.name)){
                      return "known, click me!";
                    }
                    else {
                      return "unknown.";
                    }
                  }
                    // return location and whether  production in tooltip
                    return "Data about threatened fishspecies in " + location(d) + " is " + fishy(d);
                  });

  // call tip function
  mapSvg.call(mapTip);

  // draw all countries on the svg
  mapSvg.selectAll(".countries")
        .data(countries)
        .enter()
        .append("path")
        .attr("class", "countries")
        .attr("d", path)
        .style("fill", function(d) {
         if (country.includes(d.properties.name)){
           return "royalblue";
         }
         else {
           return "lightgrey";
         }
       })
        .on("mouseover", mapTip.show)
        .on("mouseout", mapTip.hide)
        .on("click", function (d){
          swapBarData(d);
          swapPieData(d);
        });

  // call function from map.js so user can move around in the map
  moveMaps(mapSvg, path, mapWidth, mapHeight, rotated, projection);
}
