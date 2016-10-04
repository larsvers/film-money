// Each story item (or p/div element telling the story) gets a data-action attribute when set-up, defining the action that it triggers.
// These actions are just integers from 0 to x - an index - but stand for an event handler defined in the handler namespace.
// For better readability the index of the plotpoint in the story are the same as the index for these handlers.
// This hash-table associates the right handler ('action') to this action-index.


// --- API args --- //

// data: data
// value: biggest_budgets, most_profitable, biggest_money_losers, low_budget_winners
// xVar: start_value, production_budget, domestic_gross, worldwide_gross
// zVar: rating_imdb, rating_rt
// yAxisFlag: true (no axes), false (axes)
// sortVar: start_value, production_budget, domestic_gross, worldwide_gross
// baseFlag: true (show baseline circles), false (don't show baseline circles)
// ratingFlag: : true (rating is on), false (rating is off)

var storyLookup = {};


storyLookup[100] = function(data) { 

	if (!config.pageload) {

		handler.pressed(undefined, 'pp_start_value'); 
		
		setTimeout(function() { handler.plotpoint.initial(data); }, 1000); // a little delay to let the globals change (specifically onlyYaxis needs a tick to change and disallow the x-axis to show)		

	} // don't run on page load, only run when scrolled to it

};


storyLookup[0] = function(data) { 

	
	handler.plotpoint.initial(data); 

}; 

storyLookup[1] = function(data) { 

	
	handler.plotpoint.initial(data); 

}; 

storyLookup[2] = function(data) { 

	config.keyValue = 'biggest_budgets';
	config.varX = 'production_budget';
	config.varZ = '';
	config.onlyYaxis = false;
	config.sortBy = 'production_budget';
	config.baseline = false;
	config.rating = false;
	
	handler.plotpoint.compose(data); 

}; 

storyLookup[3] = function(data) { 

	config.keyValue = 'biggest_budgets';
	config.varX = 'production_budget';
	config.varZ = '';
	config.onlyYaxis = false;
	config.sortBy = 'production_budget';
	config.baseline = false;
	config.rating = false;
	
	handler.plotpoint.compose(data); 

	handler.showGenreBar();

}; 

storyLookup[4] = function(data) { 

	config.keyValue = 'biggest_budgets';
	config.varX = 'domestic_gross';
	config.varZ = '';
	config.onlyYaxis = false;
	config.sortBy = 'production_budget';
	config.baseline = true;
	config.rating = false;
	
	handler.plotpoint.compose(data); 

}; 

storyLookup[5] = function(data) { 

	config.keyValue = 'biggest_budgets';
	config.varX = 'domestic_gross';
	config.varZ = '';
	config.onlyYaxis = false;
	config.sortBy = 'domestic_gross';
	config.baseline = true;
	config.rating = false;
	
	handler.plotpoint.compose(data); 

}; 

storyLookup[6] = function(data) { 

	// no action here

}; 

storyLookup[7] = function(data) { 

	config.keyValue = 'biggest_budgets';
	config.varX = 'worldwide_gross';
	config.varZ = '';
	config.onlyYaxis = false;
	config.sortBy = 'domestic_gross';
	config.baseline = true;
	config.rating = false;
	
	handler.plotpoint.compose(data); 

}; 

storyLookup[8] = function(data) { 

	config.keyValue = 'biggest_budgets';
	config.varX = 'worldwide_gross';
	config.varZ = '';
	config.onlyYaxis = false;
	config.sortBy = 'worldwide_gross';
	config.baseline = true;
	config.rating = false;
	
	handler.plotpoint.compose(data); 

}; 

storyLookup[9] = function(data) { 

	config.keyValue = 'biggest_budgets';
	config.varX = 'worldwide_gross';
	config.varZ = 'rating_imdb';
	config.onlyYaxis = false;
	config.sortBy = 'rating_imdb';
	config.baseline = true;
	config.rating = true;
	
	handler.plotpoint.compose(data); 

}; 

storyLookup[10] = function(data) { 

	config.keyValue = 'biggest_budgets';
	config.varX = 'worldwide_gross';
	config.varZ = 'rating_rt';
	config.onlyYaxis = false;
	config.sortBy = 'rating_imdb';
	config.baseline = true;
	config.rating = true;
	
	handler.plotpoint.compose(data); 

}; 

storyLookup[11] = function(data) { 

	config.keyValue = 'most_profitable';
	config.varX = 'start_value';
	config.varZ = '';
	config.onlyYaxis = false;
	config.sortBy = 'production_budget';
	config.baseline = false;
	config.rating = false;
	
	handler.plotpoint.compose(data); 

}; 

storyLookup[12] = function(data) { 

	// empty

}; 

storyLookup[13] = function(data) { 

	config.keyValue = 'most_profitable';
	config.varX = 'production_budget';
	config.varZ = '';
	config.onlyYaxis = false;
	config.sortBy = 'production_budget';
	config.baseline = false;
	config.rating = false;
	
	handler.plotpoint.compose(data); 

}; 

