var log = console.log.bind(console);
var dir = console.dir.bind(console);
var hashToObjects = function(_) {

	var keys = d3.keys(_);
	var values = d3.values(_);

	var newarray = [];

	keys.forEach(function(el, i) {

		newarray.push( {'key': el, 'value': values[i]} );

	});

	return newarray;

}; // takes a hashmap / lookup table and turns into an array of objects with key and value properties per object

var getAxisLabel = function(name) {

	return d3.select('.y.axis').selectAll('g > text').filter(function(d) { return d === name; });

};


// === Globals === //

var globals = (function() {

	// plotpoint object used to trigger stages of narrative 
	window.plotpoint = {};
	plotpoint.plotpointSequence = ['pp_start_value', 'pp_production_budget', 'pp_domestic_gross', 'pp_worldwide_gross'];

	window.config = window.config || {};
	config.key = 'category';
	config.keyValue = 'biggest_budgets';
	config.varX = 'start_value';
	config.varY = 'movie';
	config.varZ = 'rating_imdb';
	config.extentX = ['start_value', 'production_budget', 'domestic_gross', 'worldwide_gross'];
	config.extentY = ['movie']; // not really needed in our case
	config.extentZ = ['rating_imdb', 'rating_rt'];
	config.sortBy = 'production_budget';
	config.onlyYaxis = false;
	config.baseline = false;
	config.rating = undefined;

	config.compareTo = 'production_budget';

	config.windowSizeFlag = window.innerWidth < 750 | window.innerHeight < 500 ? true : false;
	window.onresize = function() { log(config.windowSizeFlag); config.windowSizeFlag = window.innerWidth < 750 | window.innerHeight < 500 ? true : false;	};

	// hashtables for lookups
	window.hashSort = {};
	hashSort.production_budget = 'Production Budget';
	hashSort.domestic_gross = 'US Gross';
	hashSort.worldwide_gross = 'Worldwide Gross';
	hashSort.rating_imdb = 'Rating IMDb (1-10)';
	hashSort.rating_rt = 'Rating Rotten Tomatoes (1-10)';

	window.hashKeyValue = {};
	hashKeyValue.biggest_budgets = 'Biggest Budgets';
	hashKeyValue.most_profitable = 'Most profitable';
	hashKeyValue.biggest_money_losers = 'Biggest money losers';
	hashKeyValue.low_budget_winners = 'Low budget winners';

})(); // global namespace





// === Load data, Initial state, Listeners === //

d3.csv("data/movies.csv", type, function(data){


	// --- Initial state --- //

	data = _.sortBy(data, function(el) { return el.production_budget; }); // Sort before feeding into any function. Otherwise the data won't be sorted descendingly but ascendingly
	
	handler.pressed(undefined, 'pp_start_value');
	handler.plotpoint.initial(data);
	
	var listener = (function() {

	// --- Click listener of graph elements (story elements come on specific .js file) --- //

		d3.select('button#pp_start_value').on('mousedown', function() { handler.pressed(this); handler.plotpoint.pp_start_value(data); });

		d3.select('button#pp_production_budget').on('mousedown', function() { handler.pressed(this); handler.plotpoint.pp_production_budget(data); });

		d3.select('button#pp_domestic_gross').on('mousedown', function() { handler.pressed(this); handler.plotpoint.pp_domestic_gross(data); });

		d3.select('button#pp_worldwide_gross').on('mousedown', function() { handler.pressed(this); handler.plotpoint.pp_worldwide_gross(data); });


		d3.selectAll('button.rating').on('mousedown', function() { 

			handler.pressed(this);
			handler.ratings(this, data); 

		}); // button listener
		
		d3.selectAll('li.sortItems').on('mousedown', function() { 
		
			handler.pressed(this);
			handler.sort(this, data); 
		
		}); // sort listener and handler

		d3.selectAll('li.keyValueItems').on('mousedown', function() {

			handler.pressed(this);
			handler.changeDataset(this, data); 

		}); // category = keyValue listener and handler



		// --- Scroll listener --- //

		$('#intro').on('itemfocus', function(event, item) {

			log('intro item index', item.index);

			if (item.data.action === "") return;

			var action = isNaN(item.data.action) ? item.data.action.split(',').map(Number) : [item.data.action]; // convert single number or number of strings to array

			action.forEach(function(el) { storyLookup[el](data); });

			// --- scroll stop if we feel inclined that way - feels a little wrong --- //
			// d3.select('body').classed('stop-scrolling', true);
			// setTimeout(function() { d3.select('body').classed('stop-scrolling', false); }, 1000);

		}); // when item (= element with class .story) gets into focus


		$('#explanations').on('itemfocus', function(event, item) {
		
			log('item index', item.index);

			if (item.data.action === "") return;

			var action = isNaN(item.data.action) ? item.data.action.split(',').map(Number) : [item.data.action]; // convert single number or number of strings to array

			// setTimeout(function() { 
				action.forEach(function(el) { storyLookup[el](data); }); 
			// }, 250);
			

			// --- scroll stop if we feel inclined that way - feels a little wrong --- //
			// d3.select('body').classed('stop-scrolling', true);
			// setTimeout(function() { d3.select('body').classed('stop-scrolling', false); }, 1000);

		}); // when item (= element with class .story) gets into focus

	})(); // click listener namespace

}); // d3.csv() 





