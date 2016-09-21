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


// Continue in Debugger. The problem lies with repeatingly clicking on worldwide_gross. 
// Process: value: worldwide_gross >> sort by worldwide_gross >> value: worldwide_gross. Sorts it by production_budget the second time !

// === Globals === //

var globals = (function() {

	// plotpoint object used to trigger stages of narrative 
	window.plotpoint = {};
	plotpoint.dataSequence = ['start_value', 'production_budget', 'domestic_gross', 'worldwide_gross'];
	plotpoint.ratingsIMDB = false;
	plotpoint.ratingsRT = false;
	plotpoint.rating = ['rating_imdb', 'rating_rt'];
	plotpoint.keyValue = 'biggest_budgets';

	// hashtables for lookups
	window.hashSort = {};
	hashSort.production_budget = 'Production Budget';
	hashSort.domestic_gross = 'Domestic Gross';
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

d3.csv("data/movies0.csv", type, function(data){

	
	// --- Initial state --- //

	data = _.sortBy(data, function(el) { return el.production_budget; }); // Sort before feeding into any function. Otherwise the data won't be sorted descendingly but ascendingly

	plotpoint.step = 0;
	handler.plotpoint.initial(data);
	

	// --- Click listener --- //

	d3.select('button#start_value').on('mousedown', function() { handler.pressed(this); handler.plotpoint.start_value(data); });

	d3.select('button#production_budget').on('mousedown', function() { handler.pressed(this); handler.plotpoint.production_budget(data); });

	d3.select('button#domestic_gross').on('mousedown', function() { handler.pressed(this); handler.plotpoint.domestic_gross(data); });

	d3.select('button#worldwide_gross').on('mousedown', function() { handler.pressed(this); handler.plotpoint.worldwide_gross(data); });


	d3.selectAll('button.rating').on('mousedown', function() { 

		handler.pressed(this);
		handler.ratings(this, data); 

	});
	
	d3.selectAll('li.sortItems').on('mousedown', function() { 
	
		handler.pressed(this);
		handler.sort.one(this, data); 
	
	}); // sort listener and handler

	d3.selectAll('li.keyValueItems').on('mousedown', function() {

		handler.pressed(this);
		handler.sort.two(this, data); 

	}); // category = keyValue listener and handler




	// --- Scroll listener --- //

	$('#explanations').on('itemfocus', function(event, item) {
	
		log('item index', item.index);

		if (item.data.action === "") return;

		var action = isNaN(item.data.action) ? item.data.action.split(',').map(Number) : [item.data.action]; // convert single number or number of strings to array

		action.forEach(function(el) { storyLookup[el](data); });

		// --- scroll stop if we feel inclined that way - feels a little wrong --- //
		// d3.select('body').classed('stop-scrolling', true);
		// setTimeout(function() { d3.select('body').classed('stop-scrolling', false); }, 1000);

	}); // when item (= element with class .story) gets into focus

}); // d3.csv() 


// === Select builder === //

var selectBuilder = (function() {
	
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

})();


// === Click handler === //


var handler = (function() {

	var my = {};

	my.plotpoint = {};
	my.ratings;
	my.sort = {};
	my.highlight;

	my.pressed = function(that) {

		if ($(that).hasClass('selectItems')) {
			$('button.rating').removeClass('pressed');			
		} // if Top 20 or Sort by is chosen

		if ($(that).hasClass('value')) {
			$('button').removeClass('pressed');			
			$(that).addClass('pressed');
		} // if the value is changed

		if ($(that).hasClass('rating')) {
			$('button.rating').removeClass('pressed');			
			$(that).addClass('pressed');
		} // if the rating is changed

	} // button handler

	my.plotpoint.initial = function(data) {

		plotpoint.ratingsIMDB = false;
		plotpoint.ratingsRT = false;
		plotpoint.step = 0;

		var newChart = chart()
				.key('category')
				.keyValue(plotpoint.keyValue)
				.margin({ top: 50, right: 20, bottom: 70, left: window.innerWidth/2 })
				.varsX(['start_value', 'production_budget', 'domestic_gross', 'worldwide_gross'])
				.varsY(['movie'])
				.varsZ(['rating_imdb', 'rating_rt'])
				.onlyYaxis(true);

		d3.select('div#container')
				.datum(data)
				.call(newChart);

	} // no axes

	my.plotpoint.start_value = function(data) {

		plotpoint.ratingsIMDB = false;
		plotpoint.ratingsRT = false;
		plotpoint.step = 0;

		var newChart = chart()
				.key('category')
				.keyValue(plotpoint.keyValue)
				.varsX(['start_value', 'production_budget', 'domestic_gross', 'worldwide_gross'])
				.varsY(['movie'])
				.varsZ(['rating_imdb', 'rating_rt']);

		d3.select('div#container')
				.datum(data)
				.call(newChart);

	} // films

	my.plotpoint.production_budget = function(data) {

		plotpoint.ratingsIMDB = false;
		plotpoint.ratingsRT = false;
		plotpoint.step = 1;

		var newChart = chart()
				.key('category')
				.keyValue(plotpoint.keyValue)
				.varsX(['production_budget', 'domestic_gross', 'worldwide_gross', 'start_value'])
				.varsY(['movie'])
				.varsZ(['rating_imdb', 'rating_rt']);

		d3.select('div#container')
				.datum(data)
				.call(newChart);

	} // production budget

	my.plotpoint.domestic_gross = function(data) {

		plotpoint.ratingsIMDB = false;
		plotpoint.ratingsRT = false;
		plotpoint.step = 2;

		var newChart = chart()
				.key('category')
				.keyValue(plotpoint.keyValue)
				.varsX(['domestic_gross', 'production_budget', 'worldwide_gross', 'start_value'])
				.varsY(['movie'])
				.varsZ(['rating_imdb', 'rating_rt']);

		d3.select('div#container')
				.datum(data)
				.call(newChart);

	} // domestic gross

	my.plotpoint.worldwide_gross = function(data) {


		plotpoint.ratingsIMDB = false;
		plotpoint.ratingsRT = false;
		plotpoint.step = 3;

		var newChart = chart()
				.key('category')
				.keyValue(plotpoint.keyValue)
				.varsX(['worldwide_gross', 'domestic_gross', 'production_budget', 'start_value'])
				.varsY(['movie'])
				.varsZ(['rating_imdb', 'rating_rt']);

		d3.select('div#container')
				.datum(data)
				.call(newChart);

	} // worldwirde gross

	my.ratings = function(that, data, value) {

		// set the rating to choose
		var value = arguments.length === 2 ? String(that.id) : value;
		var valueArray = [];

		// set an array of the rating-names in the right order to pass to chart-factory 
		// (which needs all names to calc the extent and the first name to be the one used)
		if (value === 'rating_imdb') {
			plotpoint.ratingsIMDB = true;
			plotpoint.ratingsRT = false;

			valueArray = plotpoint.rating.slice();
			valueArray = _.pull(valueArray, value);
			valueArray.unshift(value); 
		} 

		if (value === 'rating_rt') {
			plotpoint.ratingsIMDB = false;
			plotpoint.ratingsRT = true;				

			valueArray = plotpoint.rating.slice();
			valueArray = _.pull(valueArray, value);
			valueArray.unshift(value);
		}

		// get the current chart state
		var currentXvar = plotpoint.dataSequence[plotpoint.step];

		// This builds a list of x variables so that the current x variable is at array pos 1.
		// This way we can build a new chart with inflated circles at the same x position as the previous chart.
		var varsX = plotpoint.dataSequence.slice(); // Array.slice() with no args clones an array
		_.pull(varsX, currentXvar); // remove the current x variable item from the array 
		varsX.unshift(currentXvar); // re-introduce the current x variable item at the beginning of the array
		
		// build the chart
		var newChart = chart()
				.key('category')
				.keyValue(plotpoint.keyValue)
				.varsX(varsX)
				.varsY(['movie'])
				.varsZ(valueArray);

		d3.select('div#container')
				.datum(data)
				.call(newChart);

	} // set new rating

	my.sort.one = function(that, data, value) {

		var v = arguments.length === 2 ? String(that.id) : value; // check for manual or programmatic input

		d3.select('nav#sort p').html(hashSort[v]); // set the value if programmatic

		var	p = plotpoint.dataSequence[plotpoint.step]; // get identifier name to sort by
		log('v', v);
		log('p', p);
		
		data = _.sortBy(data, function(el) { return el[v]; }); // Sort before feeding into any function. Otherwise the data won't be sorted descendingly but ascendingly
		
		my.plotpoint[p](data);

	} // set new sort

	my.sort.two = function(that, data, value) {

		var v = arguments.length === 2 ? String(that.id) : value; // check for manual or programmatic input

		d3.select('nav#keyValue p').html(hashKeyValue[v]); // set the value if programmatic

		plotpoint.keyValue = v;
		plotpoint.step = 0;

		my.plotpoint.start_value(data);

	} // set new category

	return my;

})();


// === Reusable Chart builder === //

function chart() {

	var key = undefined;
	var keyValue = undefined;

	var varsX = undefined;
	var varsY = undefined;
	var varsZ = undefined;

	var margin = { top: 50, right: (window.innerWidth*0.25) , bottom: 50, left: (window.innerWidth*0.25) };
	var width = (window.innerWidth) - margin.left - margin.right;
	var height = (window.innerHeight/2) - margin.top - margin.bottom;

	var onlyYaxis = false;


	function my(selection) {


		selection.each(function(data, i) {


			// === Dataprep === //

			var dataNest = d3.nest()
					.key(function(d) { return d[key]; })
					.entries(data)
					.filter(function(el) { return el.key === keyValue; })
					.map(function(el) { return el.values; });
			
			dataNest = dataNest[0];
			

			// ===  Measure === //

			var objX = measureVars(varsX);
			var objY = measureVars(varsY);
			var objZ = measureVars(varsZ);

			// log('objX',objX);
			// log('objY',objY);
			// log('objZ',objZ);

			function measureVars(vars) {

				// log(dataNest);
				// log(vars);

				// error handling
				try {
					if(vars.constructor !== Array) throw 'Pls input an array of variable(s) in the chart composition'; 
				} 
				catch(err) {
					console.error(err);
				}

				// extract the variable names
				var varsStr = [];
				vars.map(function(el) { varsStr.push(String(el)); }); 

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
				varsObject.values = varsStr[0]; 

				return varsObject;

			};

			log('dataNest',dataNest);
			log('mapped dN by movies',dataNest.map(function(el) { return el[objY.values] }));

			// ===  Scales === //

			scaleX = d3.scaleLinear().domain([0, objX.extent[1]]).range([0, width]);

			scaleY = d3.scalePoint().domain(dataNest.map(function(el) { return el[objY.values]; })).range([height, 0]).padding(1);

			scaleZ = d3.scaleSqrt().domain([objZ.extent[0], objZ.extent[1]]).range([3, 20]);
			
			// scaleZCol = d3.scaleSequential(d3.interpolateOrRd).domain(objZ.extent);
			scaleZCol = d3.scaleSequential(d3.interpolatePuRd).domain(objZ.extent);

			// scaleZ = d3.scaleSqrt().domain([0, 10]).range([3, 20]);

			// scaleZCol = d3.scaleLinear().domain([0, 10]).range(['#ccc', 'red']);


			// === Init === //

			var svg = d3.select(this)
					.selectAll('svg')
					.data([dataNest]);

			var gEnter = svg
					.enter()
				.append('svg')
				.append('g');

			d3.select('svg')
					.attr('width', width + margin.left + margin.right)
					.attr('height', height + margin.top + margin.bottom) // Changing attributes of only the 'svg' element and not the 'g' element although the 'svg' element itself doesn't get added when the svg variable is being created. It seems the svg variable gets extended with the 'svg' element through gEnter, while gEnter identifies the 'g' element.
					.attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
					.attr("preserveAspectRatio", "xMinYMax"); // svg with viewBox for responsiveness


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
					.tickFormat(function(d) { return formatValue(d).replace('M', ' mil').replace('G', ' tril'); })
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

				var t = d3.transition().duration(1000);

				d3.selectAll('.x.axis text').transition(t).style('fill-opacity', 0);
				d3.selectAll('.x.axis line').transition(t).style('stroke-opacity', 0);

			} else {

				d3.selectAll('.x.axis text').transition(t).style('fill-opacity', 1);
				d3.selectAll('.x.axis line').transition(t).style('stroke-opacity', 1);

			} // Axis specs for first plotpoint
				
		
			// ==== Chart === //


			// --- Lines --- //

			// join
			var lines = d3.select('g.lollipops')
					.selectAll('.lines')
					.data(dataNest, function(d) { return d[objY.values]; });

			// enter
			lines
					.enter()
				.append('line')
					.attr('class', 'lines')
					.attr('x1', scaleX(0))
					.attr('y1', function(d) { return scaleY(d[objY.values]); })
					.attr('x2', scaleX(0))
					.attr('y2', function(d) { return scaleY(d[objY.values]); })
					.style('stroke', '#ccc')
				.transition()
				.duration(dur)
				.delay(function(d,i) { return i * dur /n; })
					.attr('x2', function(d) { return scaleX(d[objX.values]); });


				// update
				lines
					.transition()
					.duration(dur)
					.delay(function(d,i) { return i * dur / n; })
						.attr('y1', function(d) { return scaleY(d[objY.values]); })
						.attr('x2', function(d) { return scaleX(d[objX.values]); })
						.attr('y2', function(d) { return scaleY(d[objY.values]); })
						.style('stroke','#ccc');

				lines
						.exit()
						.transition()
						.duration(dur)
							.style('opacity', 1e-6)
							.remove();


			
			// --- Circles --- //

			// join
			var circles = d3.select('g.lollipops')
					.selectAll('.circles')
					.data(dataNest, function(d) { return d[objY.values]; });

			// enter
			circles
					.enter()
				.append('circle')
					.attr('class', 'circles')
					.attr('cx', scaleX(0))
					.attr('cy', function(d) { return scaleY(d[objY.values]); })
					.attr('r', 0)
					.style('fill', '#ccc')
				.transition()
				.duration(dur)
				.delay(function(d,i) { return i * dur / n; })
					.attr('r', 5)
					.style('fill', '#ccc');
			
			// update
			circles
				.transition()
				.duration(dur)
				.delay(function(d,i) { return i * dur / n; })
					.attr('cx', function(d) { return scaleX(d[objX.values]); })
					.attr('cy', function(d) { return scaleY(d[objY.values]); })
					.attr('r', 5)
					.style('fill', '#ccc');

			// exit
			circles.exit()
				.transition()
				.duration(dur)
					.style('opacity', 1e-6)
					.remove();

			

			// === Specific plotpoint actions === //

			var specificActions = (function() {

				if (plotpoint.step === 2 && d3.select('.baseline').empty()) {

				d3.select('g.lollipops')
						.selectAll('circle.baseline')
						.data(dataNest.map(function(el) { return { 'yValues': el[objY.values],'xValues': el[plotpoint.dataSequence[1]] }}))
						.enter()
					.append('circle')
						.classed('baseline', true)
						.attr('cy', function(d) { return scaleY(d.yValues); })
						.attr('cx', function(d) { return scaleX(d.xValues); })
						.attr('r', 5)
						.style('fill', '#4161F0')
						.style('opacity', 1e-6);

				}

				if (plotpoint.step === 1 || plotpoint.step === 0) {

					d3.selectAll('circle.baseline')
						.transition()
						.duration(dur)
						.delay(function(d,i) { return i * dur / n; })
							.style('opacity', 1e-6)
							.remove();

				}

				if (plotpoint.step !== 1 && plotpoint.step !== 0) {

					d3.selectAll('circle.baseline')
						.transition()
						.duration(dur)
						.delay(function(d,i) { return i * dur / n; })
							.attr('cy', function(d) { return scaleY(d.yValues); })
							.style('opacity', 1);

				}

				if (plotpoint.ratingsIMDB) {

					circles
						.transition()
						.duration(dur)
							.attr('r', function(d) { return scaleZ(d[objZ.values]); })
							.style('fill', function(d) { return scaleZCol(d[objZ.values]); });

					lines
						.transition()
						.duration(dur)
							.style('stroke', function(d) { return scaleZCol(d[objZ.values]); });

				}

				if (plotpoint.ratingsRT) {

					circles
						.transition()
						.duration(dur)
							.attr('r', function(d) { return scaleZ(d[objZ.values]); })
							.style('fill', function(d) { return scaleZCol(d[objZ.values]); });

					lines
						.transition()
						.duration(dur)
							.style('stroke', function(d) { return scaleZCol(d[objZ.values]); });


				}

			})(); // specificActions namespace


			var tooltip = (function	() {

				d3.selectAll('.circles').on('mouseover', function(d) {

					var formatValue = d3.format('.2s');
					function format(num) { return '$ ' + formatValue(num).replace('M', ' mil').replace('G', ' tril')}

					var html = 
						'<h1 class="tooltipText">' + d.movie + '</h1>\
						<p class="tooltipText">Realeased: ' + d.release_date.getFullYear() + '</p>\
						<p class="tooltipText">Rank in category: ' + d.rank + ' in ' + d.categoryNice + '</p>\
						<p class="tooltipText">Production budget: ' + format(d.production_budget) + '</p>\
						<p class="tooltipText">Domestic revenue: ' + format(d.domestic_gross) + '</p>\
						<p class="tooltipText">Worldwide revenue: ' + format(d.worldwide_gross) + '</p>';

					d3.select('.tooltip')
							.html(html)
							.style('top', (d3.event.pageY + 5) + 'px')
							.style('left', (d3.event.pageX + 5) + 'px')
						.transition()
							.style('opacity', 0.8);
					
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
	}

	my.keyValue = function(_) {
		if(!arguments.length) return keyValue;
		keyValue = String(_);
		return my;
	}

	my.varsX = function(_) {
		if(!arguments.length) return varsX;
		varsX = _;
		return my;
	}

	my.varsY = function(_) {
		if(!arguments.length) return varsY;
		varsY = _;
		return my;
	}

	my.varsZ = function(_) {
		if(!arguments.length) return varsZ;
		varsZ = _;
		return my;
	}

	my.margin = function(_) {
		if(!arguments.length) return margin;
		margin = _;
		return my;
	}

	my.width = function(_) {
		if(!arguments.length) return width;
		width = _;
		return my;
	}

	my.height = function(_) {
		if(!arguments.length) return height;
		height = _;
		return my;
	}

	my.onlyYaxis = function(_) {
		if(!arguments.length) return onlyYaxis;
		onlyYaxis = _;
		return my;
	}

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
	return d;
}