storyLookup[14] = function(data) { 

	config.keyValue = 'most_profitable';
	config.varX = 'domestic_gross';
	config.varZ = '';
	config.onlyYaxis = false;
	config.sortBy = 'production_budget';
	config.baseline = true;
	config.rating = false;
	
	handler.plotpoint.compose(data); 

}; 

storyLookup[15] = function(data) { 

	config.keyValue = 'most_profitable';
	config.varX = 'worldwide_gross';
	config.varZ = '';
	config.onlyYaxis = false;
	config.sortBy = 'worldwide_gross';
	config.baseline = true;
	config.rating = false;
	
	handler.plotpoint.compose(data); 

}; 

storyLookup[16] = function(data) { 

	config.keyValue = 'most_profitable';
	config.varX = 'worldwide_gross';
	config.varZ = 'rating_imdb';
	config.onlyYaxis = false;
	config.sortBy = 'worldwide_gross';
	config.baseline = true;
	config.rating = true;
	
	handler.plotpoint.compose(data); 

}; 

storyLookup[17] = function(data) { 

	config.keyValue = 'biggest_money_losers';
	config.varX = 'start_value';
	config.varZ = '';
	config.onlyYaxis = false;
	config.sortBy = 'production_budget';
	config.baseline = false;
	config.rating = false;
	
	handler.plotpoint.compose(data); 

}; 

storyLookup[18] = function(data) { 

	config.keyValue = 'biggest_money_losers';
	config.varX = 'start_value';
	config.varZ = '';
	config.onlyYaxis = false;
	config.sortBy = 'production_budget';
	config.baseline = false;
	config.rating = false;
	
	handler.plotpoint.compose(data); 

}; 

storyLookup[19] = function(data) { 

	config.keyValue = 'biggest_money_losers';
	config.varX = 'production_budget';
	config.varZ = '';
	config.onlyYaxis = false;
	config.sortBy = 'production_budget';
	config.baseline = false;
	config.rating = false;
	
	handler.plotpoint.compose(data); 

}; 

storyLookup[20] = function(data) { 

	config.keyValue = 'biggest_money_losers';
	config.varX = 'domestic_gross';
	config.varZ = '';
	config.onlyYaxis = false;
	config.sortBy = 'production_budget';
	config.baseline = true;
	config.rating = false;
	
	handler.plotpoint.compose(data); 

}; 

storyLookup[21] = function(data) { 

	config.keyValue = 'biggest_money_losers';
	config.varX = 'worldwide_gross';
	config.varZ = '';
	config.onlyYaxis = false;
	config.sortBy = 'production_budget';
	config.baseline = true;
	config.rating = false;
	
	handler.plotpoint.compose(data); 

}; 

storyLookup[22] = function(data) { 

	config.keyValue = 'biggest_money_losers';
	config.varX = 'worldwide_gross';
	config.varZ = 'rating_rt';
	config.onlyYaxis = false;
	config.sortBy = 'production_budget';
	config.baseline = true;
	config.rating = true;
	
	handler.plotpoint.compose(data); 

}; 

storyLookup[23] = function(data) { 

	config.keyValue = 'low_budget_winners';
	config.varX = 'start_value';
	config.varZ = '';
	config.onlyYaxis = false;
	config.sortBy = 'production_budget';
	config.baseline = false;
	config.rating = false;
	
	handler.plotpoint.compose(data); 

}; 

storyLookup[24] = function(data) { 

	// no action here

}; 

storyLookup[25] = function(data) { 

	config.keyValue = 'low_budget_winners';
	config.varX = 'production_budget';
	config.varZ = '';
	config.onlyYaxis = false;
	config.sortBy = 'production_budget';
	config.baseline = false;
	config.rating = false;
	
	handler.plotpoint.compose(data); 

}; 

storyLookup[26] = function(data) { 

	config.keyValue = 'low_budget_winners';
	config.varX = 'start_value';
	config.varZ = '';
	config.onlyYaxis = false;
	config.sortBy = 'production_budget';
	config.baseline = false;
	config.rating = false;
	
	handler.plotpoint.compose(data); 

}; 

storyLookup[27] = function(data) { 

	config.keyValue = 'low_budget_winners';
	config.varX = 'production_budget';
	config.varZ = '';
	config.onlyYaxis = false;
	config.sortBy = 'production_budget';
	config.baseline = false;
	config.rating = false;
	
	handler.plotpoint.compose(data); 

}; 

storyLookup[28] = function(data) { 

	config.keyValue = 'low_budget_winners';
	config.varX = 'start_value';
	config.varZ = '';
	config.onlyYaxis = false;
	config.sortBy = 'production_budget';
	config.baseline = false;
	config.rating = false;
	
	handler.plotpoint.compose(data); 

}; 

storyLookup[29] = function(data) { 

	// no action here

}; 

storyLookup[30] = function(data) { 

	
	handler.plotpoint.pp_production_budget_scaled(data);

}; 

