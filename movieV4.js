var log = console.log.bind(console);
var dir = console.dir.bind(console);



// === Globals === //

// plotpoint object used to trigger stages of narrative 
var plotpoint = {};
plotpoint.dataSequence = ['production_budget', 'domestic_gross', 'worldwide_gross'];
plotpoint.ratingsIMDB = false;
plotpoint.ratingsRT = false;

// Data for select dropdown
var varsSelect = [
	{'var': 'production_budget', 'name': 'Production Budget'},
	{'var': 'domestic_gross', 'name': 'Domestic Gross'},
	{'var': 'worldwide_gross', 'name': 'Worldwide Gross'},
	{'var': 'rating_imdb', 'name': 'Rating IMDb (1-10)'},
	{'var': 'rating_rt', 'name': 'Rating Rotten Tomatoes (1-10)'}
];


// === Load data === //

var data = d3.csv("data/movies0.csv", type, function(data){

	
	// === Initial state === //

	data = _.sortBy(data, function(el) { return el.production_budget; }); // Sort before feeding into any function. Otherwise the data won't be sorted descendingly but ascendingly

	plotpoint.step = 0;
	handler.plotpoint.one(data);
	

	// === Click listener === //

	d3.select('button#one').on('mousedown', function() { handler.plotpoint.one(data); });

	d3.select('button#two').on('mousedown', function() { handler.plotpoint.two(data); });

	d3.select('button#three').on('mousedown', function() { handler.plotpoint.three(data); });

	d3.select('button#imdb').on('mousedown', function() { handler.ratings.one(data); });

	d3.select('button#rt').on('mousedown', function() { handler.ratings.two(data); });

	d3.select('select').on('change', function() {

		var l = String(this.value);
		var arraySelect = ['one', 'two', 'three'],
				p = arraySelect[plotpoint.step];
		data = _.sortBy(data, function(el) { return el[l]; }); // Sort before feeding into any function. Otherwise the data won't be sorted descendingly but ascendingly
		
		handler.plotpoint[p](data);

	}); // select listener and handler

}); // d3.csv() 



// === Select builder === //

var selectBuilder = (function() {
	
	d3.select('select').selectAll('option')
			.data(varsSelect)
			.enter()
		.append('option')
			.attr('value', function(d) { return d.var; })
			.html(function(d) { return d.name; });

})();


// === Click handler === //

var handler = (function() {

	var my = {};

	my.plotpoint = {};
	my.ratings = {};

	my.plotpoint.one = function(data) {

		plotpoint.ratingsIMDB = false;
		plotpoint.ratingsRT = false;
		plotpoint.step = 0;

		var newChart = chart()
				.key('category')
				.keyValue('Biggest budgets')
				.varsX(['production_budget', 'domestic_gross', 'worldwide_gross'])
				.varsY(['movie'])
				.varsZ(['rating_imdb', 'rating_rt']);

		d3.select('div.container')
				.datum(data)
				.call(newChart);

	}

	my.plotpoint.two = function(data) {

		plotpoint.ratingsIMDB = false;
		plotpoint.ratingsRT = false;
		plotpoint.step = 1;

		var newChart = chart()
				.key('category')
				.keyValue('Biggest budgets')
				.varsX(['domestic_gross', 'production_budget', 'worldwide_gross'])
				.varsY(['movie'])
				.varsZ(['rating_imdb', 'rating_rt']);

		d3.select('div.container')
				.datum(data)
				.call(newChart);

	}

	my.plotpoint.three = function(data) {


		plotpoint.ratingsIMDB = false;
		plotpoint.ratingsRT = false;
		plotpoint.step = 2;

		var newChart = chart()
				.key('category')
				.keyValue('Biggest budgets')
				.varsX(['worldwide_gross', 'domestic_gross', 'production_budget'])
				.varsY(['movie'])
				.varsZ(['rating_imdb', 'rating_rt']);

		d3.select('div.container')
				.datum(data)
				.call(newChart);
		
	}

	my.ratings.one = function(data) {

			plotpoint.ratingsIMDB = true;
			plotpoint.ratingsRT = false;

			var newChart = chart()
					.key('category')
					.keyValue('Biggest budgets')
					.varsX(['production_budget', 'domestic_gross', 'worldwide_gross'])
					.varsY(['movie'])
					.varsZ(['rating_imdb', 'rating_rt']);

			d3.select('div.container')
					.datum(data)
					.call(newChart);

	}

	my.ratings.two = function(data) {

			plotpoint.ratingsIMDB = false;
			plotpoint.ratingsRT = true;

			var newChart = chart()
					.key('category')
					.keyValue('Biggest budgets')
					.varsX(['production_budget', 'domestic_gross', 'worldwide_gross'])
					.varsY(['movie'])
					.varsZ(['rating_rt', 'rating_imdb']);

			d3.select('div.container')
					.datum(data)
					.call(newChart);
					
	}

	return my;

})();



