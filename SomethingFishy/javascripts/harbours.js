  var startYear = 2014, currentYear, s;

  function getHarbourData(error, map, harbours) {

    currentYear = startYear;
    createHarbour(error, map, harbours, currentYear);
  }


// queue for loading data
  function createHarbour(error, map, harbours, currentYear) {

    if (error) throw error;

    document.getElementById("harbourTitle").innerHTML = "Harbours cleaning their oceans (" + currentYear + ")";

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

     selectedData.forEach(function(d){
       wasteYear.push(d["Weight of waste"]);
       harbourYear.push(d["Harbour"])
     });

    var countries = topojson.feature(map, map.objects.countries1).features,
    harbourMax = d3.max(wasteYear),
    harbourSizeList = [{"size":8, "production": (2/3 * harbourMax), "icon": "> "},
                       {"size":5, "production": (1/3 * harbourMax), "icon": "> "},
                       {"size":2, "production": (1/3 * harbourMax), "icon": "< "}];

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

    harbourSvg.selectAll(".countries")
          .data(countries)
          .enter()
          .append("path")
          .attr("class", "countries")
          .attr("d", path)

    harbourSvg.selectAll("circle")
           .data(selectedData)
           .enter()
           .append("circle")
           .attr("class", "harbourloca")
           .attr("transform", function(d){
             return "translate(" + projection([
               d["Longitude"],d["Latitude"]]) + ")";
           })
           .attr("r", harbourSize)
           .attr("fill", "red");

    moveHarbour(harbourSvg, path, mapWidth, mapHeight, rotated, projection, harbourMax, harbourSize);
    harbourLegend(harbourSizeList);
    changeYear(error, map, harbours, currentYear);

  };

  function harbourLegend(harbourSizeList) {

  var legendHeight = 100,
  legendPadding = 30,
  legendWidth = document.getElementById("dropButton").clientWidth - legendPadding,
  border = 1,
  bordercolor = "black";

  // create legend
  var legend = d3.select("#harbourLegend")
                 .append("svg")
                 .attr("id", "harbourGuide")
                 .attr("width", legendWidth)
                 .attr("height", legendHeight)
                 .attr("border", border);

  legend.append("rect")
  			.attr("x", 0)
  			.attr("y", 0)
  			.attr("height", legendHeight)
  			.attr("width", legendWidth)
  			.style("stroke", bordercolor)
  			.style("fill", "none")
  			.style("stroke-width", border);

  legend = legend.append("g")
                 .attr("class", "legendHarbour");

  // create color for legend
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
        .style("fill", "red")

  legend.selectAll("#harbourSize")
        .data(harbourSizeList)
        .enter()
        .append("text")
        .attr("class", "harbourLegendText")
        .attr("transform", function(d,i) {
          return "translate(35," + (27 + (i * 25)) + ")"
        })
        .text(function(d){
          return d["icon"] + d["production"].toFixed(2) + " tonnes";
        });
  }

  function changeYear(error, map, harbours, currentYear){

    d3.select("select")
      .on("change",function(d){
        var selectedYear = d3.select("#myDropdown").node().value;
        currentYear = selectedYear;
        d3.select("#harbours").remove();
        d3.select("#harbourGuide").remove();
        createHarbour(error, map, harbours, currentYear);
      })
  }

  // function to make the world map
  function moveHarbour(harbourSvg, path, mapWidth, mapHeight, rotated, projection, harbourMax, harbourSize) {

    var initX,
    mouse,
    minZoom = 1,
    maxZoom = 10,
    degrees = 360;
    mouseClicked = false,
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

      d3.selectAll(".harbourloca").attr("r", harbourSize);

      mouse = d3.mouse(this);

      if(s !== 1 && mouseClicked) {
        rotateMap(mouse[0]);
        return;
      }
    }
  }