storyLookup[31] = function(data) { 

	config.keyValue = 'low_budget_winners';
	config.varX = 'production_budget';
	config.varZ = '';
	config.onlyYaxis = false;
	config.sortBy = 'production_budget';
	config.baseline = false;
	config.rating = false;
	
	handler.plotpoint.compose(data); 

}; 

storyLookup[32] = function(data) { 

	config.keyValue = 'low_budget_winners';
	config.varX = 'domestic_gross';
	config.varZ = '';
	config.onlyYaxis = false;
	config.sortBy = 'production_budget';
	config.baseline = true;
	config.rating = false;
	
	handler.plotpoint.compose(data); 

}; 

storyLookup[33] = function(data) { 

	config.keyValue = 'low_budget_winners';
	config.varX = 'worldwide_gross';
	config.varZ = '';
	config.onlyYaxis = false;
	config.sortBy = 'production_budget';
	config.baseline = true;
	config.rating = false;
	
	handler.plotpoint.compose(data); 

}; 

storyLookup[34] = function(data) { 

	config.keyValue = 'low_budget_winners';
	config.varX = 'worldwide_gross';
	config.varZ = '';
	config.onlyYaxis = false;
	config.sortBy = 'worldwide_gross';
	config.baseline = true;
	config.rating = false;
	
	handler.plotpoint.compose(data); 

}; 
















/* how to change state during a scroll-story ?

2 options: 

1) as I have done it: 
write handlers drawing 'state-primitives' where each primitive changes the state of one (or as few as possible) variables
for each plotpoint trigger one or more handlers to achieve the composed (it's not really composed - it's rather sequenced) view

2) an alternative:
write a single handler that can change each input based on a number of arguments

benefit of 1 is that it rather composes the handlers, 
but it re-renders the entire chart for each fired hanlder.
It also makes the code less readable when there are a number of variables to update
Finally, it allows better control over forward and backward scrolling

Maybe a compromise is best, by haveing a 

(1) changeVariables handler changing the dataset (keyValue), xVar, on;onlyYaxis baseline and scalefactor
(2) rating handler dealing if and if so which rating to apply
(3) sort handler determining how to sort the data and finally a 
(4) button handler dealing with which buttons should be pressed

rather than having a system roughly aligned with the general state of the view

>> re-write in storyLookupTest.js

3) How I have done it

Stream 1: The chart and its parts
Data gets loaded
Initial chart gets coded in a reusable pattern

function chart() {
	
	var colour, 
			size;

			// more exposed variables

	function my(selection) {
		
		selection.each(data) {
			
			// build chart ...

			circles	
					.attr('r', size)
					.style('color', colour);

			// ... build chart

		}

	}

	my.colour = function(_) {
		if (!arguments.length) return colour;
		colour = _;
		return my;
	}

	my.size = function(_) {
		if (!arguments.length) return size;
		size = _;
		return my;
	}

}

All exposed chart parts (parts that state can change) are kept in globals

globals.colour = 'green';
globals.size = 3;

Stream 2: The story and its actions
The story gets written in a json file - one JSON-object is a segment

{
	"story":
	{
		"main": [
			{
				"id": 0,
				"action": [0],
				"text": "This is the first segment of my scroll-story, triggering action 0"
			},
			{
				"id": 1,
				"action": [1],
				"text": "This would be the second segment triggering action 1"
			},
			{
				"id": 2,
				"action": [],
				"text": "This story segment doesn't trigger any action"
			},
			{
				"id": 3,
				"action": [3],
				"text": "And this fourth segment triggers action 3..."
			},

			... more story segments ...

		]		
	} 
}


As you can see each segment has an increasing ID and an action property which coincides with the index for better readability/debugging
The DOM gets joined with the JSON to build the story and each DOM element holds the text and the action-index. Something like:

	d3.select('#explanations').selectAll('p.story')
			.data(story)
			.enter()
		.append('p')
			.classed('story', true)
			.attr('data-action', function(d) { return d.action; }) // add data to markup which we use later in events to trigger actions
			.html(function(d) { return d.text; });


Stream 3: Connecting the story and the chart

A lookup-table holds a bespoke set of actions per action-index 
A generic handler (1) has access to each global and (2) re-draws the chart with the global settings (either changed or not)

A timeline:
> Scroll to element 1
> A scroll-listener (which has access to the data - as in sitting within the ajax load function) listens to the index number
> and will access the appropriate lookup-table as in lookup[1]
> the lookup table will run the function (we will pass it our data). For element 1, for example:

lookup[1] = function(data) {
	
	// --- change the state --- //
	global.colour = 'red'; // change the global.colour
	global.size = global.size; // don't change global.size
	
	// --- run the handler --- //

	handler(data);

}

> now the handler will build the chart with the changed global parameters

handler = function(data) {

	// --- compose the chart --- //
	var newChart = chart()
		.colour(global.colour)
		.size(global.size);

	d3.select('#container')
		.datum(data)
		.call(newChart);
	
}


*/ 