// === Reusable Chart builder === //


function chart() {

	var key = undefined;
	var keyValue = undefined;

	var varsX = undefined;
	var varsY = undefined;
	var varsZ = undefined;

	var margin = { top: 50, right: 20, bottom: 70, left: 300 };
	var width = 1000 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;


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

			// Sort descending
			// dataNest = _.sortBy(dataNest, function(el) { return el[objX.values]; });
			

			// log('objX',objX);
			// log('objY',objY);
			// log('objZ',objZ);

			function measureVars(vars) {

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


			// ===  Scales === //

			scaleX = d3.scaleLinear().domain([0, objX.extent[1]]).range([0, width]);

			scaleY = d3.scalePoint().domain(dataNest.map(function(el) { return el[objY.values]; })).range([height, 0]).padding(1);

			scaleZ = d3.scaleSqrt().domain([objZ.extent[0], objZ.extent[1]]).range([3, 20]);

			scaleZCol = d3.scaleLinear().domain([objZ.extent[0], objZ.extent[1]]).range(['#ccc', 'red']);


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
					.attr('height', height + margin.top + margin.bottom); // Changing attributes of only the 'svg' element and not the 'g' element although the 'svg' element itself doesn't get added when the svg variable is being created. It seems the svg variable gets extended with the 'svg' element through gEnter, while gEnter identifies the 'g' element.

			gEnter.append('g').attr('class', 'x axis');
			gEnter.append('g').attr('class', 'y axis');
			gEnter.append('g').attr('class', 'lollipops'); // Boxes for the 3 key element-groups. Will only be created the time the chart gets created the first time at enter().



			var g = d3.select('svg').select('g')
					.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'); // Addressing the g-frame for the margins.


			
			// ===  Axes === //

			var n = dataNest.length;
			var dur = 1000; 	
			var formatValue = d3.format('.2s');

			axisX = d3.axisBottom(scaleX)
					.tickFormat(function(d) { return formatValue(d).replace('M', ' mil').replace('G', ' tril'); })
					.tickSize(-height);

			axisY = d3.axisLeft(scaleY);

			d3.select('.x.axis')
				.attr('transform', 'translate(0,' + height + ')')
				.call(axisX);

			d3.select('.y.axis')
				.transition()
				.duration(dur)
					.call(axisY)
					.selectAll('g')
				.delay(function(d,i) { return i * dur / n; }); 
				// the staggered axis delay pattern is: select the whole axis and transition/duration on it, 
				// then sub-select all g's (the individual ticks) and delay on it's data-indeces.

			d3.selectAll('g.x.axis > g.tick > text')
				.style('text-anchor', 'end')
				.attr('transform', 'rotate(-40)');

		
			// ==== Chart === //

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
					// .attr('cx', function(d) { return scaleX(d[objX.values]); })
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

			if (plotpoint.step === 1 && d3.select('.baseline').empty()) {

			var lollipops = d3.select('g.lollipops')
					.selectAll('circle.baseline')
					.data(dataNest.map(function(el) { return { 'yValues': el[objY.values],'xValues': el[plotpoint.dataSequence[0]] }}))
					.enter()
				.append('circle')
					.classed('baseline', true)
					.attr('cy', function(d) { return scaleY(d.yValues); })
					.attr('cx', function(d) { return scaleX(d.xValues); })
					.attr('r', 5)
					.style('fill', 'steelblue')
					.style('opacity', 1e-6);

			}

			if (plotpoint.step === 0) {

				d3.selectAll('circle.baseline')
					.transition()
					.duration(dur*3)
					.delay(function(d,i) { return i * dur / n; })
						.style('opacity', 1e-6)
						.remove()

			}

			if (plotpoint.step !== 0) {

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

			}

			if (plotpoint.ratingsRT) {

				circles
					.transition()
					.duration(dur)
						.attr('r', function(d) { return scaleZ(d[objZ.values]); })
						.style('fill', function(d) { return scaleZCol(d[objZ.values]); });


			}


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


return my;

} // chart()



// === Format data === //

function type(d) {
	d.rank = parseFloat(d.rank);
	d.production_budget = parseFloat(d.production_budget.replace(/,/g, ''));
	d.domestic_gross = parseFloat(d.domestic_gross.replace(/,/g, ''));
	d.worldwide_gross = parseFloat(d.worldwide_gross.replace(/,/g, ''));
	d.rating_imdb = parseFloat(d.rating_imdb.replace(/,/g, ''));
	d.rating_rt = parseFloat(d.rating_rt.replace(/,/g, ''));
	d.approx_income = parseFloat(d.approx_income.replace(/,/g, ''));
	d.approx_expense = parseFloat(d.approx_expense.replace(/,/g, ''));
	d.profit = parseFloat(d.profit.replace(/,/g, ''));
	d.release_date = new Date(Date.parse(d.release_date));
	return d;
}
