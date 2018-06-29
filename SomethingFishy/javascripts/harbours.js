/*
* Name: Simon Kemmere
* Student number: 10798250
* Course: Programmeerproject
* Description: File containing a map script which draws the map, plotting the harbours.
*/

// create global variables
var startYear = 2014, currentYear, s;

/*
Function that determines which year of data should be called from the dataset
and thus should be loaded into the worldmap. Without interaction of the user,
the map will always show the data of 2014. After interaction the visualisation
will show any available data.
*/
function getHarbourData(error, map, harbours) {

  currentYear = startYear;
  createHarbour(error, map, harbours, currentYear);
}

/*
Function that makes the map where harbours are shown over several years.
Variables are initialised, data is made accessible and svg and countries on
svg are drawn.
*/
function createHarbour(error, map, harbours, currentYear) {

  if (error) throw error;

  // determine title of visualisation depending on selected year
  document.getElementById("harbourTitle").innerHTML = "Harbours cleaning their oceans (" + currentYear + ")";

  // declare local variables needed for svg and data accessibility
  selectedData = harbours[0][currentYear];
  s = 1;
  var mapHeight = 400,
  mapPadding = 30,
  mapWidth = (document.getElementById("harbour").clientWidth) - mapPadding,
  rotated = 0,
  mapScale = 1.5,
  xMap = 1.6,
  yMap = 0.6,
  wasteYear = [],
  harbourYear = [];

  // make data accessible by pushing it to lists
  selectedData.forEach(function(d){
   wasteYear.push(d["Weight of waste"]);
   harbourYear.push(d["Harbour"]);
  });

  // determine all countries on worldmap
  var countries = topojson.feature(map, map.objects.countries1).features,

  // determine maximum of collected waste
  harbourMax = d3.max(wasteYear),

  // categorise waste extraction into three groups
  harbourSizeList = [{"size":8, "production": (2/3 * harbourMax), "icon": "> "},
                     {"size":5, "production": (1/3 * harbourMax), "icon": "> "},
                     {"size":2, "production": (1/3 * harbourMax), "icon": "< "}];

  // draw svg
  var harbourSvg = d3.select("#harbourMap")
                     .append("svg")
                     .attr("id", "harbours")
                     .attr("width", mapWidth)
                     .attr("height", mapHeight)
                     .append("g");

  // create projection
  var projection = d3.geoMercator()
                     .scale(mapWidth/mapScale)
                     .translate([mapWidth/xMap,mapHeight/yMap])
                     .rotate([rotated,0,0]);

  // create path using projection
  var path = d3.geoPath()
               .projection(projection);

  // function that returns the size of the harbour after scaling
  var harbourSize = function(d) {
    if (d["Weight of waste"] >= (2/3 * harbourMax)) {
      return harbourSizeList[0]["size"]/s + "px";
    }
    else if (d["Weight of waste"] >= (1/3 * harbourMax)) {
      return harbourSizeList[1]["size"]/s + "px";
    }
    else {
      return harbourSizeList[2]["size"]/s + "px";
    }
  };

  // draw all countries
  harbourSvg.selectAll(".countries")
            .data(countries)
            .enter()
            .append("path")
            .attr("class", "harbours")
            .attr("d", path);

  // draw all harbours for selected year
  harbourSvg.selectAll("circle")
            .data(selectedData)
            .enter()
            .append("circle")
            .attr("class", "harbourloca")
            .attr("transform", function(d){
              return "translate(" + projection([d["Longitude"],d["Latitude"]]) + ")";
            })
            .attr("r", harbourSize)
            .attr("fill", "red");

  // call functions for moveability of the map, legend and selection of year
  moveHarbour(harbourSvg, path, mapWidth, mapHeight, rotated, projection, harbourMax, harbourSize);
  harbourLegend(harbourSizeList);
  changeYear(error, map, harbours, currentYear);
}