// === Select builder === //

var navBuilder = (function() {
	
	// --- Key-value dropdown --- //
	
	d3.select('nav#keyValue > ul').selectAll('.selectItems')
			.data(hashToObjects(hashKeyValue))
			.enter()
		.append('li')
			.classed('selectItems', true)
			.classed('keyValueItems', true)
			.attr('id', function(d) { return d.key; })
			.html(function(d) { return d.value; });

	d3.select('nav#keyValue > ul').classed('hide', true);

	d3.select('nav#keyValue').on('mousedown', function() {

		var el = this;
		$('nav#keyValue ul').width(el.offsetWidth);
		$('nav#keyValue ul').toggleClass('hide');
		$('#keyValue .fa.fa-chevron-circle-up').toggleClass('hide');
		$('#keyValue .fa.fa-chevron-circle-down').toggleClass('hide');
		
	});


	// // --- Sort dropdown --- //
	
	d3.select('nav#sort > ul').selectAll('.selectItems')
			.data(hashToObjects(hashSort))
			.enter()
		.append('li')
			.classed('selectItems', true)
			.classed('sortItems', true)
			.attr('id', function(d) { return d.key; })
			.html(function(d) { return d.value; });

	d3.select('nav#sort > ul').classed('hide', true);

	d3.select('nav#sort').on('mousedown', function() {

		var el = this;
		$('nav#sort ul').width(el.offsetWidth);
		$('nav#sort ul').toggleClass('hide');
		$('#sort .fa.fa-chevron-circle-up').toggleClass('hide');
		$('#sort .fa.fa-chevron-circle-down').toggleClass('hide');
		
	});

})(); // bulding the side-nav





// === Click handler === //

