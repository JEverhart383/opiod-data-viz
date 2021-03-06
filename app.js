	var width = 960, 
		height = 600; 

		var projection = d3.geoAlbersUsa(); 
		var path = d3.geoPath(); 
		var json, 
		currentYear = '2015', 
		currentFilter = 'totalDeaths'; 
		currentColorFilter = 'linearScale'
		var svg = d3.select('#map-area').append('svg')
			.attr('width', width)
			.attr('height', height); 
		
		var yearInput = document.querySelector('#yearInput'), 	
		selectedYear = document.querySelector('#selectedYear'); 
		
		selectedYear.innerText = yearInput.value; 
		
		yearInput.addEventListener('change', function(){
			currentYear = this.value; 
			selectedYear.innerText = this.value; 
			drawMap(json, this.value, currentFilter, currentColorFilter ); 
		})

		var initalFilterValue = d3.select('input.statsFilter:checked').node().value , 
		filterValue; 

		var initalColorFilterValue = d3.select('input.colorFilter:checked').node().value , 
		colorFilterValue; 



		var radioInputs = d3.selectAll('input.statsFilter'); 
		radioInputs.on('change', function(){
			currentFilter = this.value; 
			drawMap(json, currentYear, this.value, currentColorFilter )
		})

		var colorFilterInputs = d3.selectAll('input.colorFilter'); 
		colorFilterInputs.on('change', function(){
			currentColorFilter = this.value; 
			drawMap(json, currentYear, this.value, this.value )
		})


		function drawMap(data, year, filterCriteria, colorFilterCriteria){
			d3.selectAll('path').remove(); 
			//hoist this to the global scope
			var states = data.objects.states.geometries; 

			switch(colorFilterCriteria){
				case 'quantileScale':
					var colorScaleMethod = function(){
						return d3.scaleQuantile(); 
					}
						break;
				case 'logScale':
					var colorScaleMethod = function(){
						return d3.scaleLog(); 
					}
						break;
				default:
					var colorScaleMethod = function(){
						return d3.scaleLinear(); 
					} 


			}

			switch(filterCriteria){
				case 'deathsPer100k':
						var max = d3.max(states, function(d){
						return ( 
							(d['properties']['deaths' + year] / d['properties']['population' + year]) * 100000
							)
						});
						var min = d3.min(states, function(d){
							return ( (d['properties']['deaths' + year] / d['properties']['population' + year]) * 100000 ) 
						}); 
						var colorFunction = function(d){
							return colorScale( +d['properties']['deaths' + year] / d['properties']['population' + year] * 100000 ); 
						} 
						break;
				case 'ageAdjustedDeaths':
						var max = d3.max(states, function(d){
						return +d['properties']['rate' + year] 
							
						});
						var min = d3.min(states, function(d){
							return +d['properties']['rate' + year] 
						});  
						var colorFunction = function(d){
							return colorScale( +d['properties']['rate' + year] ); 
						}
						break;
				default:
						var max = d3.max(states, function(d){
						return +d['properties']['deaths' + year] 
						});
						var min = d3.min(states, function(d){
							return +d['properties']['deaths' + year]
						});   
						var colorFunction = function(d){
							return colorScale( +d['properties']['deaths' + year] ); 
						}

			}
			
			console.log(min)
			console.log(max)
			var colorScale = colorScaleMethod().domain([min, max]).range(['#edf8b1','#7fcdbb','#2c7fb8']); 
			
			svg.selectAll('path')
				.data(topojson.feature(data, data.objects.states).features)
				.enter().append('path')
				.attr('d', path)
				.style('fill', colorFunction)
				.on('click', function(d){
					
					console.log(d); 

					d3.select('#state-name').text(d.properties.State)
					d3.select('#state-abbvr').text(d.properties.Abbreviation)

					d3.select('#pop2013').text(d.properties.population2013)
					d3.select('#total2013').text(d.properties.deaths2013)
					d3.select('#agerate2013').text(d.properties.rate2013)
					d3.select('#per100K2013').text(
						Math.round(
							((d.properties.deaths2013 / d.properties.population2013) * 100000) * 10
							) / 10
						)

					d3.select('#pop2014').text(d.properties.population2014)
					d3.select('#total2014').text(d.properties.deaths2014)
					d3.select('#agerate2014').text(d.properties.rate2014)
					d3.select('#per100K2014').text(
						Math.round(
							((d.properties.deaths2014 / d.properties.population2014) * 100000) * 10
							) / 10
						)

					d3.select('#pop2015').text(d.properties.population2015)
					d3.select('#total2015').text(d.properties.deaths2015)
					d3.select('#agerate2015').text(d.properties.rate2015)
					d3.select('#per100K2015').text(
						Math.round(
							((d.properties.deaths2015 / d.properties.population2015) * 100000) * 10
							) / 10
						)
					// var rect = this.getBoundingClientRect(); 
					// var top = rect.top; 
					// var right = rect.right; 
					// var tooltip = d3.select('#tooltip'); 
					// console.log(tooltip)
					
					// tooltip
					// .style('right', right + 'px')
					// .style('top', top + 'px'); 


				})

			svg.append('path')
				.attr('class', 'county-borders')
				.attr('d', path(topojson.mesh(data, data.objects.states, function(a,b){return a!== b})));
		}	

		d3.json('combined-data.json', function(error, data){
			if (error) throw error; 
			json = data; 
			drawMap(data, '2015'); 


		})	