/*
Function that adds user interactivity to the worldmap. Makes the map zoom and
draggable. This is accomplished using the functionality of projection.
*/
function moveHarbour(harbourSvg, path, mapWidth, mapHeight, rotated, projection, harbourMax, harbourSize) {

  // instantiate variables needed to make the zoom and dragfunction work
  var initX,
  mouse,
  minZoom = 1,
  maxZoom = 10,
  degrees = 360;
  mouseClicked = false,
  s = 1;

  // determine how far a user can zoom
  var zoom = d3.zoom()
               .scaleExtent([minZoom, maxZoom])
               .on("zoom", zoomed)
               .on("end", zoomended);

  // notices whether the user interacts with the map via the mouse
  harbourSvg.on("wheel", function() {

              //zoomend needs mouse coords
              initX = d3.mouse(this)[0];
            })
            .on("mousedown", function() {

              //only if scale === 1
              if(s !== 1) return;

              // determine initial x-value, so later on the delta x can be calculated
              initX = d3.mouse(this)[0];
              mouseClicked = true;
            })
            .call(zoom);

  // determine how far the map is rotated via delta x
  function rotateMap(endX) {

    // rotate projection to new position
    projection.rotate([(rotated + (endX - initX) * degrees) / (s * mapWidth),0,0]);

    harbourSvg.selectAll("path")
       .attr("d", path);
  };

  /*
  function that determines the new coordinates of the projection after
  the users stops with zooming in.
  */
  function zoomended(){

    // return if partially zoomed in
    if(s !== 1) return;

    // return if partially zoomed in
    if (mouseClicked === true) {
      return;
    }

    // determine new rotation
    else {
      rotated = rotated + ((mouse[0] - initX) * degrees / (s * mapWidth));
      mouseClicked = false;
    }
  };

  /*
  Function that lets the user zoom in on the map. Bordersizes get rescaled.
  Zoomlocation is dependent on where the cursor of the mouse is at that moment.
  */
  function zoomed() {

    // instantiate variables to register change of x and y events
    var t = [d3.event.transform.x,d3.event.transform.y];
    s = d3.event.transform.k;
    var h = 0;

      // transform x-value after zoom
    t[0] = Math.min(
      (mapWidth/mapHeight)  * (s - 1),
      Math.max( mapWidth * (1 - s), t[0] )
    );

    // transform y-value after zoom
    t[1] = Math.min(
      h * (s - 1) + h * s,
      Math.max(mapHeight  * (1 - s) - h * s, t[1])
    );

    // translate to new x and y value while adding new zoomfactor
    harbourSvg.attr("transform", "translate(" + t + ")scale(" + s + ")");

    // translate harbours to new x and y value while adding new zoomfactor
    harbourSvg.selectAll(".harbourloca").attr("transform", function(d){
      return "translate(" + projection([d["Longitude"],d["Latitude"]]) + ")";
    });

    //adjust the stroke width based on zoom level
    d3.selectAll(".harbours").style("stroke-width", 1 / s);

    // adjust the radius of harbours based on zoom level
    d3.selectAll(".harbourloca").attr("r", harbourSize);

    mouse = d3.mouse(this);

    // rotatemap after user has zoomed in and has draaged the map
    if(s !== 1 && mouseClicked) {
      rotateMap(mouse[0]);
      return;
    }
  }
}

/*
Function that determines the colorscaling of the legend. Legend is necessary
to explain to the user what the colorscaling used in the worldmap represents.
*/
function harbourLegend(harbourSizeList) {

  // create variables needed to draw and color legend
  var legendHeight = 100,
  legendPadding = 30,
  legendWidth = document.getElementById("dropButton").clientWidth - legendPadding,
  border = 1,
  borderColor = "black";

  // drawing svg for legend
  var legend = d3.select("#harbourLegend")
                 .append("svg")
                 .attr("id", "harbourGuide")
                 .attr("width", legendWidth)
                 .attr("height", legendHeight)
                 .attr("border", border);

  // create border around svg
  legend.append("rect")
  			.attr("x", 0)
  			.attr("y", 0)
  			.attr("height", legendHeight)
  			.attr("width", legendWidth)
  			.style("stroke", borderColor)
  			.style("fill", "none")
  			.style("stroke-width", border);

  legend = legend.append("g")
                 .attr("class", "legendHarbour");

  // create positioning of and colors themselves explaining variables
  legend.selectAll("circle")
        .data(harbourSizeList)
        .enter()
        .append("circle")
        .attr("class", "harbourSize")
        .attr("transform", function(d,i) {
          return "translate(20," + (25 + (i * 25)) + ")"
        })
        .attr("r", function(d) {
          return d["size"] + "px";
        })
        .style("fill", "red");

  // determine not only which text should be in the legend, also it's positioning
  legend.selectAll("#harbourSize")
        .data(harbourSizeList)
        .enter()
        .append("text")
        .attr("class", "harbourLegendText")
        .attr("transform", function(d,i) {
          return "translate(35," + (27 + (i * 25)) + ")";
        })
        .text(function(d){
          return d["icon"] + d["production"].toFixed(2) + " tonnes";
        });
}

/*
Function that calls the createHarbour function when a new year of data
is selected by the user. It alsof removes the current svg's of the map and
legend.
*/
function changeYear(error, map, harbours, currentYear){

  // determine which year is selected by the user
  d3.select("select")
    .on("change",function(d){
      var selectedYear = d3.select("#myDropdown").node().value;
      currentYear = selectedYear;

      // remove old svg's so a new one with different data can be drawn
      d3.select("#harbours").remove();
      d3.select("#harbourGuide").remove();

      // call createHarbour function of with new selection of year
      createHarbour(error, map, harbours, currentYear);
    })
}
