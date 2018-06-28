/*
* Name: Simon Kemmere
* Student number: 10798250
* Course: Programmeerproject
* Description: File containing the main script which calls all other functions
* necessary to show the endproduct.
*/

// wait until all data is loaded before calling all functions
window.onload = function () {

  d3.queue()
    .defer(d3.json, "javascripts/map.topojson")
    .defer(d3.json, "./data/plasticWaste.json")
    .defer(d3.json, "./data/threatenedFish.json")
    .defer(d3.json, "./data/fishPercnew.json")
    .defer(d3.json, "./data/harbours.json")
    .awaitAll(callFunctions);

  // after all data is loaded give each function the correct response
  function callFunctions(error, response) {
      if (error) throw error;

      loadBar(error, response[2])
      createPie(error, response[3])
      createMap(error, response[0], response[1])
      getHarbourData(error, response[0], response[4])

  }
};
