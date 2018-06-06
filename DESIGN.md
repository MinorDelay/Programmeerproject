## index.html
- Load in javascripts.
  - topojson.js
  - tooltip.js
  - d3.v4.js
  - map.js
  - bar.js
  - pie.js
- Bootstrapping
- Introductory passage on the washed up pilot whale who ate 8kg of plastic,
thus creating a meaningful background story.

## fish.css
- Mainly I'd like to use bootstrap for the change of layout.
- This file will mainly be used to change the way the axes of the charts and the
tooltips are depicted.

## map.js
- Load topojson
- load plastic production data
- create variables for height and with
- make function createMap
- make list(s) of data
- create svg
- scale to specified area
- create tooltip for map
- create colorgradient for countries so color is linked to plastic production

## bar.js
- load threatened fish data
- create svg
- create barchart variable
- create axes

## pie.js
This is an element I haven't done before, so I don't know for certain which steps
I'll have to make before a piechart is produced.
- load threatened fish as % of known fish data
- create svg
- create piechart variable

## swapButton.js
- create function swapData
- determine which data should be swapped
- Swap to pie chart data or bar chart data
- call pie chart or bar chart and give bar of pie new selection of data to plot

## Datasources
- Threatened fish data is in csv format and thus easy to transform via the
built in d3.csv function. (Data for the bar chart)
- Threatened fish as % of known fish is in csv format and thus easy to transform
via the built in d3.csv function. (Data for pie chart)
- Data from topojson is predetermined and in (topo)JSON and thus easily accessible.

Optional:
- Data for ports and how much plastic litter they've collected is in csv format
which is easy to transform via the d3.csv function.
