d3.csv('wealth-health-2014.csv', d3.autoType).then(d=>{
    console.log(d);
	renderPlot(d);
});

function renderPlot(data) {
	const margin = ({top: 20, right: 20, bottom: 21, left: 21})
    const width = 650 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    const svg = d3.select(".chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3
        .scaleLog()
        .domain(d3.extent(data, function(d) { return d.Income; }))
        .range([0, width])

    const yScale = d3
        .scaleLog()
        .domain(d3.extent(data, function(d) { return d.LifeExpectancy; }))
        .range([height, 0])

    const rScale = d3
        .scaleLinear()
        .domain(d3.extent(data, function(d) { return d.Population; }))
        .range([6, 35])

    const colorScale = d3
        .scaleOrdinal()
        .domain(new Set(data.map(d => d.Region)))
        .range(d3.schemeTableau10)
        
    const dots = svg.selectAll('.dot')
		.data(data)
		.enter()
		.append('circle')
		.attr('class', 'dot')
		.attr('cx', d=>xScale(d.Income))
		.attr('cy', d=> yScale(d.LifeExpectancy))
		.attr('r', function (d){
			return rScale(d.Population);
        })
        .attr('stroke', 'black')
        .attr('fill', function(d) {
            return colorScale(d.Region)
        })
        .attr('opacity', '75%')
        .on("mouseenter", (event, d) => {
            const pos = d3.pointer(event, window);
            let tip = d3.select("#tooltip")
			  .style("left", pos[0] + "px")
			  .style("top", pos[1] + "px");
			tip.select("#country")
              .text(d.Country);
              tip.select("#region")
              .text("Region: " + d.Region);
              tip.select("#population")
              .text("Population: " + d.Population);
              tip.select("#income")
              .text("Income: " + d.Income);
              tip.select("#life")
			  .text("Life Expectancy: " + d.LifeExpectancy);
            // show the tooltip
            d3.select("#tooltip").classed("hidden", false);
        })
        .on("mouseleave", (event, d) => {
            // hide the tooltip
            d3.select("#tooltip").classed("hidden", true);
        });
    
    const xAxScale = d3
        .scaleLinear()
        .domain(d3.extent(data, function(d) { return d.Income; }))
        .range([0, width])

    const yAxScale = d3
        .scaleLinear()
        .domain(d3.extent(data, function(d) { return d.LifeExpectancy; }))
        .range([height, 0])
    
    const xAxis = d3.axisBottom()
        .scale(xAxScale)
        .ticks(5, "s")

    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)

    const yAxis = d3.axisLeft()
        .scale(yAxScale)

    svg.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis);
    
    svg.append("text")
		.attr('x', width-55)
		.attr('y', height-10)
        .text("Income")
        
    svg.append("text")
		.attr('x', 16)
        .attr('y', 0)
        .attr('writing-mode', 'vertical-lr')
        .text("Life Expectancy")

    const legend = svg.selectAll('.key')
		.data(new Set(data.map(d => d.Region)))
		.enter()
		.append('rect')
        .attr('class', 'key')
        .attr('width', '20px')
		.attr('height', '20px')
		.attr('x', width-150)
		.attr('y', function (d, i){
			return i*30 + 250;
        })
        .attr('fill', function (d, i){
			return colorScale(d);
        })

    const labels = svg.selectAll('.label')
		.data(new Set(data.map(d => d.Region)))
		.enter()
		.append('text')
		.attr('class', 'label')
		.attr('x', width-120)
		.attr('y', function (d, i){
			return i*30 + 265;
        })
		.text( function (d) { 
			return d;
		})
		.attr('font-size', '12px')
}