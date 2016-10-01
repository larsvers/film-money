// Each story item (or p/div element telling the story) gets a data-action attribute when set-up, defining the action that it triggers.
// These actions are just integers from 0 to x - an index - but stand for an event handler defined in the handler namespace.
// This hash-table associates the right handler ('action') to this action-index.

var storyLookup = {};

storyLookup[0] = function(data) { handler.pressed(undefined, 'pp_start_value'); handler.plotpoint.pp_start_value(data); };
storyLookup[1] = function(data) { handler.pressed(undefined, 'pp_production_budget'); handler.plotpoint.pp_production_budget(data); };
storyLookup[2] = function(data) { handler.pressed(undefined, 'pp_domestic_gross'); handler.plotpoint.pp_domestic_gross(data); };
storyLookup[3] = function(data) { handler.pressed(undefined, 'pp_worldwide_gross'); handler.plotpoint.pp_worldwide_gross(data); };
storyLookup[4] = function(data) { handler.sort(undefined, data, 'domestic_gross'); };
storyLookup[5] = function(data) { handler.sort(undefined, data, 'production_budget'); };
storyLookup[6] = function(data) { handler.pressed(undefined, 'rating_imdb'); handler.ratings(undefined, data, 'rating_imdb'); };
storyLookup[7] = function(data) { handler.pressed(undefined, 'rating_rt'); handler.ratings(undefined, data, 'rating_rt'); };
storyLookup[8] = function(data) { handler.changeDataset(undefined, data, 'most_profitable'); };
storyLookup[9] = function(data) { handler.changeDataset(undefined, data, 'biggest_money_losers'); };
storyLookup[10] = function(data) { handler.sort(undefined, data, 'worldwide_gross'); };
storyLookup[11] = function(data) { handler.changeDataset(undefined, data, 'low_budget_winners'); };
storyLookup[12] = function(data) { handler.showGenreBar(); };
storyLookup[13] = function(data) { handler.sort(undefined, data, 'rating_imdb'); };
storyLookup[14] = function(data) { handler.sort(undefined, data, 'rating_rt'); };
storyLookup[15] = function(data) { handler.plotpoint.pp_production_budget_scaled(data); };
storyLookup[16] = function(data) {  };

storyLookup[100] = function(data) { 
	handler.pressed(undefined, 'pp_start_value'); 
	setTimeout(function() { handler.plotpoint.initial(data); }, 300); // a little delay to let the globals change (specifically onlyYaxis needs a tick to change and disallow the x-axis to show)
};
