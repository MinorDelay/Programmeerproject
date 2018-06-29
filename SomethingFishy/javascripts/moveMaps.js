/*
* Name: Simon Kemmere
* Student number: 10798250
* Course: Programmeerproject
* Description: File containing the map script which adds interactivity with the
* map. This interactivity is defined as being able to pan and zoom the map.
*/


/*
Function that adds user interactivity to the worldmap. Makes the map zoom and
draggable. This is accomplished using the functionality of projection.
*/
function moveMaps(mapSvg, path, mapWidth, mapHeight, rotated, projection) {

  // instantiate variables needed to make the zoom and dragfunction work
  var initX,
  mouse,
  minZoom = 1,
  maxZoom = 5,
  degrees = 360,
  mouseClicked = false,
  s = 1;

  // determine how far a user can zoom
  var zoom = d3.zoom()
               .scaleExtent([minZoom, maxZoom])
               .on("zoom", zoomed)
               .on("end", zoomended);

  // notices whether the user interacts with the map via the mouse
  mapSvg.on("wheel", function() {

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
    projection.rotate([(rotated + (endX - initX) * degrees) / (s * mapWidth), 0, 0]);

    mapSvg.selectAll("path")
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
    mapSvg.attr("transform", "translate(" + t + ")scale(" + s + ")");

    //adjust the stroke width based on zoom level
    d3.selectAll(".countries").style("stroke-width", 1 / s);

    mouse = d3.mouse(this);

    // rotatemap after user has zoomed in and has dragged the map
    if(s !== 1 && mouseClicked) {
      rotateMap(mouse[0]);
      return;
    }
  }
}
