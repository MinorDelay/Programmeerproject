function loadData () {

  d3.csv("plasticWaste.csv", function(plasticData) {
    return plasticData;
  });

  d3.csv("threatenedFish.csv", function(data){
    console.log(data)
  });

  console.log(plasticData)
}