var handler = (function() {

	var my = {};

	my.plotpoint = {};
	
	my.pressed = function(that, value) {

		that = arguments.length === 2 ? $('button#' + value)[0] : that;

		// if the value is changed
		if ($(that).hasClass('value')) {
			$('button.value').removeClass('pressed');			
			$(that).addClass('pressed');
		} 

		// if the rating is changed
		if ($(that).hasClass('rating')) {

			$(that).toggleClass('pressed'); // toggle the pressed button
		
			var c = config.extentZ.slice();
			var a = c.filter(function(el) { return el !== that.id; });

			a.forEach(function(el) {
				d3.select('button#' + el).classed('pressed', false);
			}); // un-presses all other rating buttons
			
		} 

	}; // button handler

	my.plotpoint.initial = function(data) {

		config.keyValue = 'biggest_budgets';
		config.varX = 'start_value';
		config.sortBy = 'production_budget';
		config.onlyYaxis = true;
		config.baseline = false;
		config.rating = false;

		var newChart = chart()
				.key(config.key)
				.keyValue(config.keyValue)
				.margin({ top: 50, right: 20, bottom: 10, left: window.innerWidth/2 })
				.varX(config.varX)
				.varY(config.varY)
				.varZ(config.varZ)
				.extentX(config.extentX)
				.extentY(config.extentY)
				.extentZ(config.extentZ)
				.sortBy(config.sortBy)
				.onlyYaxis(config.onlyYaxis)
				.baseline(config.baseline)
				.rating(config.rating);

		d3.select('div#container')
				.datum(data)
				.call(newChart);

		config.onlyYaxis = false;


		d3.select('#keyValue > .headline > p').html(hashKeyValue[config.keyValue]);
		d3.select('#sort > .headline > p').html(hashSort[config.sortBy]);
		d3.selectAll('button.rating').classed('pressed', false);

	}; // no axes

	my.plotpoint.pp_start_value = function(data) {

		config.varX = 'start_value';
		config.baseline = false;

		var newChart = chart()
				.key(config.key)
				.keyValue(config.keyValue)
				.varX(config.varX)
				.varY(config.varY)
				.varZ(config.varZ)
				.extentX(config.extentX)
				.extentY(config.extentY)
				.extentZ(config.extentZ)
				.sortBy(config.sortBy)
				.onlyYaxis(config.onlyYaxis)
				.baseline(config.baseline)
				.rating(config.rating);

		d3.select('div#container')
				.datum(data)
				.call(newChart);

	}; // films (pp = plotpont)

	my.plotpoint.pp_production_budget = function(data) {

		config.varX = 'production_budget';
		config.baseline = false;

		var newChart = chart()
				.key(config.key)
				.keyValue(config.keyValue)
				.varX(config.varX)
				.varY(config.varY)
				.varZ(config.varZ)
				.extentX(config.extentX)
				.extentY(config.extentY)
				.extentZ(config.extentZ)
				.sortBy(config.sortBy)
				.onlyYaxis(config.onlyYaxis)
				.baseline(config.baseline)
				.rating(config.rating);

		d3.select('div#container')
				.datum(data)
				.call(newChart);

	}; // production budget (pp = plotpont)

	my.plotpoint.pp_domestic_gross = function(data) {

		config.varX = 'domestic_gross';
		config.baseline = true;

		var newChart = chart()
				.key(config.key)
				.keyValue(config.keyValue)
				.varX(config.varX)
				.varY(config.varY)
				.varZ(config.varZ)
				.extentX(config.extentX)
				.extentY(config.extentY)
				.extentZ(config.extentZ)
				.sortBy(config.sortBy)
				.onlyYaxis(config.onlyYaxis)
				.baseline(config.baseline)
				.rating(config.rating);

		d3.select('div#container')
				.datum(data)
				.call(newChart);

	}; // domestic gross (pp = plotpont)

	my.plotpoint.pp_worldwide_gross = function(data) {

		config.varX = 'worldwide_gross';
		config.baseline = true;

		var newChart = chart()
				.key(config.key)
				.keyValue(config.keyValue)
				.varX(config.varX)
				.varY(config.varY)
				.varZ(config.varZ)
				.extentX(config.extentX)
				.extentY(config.extentY)
				.extentZ(config.extentZ)
				.sortBy(config.sortBy)
				.onlyYaxis(config.onlyYaxis)
				.baseline(config.baseline)
				.rating(config.rating);

		d3.select('div#container')
				.datum(data)
				.call(newChart);

	}; // worldwide gross (pp = plotpont)

	my.ratings = function(that, data, value) {

		// set the rating to choose
		var v = arguments.length === 2 ? String(that.id) : value;

		config.varZ = v;
		config.rating = $('button.rating').hasClass('pressed'); // The expression on the right evaluates true if any button.rating has been pressed.

		var newChart = chart()
				.key(config.key)
				.keyValue(config.keyValue)
				.varX(config.varX)
				.varY(config.varY)
				.varZ(config.varZ)
				.extentX(config.extentX)
				.extentY(config.extentY)
				.extentZ(config.extentZ)
				.sortBy(config.sortBy)
				.onlyYaxis(config.onlyYaxis)
				.baseline(config.baseline)
				.rating(config.rating);

		d3.select('div#container')
				.datum(data)
				.call(newChart);


		if (arguments.length === 3) {
			d3.selectAll('button.rating').classed('pressed', false);
			d3.select('button#' + v).classed('pressed', true);
		}

	}; // set new rating

	my.sort = function(that, data, value) {

		var v = arguments.length === 2 ? String(that.id) : value; // check for manual or programmatic input

		config.sortBy = v;

		var newChart = chart()
				.key(config.key)
				.keyValue(config.keyValue)
				.varX(config.varX)
				.varY(config.varY)
				.varZ(config.varZ)
				.extentX(config.extentX)
				.extentY(config.extentY)
				.extentZ(config.extentZ)
				.sortBy(config.sortBy)
				.onlyYaxis(config.onlyYaxis)
				.baseline(config.baseline)
				.rating(config.rating);

		d3.select('div#container')
				.datum(data)
				.call(newChart);

		d3.select('nav#sort p').html(hashSort[v]); // set the value of the nav headline if programmatic

	}; // set new sort

	my.changeDataset = function(that, data, value) {

		var v = arguments.length === 2 ? String(that.id) : value; // check for manual or programmatic input

		config.keyValue = v;
		config.varX = 'start_value';
		config.sortBy = 'production_budget';
		config.baseline = false;
		config.rating = false;

		var newChart = chart()
				.key(config.key)
				.keyValue(config.keyValue)
				.varX(config.varX)
				.varY(config.varY)
				.varZ(config.varZ)
				.extentX(config.extentX)
				.extentY(config.extentY)
				.extentZ(config.extentZ)
				.sortBy(config.sortBy)
				.onlyYaxis(config.onlyYaxis)
				.baseline(config.baseline)
				.rating(config.rating);

		d3.select('div#container')
				.datum(data)
				.call(newChart);


		d3.select('nav#keyValue p').html(hashKeyValue[v]); // set the dataset value in the nav headline if programmatic
		d3.select('nav#sort p').html(hashSort[config.sortBy]); // set the sort value of the nav headline if programmatic
		$('button.value').removeClass('pressed'); 
		$('button.rating').removeClass('pressed'); 
		$('#pp_' + config.varX).addClass('pressed'); 

	}; // set new category

	my.showGenreBar = function() {

		d3.select('#genreMenu').transition().duration(1000).style('opacity', 1);
		
		d3.selectAll('#genreMenu > button').style('pointer-events', 'all').style('cursor', 'pointer');

	};

	return my;

})(); // handler namespace





