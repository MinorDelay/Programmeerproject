## Wednesday 6-6-18 / Day 1
- Had our first meeting. Was useful and had a nice introduction with my group.
- Yesterday my project proposal was accepted, it will be in the format as described below.

1. Worldmap where countries are colored, the color represents the amount of plastic that was produced in tonnes in 2010.
2. When clicked on a country a bar chart will appear beside the map where the absolute numbers of endangered fish (total)/marine fish/
sweetwater fish will be presented. Bar chart will change when a different country is clicked.
3. At the side of this bar chart will be a button, that when clicked upon will show a pie chart representing the threatened species as % 
of known species, thus being a interactive html element.
4. Under the worldmap will be a searchbox where data from countries can be searched directly. That means you won't need to search the 
country on the map if you need to see it's data.
5. If there's still time left I'd like to add another element that will show a dot on the map representing a port (harbour). This dot
will represent the amount of plastic in tonnage that this port in 2014 has extracted from the sea. The bigger the dot, the more
plastic was extracted from the ocean. If there's more time I'd like to add a slider that let's the user switch the year and thus the data.

- Today's goal is to make a design document clearly explaining the way I want to handle the abovementioned ideas.

## Thursday 7-6-18 / Day 2
- Updated the readme after the commentary on my proposal.
- Made the data I have accessible in csv format. Now I only need to jsonify it and then I can work with my data.
This will be a job for tomorrow.
- There will be a presentation for tomorrow. My group is at 11. So if there will be extra information online by the time it's 9 AM
tomorrow I can do some preparations.

## Friday 8-6-18 / Day 3
- Gave the introductory presentation of my github and my proposal. Went fine, got a tip to incorporate the oceanflows, so I can visualize
how plastic ends up at the places it does. I think it's a good idea, but doesn't really suit my data and the way I've thought about
implementing it all.
- Wrote a function that loads in the csv files, containing my data, which then transforms my data to a usable format (json).
Still thinking about of I want to keep it this way or if I want to store my data in a actual JSON-file. On monday I'll ask a TA about
this.
- This means that come monday I'll be able to start coding. I'll begin by making the map, then the bar chart, then the pie chart.
Hopefully I can do the first two on monday, because making these are things I've already done before.

## Monday 11-6-18 / Day 4
- Converted data into useful format. Started to work on the worldmap. Got the general outline, but didn't get as far as I'd hoped.
- At the end of the day I realised that I needed to put in a little extra effort, so the slight lack of datapoints can be compensated.
That got me thinking to create a map that can slide when dragging with the mouse, and can zoom when the mousewheel or a movement with
the same capacity gets scrolled.

## Tuesday 12-6-18 / Day 5
- The idea from monday got me looking for an example that could show me how this could be accomplished. At first I only found an example
that used the v3 version of d3. This led to the thought that I should use the old version of d3 throughout my project. At second thought
I remembered what extra trouble this would give thinking back at the course dataprocessing assignment 3. 
- After this range of thoughts I started searching better for an example that could help me create the desired map while using d3v4.
- The example was found but the example would only run when called from the index.html, which I didn't want. After a few hours of
staring I came to the conclusion that I appended the changes (zoom or drag map) to the wrong variable thus meaning that the map
remain stationary.

## Wednesday 13-6-18 / Day 6
- Applied the solutions of the problems from tuesday. Thus meaning that the map works correctly. The only other problem I've encountered
is the fact that the way the countries are colored (the more waste the more intense the coloring), are not ideal. Due to a relatively
high deviation between plasticproduction in certain countries the scaling of those countries is off. Perhaps I should work on a more
logarithmic scale or create buckets containing certain ranges of values who then represent a specific color.
- Made a bar chart without update function. Update function is linked to worldmap. Something to do for next week.

## Thursday 14-6-18 / Day 7
- Started on my scatterplot. Came to the realisation that the way my data was structured is not useable for a scatter (or I don't know
the right way for it). On the other hand I've found an example that should be quite good and useable for the way I want to represent my
data (when the data is correctly structured).

## Friday 15-6-18 / Day 8
- Held a presentations and went to work on my piechart. Didn't get very far, but the things I learned about a piechart were via bl.ocks.org. I decomposed the code in such a way that became clear what every line of code was used for.

## Monday 18-6-18 / Day 9
- Made the pie chart. Had some trouble with the way my data was structured. After some help of a TA I managed to plot the pie chart.
- Made some changes to my storyline.

## Tuesday 19-6-18 / Day 10
- Added a navbar. Still needs to be implemented correctly (aesthetics aren't real smooth).
- Decided to create a main.js that calls all functions (This was a solution for my scripts not loading all at once, which was due to
having window.onload in every scriptfile.).

## Wednesday 20-6-18 / Day 11
- Rewrote the navbar. Works good now. Considering a dropdown menu for each individual visualisation.
- Rewrote my main.js, now everything loads at the right time. A lot of bugs got fixed by this.
- I can show all visualisations at once now. Now I only need to let them interact with eachother.

## Thursday 21-6-18 / Day 12
- Added interaction between barchart and worldmap.
- Added interaction between piechart and worldmap. (almost working, minor bugs)
- Need to add legend, codewise the basis is present for the legend.
- Added extra worldmap. This is for the fourth visualisation, when there's time I'll do that.
- For this extra visualisation I've added a slider.

I think mvp is done.

## Friday 22-6-18 / Day 13
- Gave presenation, got some good feedback on how to solve the problem with the interaction between the worldmap and the piechart.
- Fixed the bug on the interaction between the worldmap and the piechart.

## Monday 25-6-18 / Day 14
- Added 4th visualisation.
- Transformed data for 4th vis.
- Can plot harbours in vis.
- Added dropdown menu for vis.

Still to do:
- Switch to other data year.
- Link data to dropdown menu.
- Fix bug that makes the svg larger instead of zooming in in the svg.



