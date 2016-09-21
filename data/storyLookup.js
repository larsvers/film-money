// Each story item (or p/div element telling the story) gets a data-action attribute when set-up, defining the action that it triggers.
// These actions are just integers from 0 to x - an index - but stand for an event handler defined in the handler namespace.
// This hash-table associates the right handler ('action') to this action-index.

var storyLookup = {};

storyLookup[0] = function(data) { handler.plotpoint.start_value(data); };
storyLookup[1] = function(data) { handler.plotpoint.production_budget(data); };
storyLookup[2] = function(data) { handler.plotpoint.domestic_gross(data); };
storyLookup[3] = function(data) { handler.plotpoint.worldwide_gross(data); };
storyLookup[4] = function(data) { handler.sort.one(undefined, data, 'domestic_gross'); };
storyLookup[5] = function(data) { handler.sort.one(undefined, data, 'production_budget'); };
storyLookup[6] = function(data) { handler.ratings(undefined, data, 'rating_imdb'); };
storyLookup[7] = function(data) { handler.ratings(undefined, data, 'rating_rt'); };
storyLookup[8] = function(data) { handler.sort.two(undefined, data, 'most_profitable'); };
storyLookup[9] = function(data) { handler.sort.two(undefined, data, 'biggest_money_losers'); };
storyLookup[10] = function(data) { handler.sort.one(undefined, data, 'worldwide_gross'); };
storyLookup[11] = function(data) { handler.sort.two(undefined, data, 'low_budget_winners'); };
