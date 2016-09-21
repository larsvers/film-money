
d3.json('data/story.json', function(error, storyData) {
	if (error) console.log(error);
	
	// === Set up HTML architecture === //

	var dataIntro = storyData.story.introduction;
	var dataMain = storyData.story.main;

	// --- set up introduction div --- //

	var introElement = d3.select('#intro').selectAll('div.story.intro')
			.data(dataIntro)
			.enter()
		.append('div')
			.classed('story', true)
			.classed('intro', true)

	introElement.append('h1').html(function(d) { return d.headlineText; });
	introElement.append('h2').html(function(d) { return d.sublineText; });
	introElement.append('p').html(function(d) { return d.text; });


	// --- set up main text p's --- //
	
	d3.select('#explanations').selectAll('p.story.main')
			.data(dataMain)
			.enter()
		.append(function(d) { return d.headline ? document.createElement('h1') : document.createElement('p'); })
			.classed('story', true)
			.classed('main', true)
			.attr('data-action', function(d) { return d.action; }) // add data to markup which we use later in events to trigger actions
			.html(function(d) { return d.text; });


	// set up #main top position dynamically
	// so in order for the #main div with all the text to appear flush under the #graph div I need to dynamically calculate the top position of #main as the bottom position of #graph (which is top of #graph + height as I can't get bottom)
	// we could say: why? could you not just have #main in the document flow and it would just come after #graph? And yes you would. But as soon as #intro is out of sight, #graph will get a position: fixed and will be taken out of the document flow, which will move any non-absolute div straight to the top pf the page
	// so the way we do it we make sure that #main is absolute positioned in order to maintain position even if the above div is taken out of the doc flow.
	var mainTop = $('#graph').position().top + $('#graph').height(); 	
	d3.select('div#main').style('top', mainTop + 'px');


	// === Initiate scroll-story === //

	$('#intro').scrollStory({

		triggerOffset: 0

	}); // intro scroll detection

	$('#explanations').scrollStory({

		triggerOffset: window.innerHeight *.9

	}); // plotpoint scroll detection



	// === Set up scroll listener === //

	$('#intro').on('itemblur', function(event, item) {

		d3.select('#intro').style('display', 'none');
		d3.select('#graph').style('position', 'fixed');

	}).on('itemfocus', function(event, item) {

		d3.select('#intro').style('display', 'flex');
		d3.select('#graph').style('position', 'inherit');

	});



});