// === Reusable Chart builder === //

function chart() {

	var key,
			keyValue,
			varX,
			varY,
			varZ,
			extentX,
			extentY,
			extentZ,
			sortBy;

	var margin = { top: 50, right: (window.innerWidth*0.25) , bottom: 10, left: (window.innerWidth*0.25) },
			width = (window.innerWidth) - margin.left - margin.right,
			height = (window.innerHeight/2) - margin.top - margin.bottom;

	var onlyYaxis = false,
			baseline = false,
			rating;


	function my(selection) {


		selection.each(function(data, i) {


			// === Dataprep === //

			var dataNest = d3.nest()
					.key(function(d) { return d[key]; })
					.entries(data)
					.filter(function(el) { return el.key === keyValue; })
					.map(function(el) { return el.values; });
			
			dataNest = dataNest[0];

			dataNest = _.sortBy(dataNest, function(el) { return el[sortBy]; });


			// ===  Measure extents === //

			var objX = measureVars(extentX, varX);
			var objY = measureVars(extentY, varY);
			var objZ = measureVars(extentZ, varZ);

			// log('objX',objX);
			// log('objY',objY);
			// log('objZ',objZ.extent);

			function measureVars(varsExtent, variable) {

				// error handling
				try 				{ if(varsExtent.constructor !== Array) throw 'Pls input an array of variable(s) in the chart composition'; } 
				catch(err) 	{ console.error(err); }

				// extract the variable names
				var varsStr = [];
				varsExtent.map(function(el) { varsStr.push(String(el)); }); 

				// get extent for all vars in questions
				var numbers = [];
				dataNest.forEach(function(el) {
					varsStr.forEach(function(elt) {
						numbers.push(el[elt]);
					});
				}); 

				// create final object 
				var varsObject = {};
				varsObject.extent = d3.extent(numbers);
				varsObject.value = variable;

				return varsObject;

			}


			// ===  Scales === //

			scaleX = d3.scaleLinear().domain([0, objX.extent[1]]).range([0, width]);

			scaleY = d3.scalePoint().domain(dataNest.map(function(el) { return el[objY.value]; })).range([height, 0]).padding(1);

			scaleZ = d3.scaleSqrt().domain([objZ.extent[0], objZ.extent[1]]).range(config.windowSizeFlag ? [2,10] : [3, 20]); // range smaller for small screens
			
			// scaleZCol = d3.scaleSequential(d3.interpolateOrRd).domain(objZ.extent);
			scaleZCol = d3.scaleSequential(d3.interpolatePuRd).domain(objZ.extent);



			var legendBuilder = (function() {
			

				// --- Data prep --- //

				// I want to show a series of 10 circles growing from smallest to largest for teh legend
				// in order to do that I need a uniform distribution of 10 numbers between the lowest to the largest extent
				// d3.range is my friend ! However, d3.range omits the last step (the max value)
				// In order to include it, we have to add the delta between each step to the max value. 
				// in fact this will return an array of roughly 11 uniformly distributed numbers (dep. on the distance as well)
				// Here's how:
				
				var steps = 10;
				var delta = (objZ.extent[1] - objZ.extent[0]) / steps;
				var newExtent = [objZ.extent[0], (objZ.extent[1] + delta)];
				var dataLegend = d3.range(newExtent[0], newExtent[1], delta);


				// --- Create SVG --- //
 
				// Create an element only once after page-load (with the enter selection) - regardless of how many times the data gets updated
				
				var svgL = d3.select('#legend')
						.selectAll('svg.svgL')
						.data([dataLegend]); // data join with a single data element

				var svgEnterL = svgL
						.enter()
					.append('svg'); // manifestation of enter (only happens the first time within a load period)
					
				// d3.select('#legend > svg')
				svgEnterL
						.classed('svgL', true)
						.attr('width', 120)	
						.attr('height', 30); // give the svg attributes


				// --- Create circles and text --- //

				var form = d3.format('.2n');

				var gL = d3.select('svg.svgL') // this M.U.S.T. be a d3.select-selector and can't be the stored variable (here: svgL).  
						.selectAll('g.gl')
						.data(dataLegend, function(d) { return d; });

				var gEnterL = gL
						.enter()
					.append('g')
						.classed('gl', true)
						.attr('transform', function(d,i) { return translateG(100/dataLegend.length * i + 10, 30); });

				gEnterL
					.append('circle')
						.attr('r', function(d) { return scaleZ(d); })
						.style('fill', function(d) { return scaleZCol(d); });

				gEnterL
					.append('text')
						.attr('dy', '-0.6em')
						.attr('text-anchor', 'middle')
						.style('font-size', '0.7em')
						.style('fill', '#777')
						.text(function(d,i) { if (i === 0 || i === dataLegend.length-1) { return form(d); } });
				
				gL.exit().remove();


				// --- Show/hide --- //

				d3.select('#legend').transition().duration(500).style('opacity', config.rating ? 1 : 0);

			})(); // legendBuilder() namespace


			function translateG(x,y) { return 'translate(' + x + ', ' + y + ')'; }

			// === Init === //

			var svg = d3.select(this)
					.selectAll('svg')
					.data([dataNest]);

			var gEnter = svg
					.enter()
				.append('svg')
					.classed('svgMain', true)
				.append('g');

			d3.select('svg.svgMain')
					.attr('width', width + margin.left + margin.right)
					.attr('height', height + margin.top + margin.bottom) // Changing attributes of only the 'svg' element and not the 'g' element although the 'svg' element itself doesn't get added when the svg variable is being created. It seems the svg variable gets extended with the 'svg' element through gEnter, while gEnter identifies the 'g' element.
					.attr('viewBox', '0 0 ' + (width + margin.left + margin.right) + ' ' + (height + margin.top + margin.bottom))
					.attr('preserveAspectRatio', 'xMinYMax'); // svg with viewBox for responsiveness



			gEnter.append('g').attr('class', 'x axis');
			gEnter.append('g').attr('class', 'y axis');
			gEnter.append('g').attr('class', 'lollipops'); // Boxes for the 3 key element-groups. Will only be created the time the chart gets created the first time at enter().

			var g = d3.select('svg').select('g')
				.transition()
				.duration(1000)
					.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'); // Addressing the g-frame for the margins.

			
			// ===  Axes === //

			var n = dataNest.length;
			var dur = 1000; 	
			var formatValue = d3.format('.2s');

			axisX = d3.axisTop(scaleX)
					.tickFormat(function(d) { return formatValue(d).replace('M', ' mil').replace('G', ' bil'); })
					.tickSize(-height)
					.tickPadding(10);

			axisY = d3.axisLeft(scaleY).tickPadding(10);

			d3.select('.x.axis')
					.attr('transform', 'translate(0, 0)')
				.transition()
				.duration(dur)
					.call(axisX)
					.selectAll('g')
				.delay(function(d,i) { return i * 5; });


			d3.select('.y.axis')
				.transition()
				.duration(dur)
					.call(axisY)
					.selectAll('g')
				.delay(function(d,i) { return i * dur / n; }); 
				// the staggered axis delay pattern is: select the whole axis and transition/duration on it, 
				// then sub-select all g's (the individual ticks) and delay on it's data-indeces.


			d3.selectAll('g.x.axis > g.tick > text')
				.style('text-anchor', 'start');

			

			if (onlyYaxis) {

				d3.selectAll('.x.axis text').style('fill-opacity', 0);
				d3.selectAll('.x.axis line').style('stroke-opacity', 0);

			} else {

				var t = d3.transition().duration(1000);
				// var t2 = d3.transition().duration(0);

				d3.selectAll('.x.axis text').transition(t).style('fill-opacity', 1);
				d3.selectAll('.x.axis line').transition(t).style('stroke-opacity', 1);

			} // Axis specs for first plotpoint
				
		

			// ==== Chart === //


			// --- Lines --- //

			// join
			var lines = d3.select('g.lollipops')
					.selectAll('.lines')
					.data(dataNest, function(d) { return d[objY.value]; });

			// enter
			lines
					.enter()
				.append('line')
					.attr('class', 'lines')
					.attr('x1', scaleX(0))
					.attr('y1', function(d) { return scaleY(d[objY.value]); })
					.attr('x2', scaleX(0))
					.attr('y2', function(d) { return scaleY(d[objY.value]); })
					.style('stroke', function(d) { return rating ? scaleZCol(d[objZ.value]) : '#ccc'; })
				.transition()
				.duration(dur)
				.delay(function(d,i) { return i * dur /n; })
					.attr('x2', function(d) { return scaleX(d[objX.value]); });


				// update
				lines
					.transition()
					.duration(dur)
					.delay(function(d,i) { return i * dur / n; })
						.attr('y1', function(d) { return scaleY(d[objY.value]); })
						.attr('x2', function(d) { return scaleX(d[objX.value]); })
						.attr('y2', function(d) { return scaleY(d[objY.value]); })
						.style('stroke', function(d) { return rating ? scaleZCol(d[objZ.value]) : '#ccc'; })
						.style('opacity', 1);

				// exit
				lines
						.exit()
						.transition()
						.duration(dur)
							.style('opacity', 1e-6)
							.remove();


			
			// --- Circles --- //

			var radius = config.windowSizeFlag ? 2 : 5; // circle radius smaller for small screens

			// join
			var circles = d3.select('g.lollipops')
					.selectAll('.circles')
					.data(dataNest, function(d) { return d[objY.value]; });

			// enter
			circles
					.enter()
				.append('circle')
					.attr('class', 'circles')
					.attr('cx', scaleX(0))
					.attr('cy', function(d) { return scaleY(d[objY.value]); })
					.attr('r', 0)
					.style('fill', '#ccc')
				.transition()
				.duration(dur)
				.delay(function(d,i) { return i * dur / n; })
					.attr('r', function(d) { return rating ? scaleZ(d[objZ.value]) : radius; })
					.style('fill', function(d) { return rating ? scaleZCol(d[objZ.value]) : '#ccc'; });
			
			// update
			circles
				.transition()
				.duration(dur)
				.delay(function(d,i) { return i * dur / n; })
					.attr('cx', function(d) { return scaleX(d[objX.value]); })
					.attr('cy', function(d) { return scaleY(d[objY.value]); })
					.attr('r', function(d) { return rating ? scaleZ(d[objZ.value]) : radius; })
					.style('fill', function(d) { return rating ? scaleZCol(d[objZ.value]) : '#ccc'; })
					.style('opacity', 1);	

			// exit
			circles.exit()
				.transition()
				.duration(dur)
					.style('opacity', 1e-6)
					.remove();




			// === Specific plotpoint actions === //


			// --- Baseline circles --- //

			var baselineCircles = (function() {

				if (baseline && d3.select('.baseline').empty()) {

				d3.select('g.lollipops')
						.selectAll('circle.baseline')
						.data(dataNest.map(function(el) { return { 'yValues': el[objY.value],'xValues': el[config.compareTo] }; }))
						.enter()
					.append('circle')
						.classed('baseline', true)
						.attr('cy', function(d) { return scaleY(d.yValues); })
						.attr('cx', function(d) { return scaleX(d.xValues); })
						.attr('r', radius)
						.style('fill', '#4161F0')
						.style('opacity', 1e-6);

				} // enter baseline circles

				if (baseline  && !d3.select('.baseline').empty()) {

					d3.selectAll('circle.baseline')
						.transition()
						.duration(dur)
						.delay(function(d,i) { return i * dur / n; })
							.attr('cy', function(d) { return scaleY(d.yValues); })
							.style('opacity', 1);

				} // update baseline circles

				if (!baseline) {

					d3.selectAll('circle.baseline')
						.transition()
						.duration(dur)
						.delay(function(d,i) { return i * dur / n; })
							.style('opacity', 1e-6)
							.remove();

				} // exit baseline circles

			})(); // specificActions namespace



			// --- Highlight axis labels by genre --- //

			var genreHighlight = (function() {


				// --- Data prep for the genre highlight --- //

				var genres = _.uniq(data.map(function(d) { return d.genreMain; })); // unique list of genres
				var arrAxis = d3.select('.y.axis').selectAll('g > text').data(); // all films from axis

				// main function returning an object showing the film list per genre
				var genreArray = [];

				genres.forEach(function(el, i) { 

					var obj = {};
					obj.genre = el;
					obj.filmlist = _.intersection(arrAxis, genreMatch(el));

					genreArray.push(obj);

				}); // genre loop

				genreArray = _.sortBy(genreArray, function(el) { return el.genre; });

				// helper function extracting the film list per genre
				function genreMatch(genre) {

					var g = data
						.filter(function(el) { return el.genreMain === genre; })
						.map(function(elt) { return elt.movie; });

					return g;
				
				} // genreMatch()


				// --- Enter Udpdate for the buttons --- //

				// Data join
				var genreButtons = d3.select('#genreMenu').selectAll('.genres')
						.data(genreArray);

				// Enter buttons
				genreButtons.enter()
					.append('button')
						.classed('genres', true)
						.attr('id', function(d) { return d.genre; })
						.html(function(d) { return d.genre; });

				// Update buttons
				genreButtons.merge(genreButtons).style('color', function(d) { return d.filmlist.length > 0 ? '#D9D9CE' : '#777'; });


				// --- Listener and handler --- //

				genreButtons.on('mouseover', function(d) {

					// find the intersection between the array of axis labels and the array of genre films
					var arrAxis = d3.select('.y.axis').selectAll('g > text').data();
					var intersection = _.intersection(arrAxis, d.filmlist);
					
					intersection.forEach(function(el) {

						var axisLabel = getAxisLabel(el);
						axisLabel.style('fill', '#E33F96').transition().duration(2000).style('fill', '#D9D9CE');

					}); // color the axis labels

			 	}); // listener / handler

			})(); // genreDetection namespace


			// --- Tooltip --- //

			var tooltip = (function	() {

				d3.selectAll('.circles').on('mouseover', function(d) {

					var formatValue = d3.format('.2s');
					function format(num) { return '$ ' + formatValue(num).replace('M', ' mil').replace('G', ' bil'); }

					var html = 						
					  '<div id="ttWrap">' +
					    '<div id="pic">' +
					      '<img src="images/films/' + d.image + '" alt="Avatar">' +
					    '</div>' +
					    '<div id="text">' +
								'<h1 class="tooltipText">' + d.movie + '</h1>' +
								'<p class="tooltipText break">Realeased: ' + d.release_date.getFullYear() + '</p>' +
								'<p class="tooltipText">Rank in category: ' + d.rank + ' in ' + d.categoryNice + '</p>' +
								'<p class="tooltipText break">Production budget: ' + format(d.production_budget) + '</p>' +
								'<p class="tooltipText">US revenue: ' + format(d.domestic_gross) + '</p>' +
								'<p class="tooltipText">Worldwide revenue: ' + format(d.worldwide_gross) + '</p>' +
								'<p class="tooltipText break">IMDb rating: ' + d.rating_imdb + ' of 10</p>' +
								'<p class="tooltipText">Rotten Tomatoes: ' + d.rating_rt + ' of 10</p>' +
							'</div>' +
					  '</div>';

					d3.select('.tooltip')
							.html(html)
							.style('top', (d3.event.pageY + 5) + 'px')
							.style('left', (d3.event.pageX + 5) + 'px')
						.transition()
							.style('opacity', 0.9);
					
				}); // mouseover

				d3.selectAll('.circles').on('mousemove', function(d) {

					d3.select('.tooltip')
						.style('top', (d3.event.pageY + 5) + 'px')
						.style('left', (d3.event.pageX + 5) + 'px');

				}); // mousemove

				d3.selectAll('.circles').on('mouseout', function(d) {

					d3.select('.tooltip')
						.style('top', '-100px')
						.style('left', '0px')
						.transition()
							.style('opacity', 0);

				}); // mouseout


			})(); // tooltip namespace


		}); // selection.each(data, i)

	} // my(selection)


	my.key = function(_) {
		if(!arguments.length) return key;
		key = String(_);
		return my;
	};

	my.keyValue = function(_) {
		if(!arguments.length) return keyValue;
		keyValue = String(_);
		return my;
	};

	my.varX = function(_) {
		if(!arguments.length) return varX;
		varX = _;
		return my;
	};

	my.varY = function(_) {
		if(!arguments.length) return varY;
		varY = _;
		return my;
	};

	my.varZ = function(_) {
		if(!arguments.length) return varZ;
		varZ = _;
		return my;
	};

	my.extentX = function(_) {
		if(!arguments.length) return extentX;
		extentX = _;
		return my;
	};

	my.extentY = function(_) {
		if(!arguments.length) return extentY;
		extentY = _;
		return my;
	};

	my.extentZ = function(_) {
		if(!arguments.length) return extentZ;
		extentZ = _;
		return my;
	};

	my.sortBy = function(_) {
		if(!arguments.length) return sortBy;
		sortBy = _;
		return my;
	};

	my.margin = function(_) {
		if(!arguments.length) return margin;
		margin = _;
		return my;
	};

	my.width = function(_) {
		if(!arguments.length) return width;
		width = _;
		return my;
	};

	my.height = function(_) {
		if(!arguments.length) return height;
		height = _;
		return my;
	};

	my.onlyYaxis = function(_) {
		if(!arguments.length) return onlyYaxis;
		onlyYaxis = _;
		return my;
	};

	my.baseline = function(_) {
		if(!arguments.length) return baseline;
		baseline = _;
		return my;
	};

	my.rating = function(_) {
		if(!arguments.length) return rating;
		rating = _;
		return my;
	};

return my;

} // chart()






