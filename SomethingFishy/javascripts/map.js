/*
* Name: Simon Kemmere
* Student number: 10798250
* Course: Programmeerproject
* Description: File containing the map script which draws the main map.
*/


// create global variable
var plasticWaste;

/*
Function that creates the worldmap for plastic data. Firstly data is made accessible.
Svg is drawn, tooltip is made, and countries are drawn. Next functions are
called.
*/
function createPlasticMap(error, map, data) {

  if (error) throw error;

  // create variables for drawing svg and accessing data
  plasticData = data;
  var mapHeight = 650,
  mapPadding = 30,
  mapWidth = (document.getElementById("worldmap").clientWidth) - mapPadding,
  rotated = 0,
  mapScale = 6.5,
  xMap = 2,
  yMap = 1.5,
  plasticPerCountry = [],
  maxProd = [],
  myCountries = [];

  // write data to seperate lists
  plasticData.forEach(function(d) {
    plasticPerCountry.push({[d.Country] : +d.Waste});
    maxProd.push(+d.Waste);
    myCountries.push(d.Country);
  });

  // determine min and max of plastic data for domain and range purposes
  var maxPlastic = d3.max(maxProd),
  minPlastic = d3.min(maxProd),
  countries = topojson.feature(map, map.objects.countries1).features;

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
                    if (myCountries.includes(d.properties.name)){
                       var a = myCountries.indexOf(d .properties.name)
                       return myCountries[a];
                    }
                    else {
                      return d.properties.name;
                    }
                  }

                  // if country is in data, determine plastic production
                  var production = function (d){
                    if (myCountries.includes(d.properties.name)){
                      var a = myCountries.indexOf(d.properties.name)
                      return maxProd[a] + " tonnes.";
                    }
                    else {
                      return "unknown.";
                    }
                  }
                    // return location and plastic production in tooltip
                    return "The plastic production in " + location(d) + " is " + production(d);
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
        .on("mouseover", mapTip.show)
        .on("mouseout", mapTip.hide)
        .on("click", function (d){
          swapBarData(d);
          swapPieData(d);
        });

  // color countries containing data correspondingly
  colorPlastic();

  // call functions for the movement of the map and the legend
  moveMaps(mapSvg, path, mapWidth, mapHeight, rotated, projection);
  Legend(mapWidth, minPlastic, maxPlastic, color);

};

/*
This function determines which color a country should get.
Colors are determined via a bucketsystem. If a value matches a bucket
a certain color is attributed.
*/
function colorPlastic() {

  var svg = d3.select("#mapWorld");

  // select all countries on svg
  svg.selectAll("path.countries")
     .attr("fill", function(d) {

        plasticWaste = 0;

        // determine what the amount of waste is for every country containing data
        plasticData.forEach(function(e){
            if (e["Country"] === d.properties.name) {
            plasticWaste = e["Waste"];
          }
        });

        // assign color to certain country, depending on plastic production
        if (plasticWaste > 0) {
          switch (true) {
            case (plasticWaste <= 10000):
              return "#87CEFA";
            case (plasticWaste <= 100000):
              return "#00BFFF";
            case (plasticWaste <= 1000000):
              return "#1E90FF";
            case (plasticWaste <= 10000000):
              return "#0000FF";
            case (plasticWaste <= 100000000):
              return "#00008B";
          }
        }
        else {
          return "lightgrey";
        }
  });
}

/*
Function that determines the colorscaling of the legend. Legend is necessary
to explain to the user what the colorscaling used in the worldmap represents.
*/
function Legend(mapWidth, minPlastic, maxPlastic, color) {

  // set pie chart title to corresponding data
  document.getElementById("legendTitle").innerHTML = "Legend";

  // create variables needed to draw and color legend
  var legendHeight = 75,
  color = d3.scaleThreshold()
            .domain([10000,
                    100000,
                    1000000,
                    10000000,
                    100000000])
            .range(["#87CEFA", "#00BFFF", "#1E90FF", "#0000FF", "#00008B"]);

  // drawing svg for legend
  var legendSvg = d3.select("#mapLegend")
                    .append("svg")
                    .attr("id", "mapLegendSvg")
                    .attr("height", legendHeight)
                    .attr("width", mapWidth)
                    .append("g")
                    .attr("id", "mapLegend-id");

  // x scale for legend
  var xScaleLegend = d3.scaleLinear()
                       .domain([minPlastic, maxPlastic])
                       .range([1, mapWidth]);

  // call x-axis legend
  var xAxisLegend = d3.axisBottom(xScaleLegend)
                      .tickSize(7)
                      .tickValues(color.domain());

  var legend = d3.select("#mapLegend-id")
                 .call(xAxisLegend);

  // drawing of the mini bars of the legend
  legend.selectAll("rect")
        .data(color.range().map(function(d) {
          var a = color.invertExtent(d)
          if (a[0] == null) a[0] = xScaleLegend.domain()[0];
          if (a[1] == null) a[1] = xScaleLegend.domain()[1];
          return a;
        }))
        .enter()
        .append("rect", "tick")
        .attr("height", 8)
        .attr("width", function(d) {
          return mapWidth / 5;
        })
        .attr("x", function(d,i) {
          return i * (mapWidth/5);
        })
        .attr("fill", function(d) {
          return color(d[0]);
        });

  // text of legend
  legend.append("text")
            .attr("id", "legend-text")
            .attr("text-anchor", "end")
            .attr("font-size", "14px")
            .attr("fill", "black")
            .attr("x", 250)
            .attr("y", 35)
            .text("Height of plastic production (in tonnes)");
}
