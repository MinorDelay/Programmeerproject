window.onload = function () {

  d3.queue()
    .defer(d3.json, "javascripts/map.topojson")
    .defer(d3.csv, "./data/plasticWaste.csv")
    .defer(d3.json, "./data/threatenedFish.json")
    .defer(d3.json, "./data/fishPercnew.json")
    .defer(d3.json, "./data/harbours.json")
    .awaitAll(callFunctions);

  function callFunctions(error, response) {
      if (error) throw error;

      loadBar(error, response[2])
      createPie(error, response[3])
      createMap(error, response[0], response[1])
      getHarbourData(error, response[0], response[4])

  }
};