// === Format data === //

function type(d) {
	d.rank = parseFloat(d.rank);
	d.start_value = parseFloat(d.start_value);
	d.production_budget = parseFloat(d.production_budget);
	d.domestic_gross = parseFloat(d.domestic_gross);
	d.worldwide_gross = parseFloat(d.worldwide_gross);
	d.rating_imdb = parseFloat(d.rating_imdb);
	d.rating_rt = parseFloat(d.rating_rt);
	d.approx_income = parseFloat(d.approx_income);
	d.approx_expense = parseFloat(d.approx_expense);
	d.profit = parseFloat(d.profit);
	d.release_date = new Date(Date.parse(d.release_date));
	d.genres = d.genres.split(",");
	return d;
}




// === TODO === //

// about the data: inflation adjusted, hard to estimate in parts domestic gross === US


// http://inflationdata.com/articles/2013/05/16/highest-grossing-movies-adjusted-for-inflation/
//  
// NOte that the figures are NOT inflation adjusted. An inflation adjusted list would bring about a 
// rather different view of for exampe Birth of a Nation. 
// Also Highest worldwide gross earner wouldn't be Avatar, but Snow White and the Seven Dwarfs (yay). 
// Gone with  wind and Bambi would've pushed passed Avatar. So there...

// Where is Blair Witch Project?
