class Piechart {
    margin = {
        top: 10, right: 10, bottom: 40, left: 40
    }

    constructor(svg, width = 400, height = 400) {
        this.svg = svg;
        this.width = width;
        this.height = height;
		this.radius = Math.min(width, height) / 2 - 10;
    }

    initialize() {
        this.svg = d3.select(this.svg);
        this.container = this.svg.append("g");
        this.legend = this.svg.append("g");

        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.container.attr("transform", `translate(${this.width/2}, ${this.height/2})`);
    }

    update(data, xVar) {
        const categories = [...new Set(data.map(d => d[xVar]))]
        const counts = {}
        categories.forEach(c => {
            counts[c] = data.filter(d => d[xVar] === c).length;
        })

		const pie = d3.pie()
		  .value(d => d[1])
		const data_pie = pie(Object.entries(counts))
	
		const color = d3.scaleOrdinal().domain(data).range(d3.schemeSet3)
		
		var arcGenerator = d3.arc()
			.innerRadius(0)
			.outerRadius(this.radius)

        this.container.selectAll("mySlices")
          .data(data_pie)
          .join("path")
          .attr('d', arcGenerator)
          .attr("stroke", "black")
		  .attr("stroke-width", "2px")
		  .attr("opacity", 0.7)
          .attr("fill", d => color(d.data[0]))
		  .transition()
		  .duration(100)
		  
 		this.container.selectAll('mySlices')
			.data(data_pie)
			.enter()
			.append('text')
			.text(d => d.data[0])
			.attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
			.style("text-anchor", "middle")
			.style("font-size", 17)
			.style("font-family", "Arial")
		
		this.container.selectAll('mySlices')
			.exit()
			.remove()
    }
}