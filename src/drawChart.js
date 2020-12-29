class Chart {

    constructor() {
        this.draw();
    }

    draw() {
        // define width, height and margin
        this.margin = {top: 20, right: 20, bottom: 20, left: 60};
        this.padding = {top: 60, right: 60, bottom: 60, left: 60};
        this.outerWidth = 960;
        this.outerHeight = 500;
        this.innerWidth = outerWidth - this.margin.left - this.margin.right;
        this.innerHeight = outerHeight - this.margin.top - this.margin.bottom;
        this.width = innerWidth - this.padding.left - this.padding.right;
        this.height = innerHeight - this.padding.top - this.padding.bottom;

        // set up parent element and SVG
        this.svg = d3.select("main").append("svg")
            .attr("width", this.outerWidth)
            .attr("height", this.outerWidth)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");



        this.xScale = d3.scaleTime().range([0, this.width]);
        this.yScale = d3.scaleLinear().range([this.height, 0]);

        this.yaxis = d3.axisLeft().scale(this.yScale);
        this.xaxis = d3.axisBottom().scale(this.xScale);

        this.svg.append("g")
            .attr("class", "yaxis");

        this.svg.append("g")
            .attr("class", "xaxis")
            .attr("transform", "translate(0," + this.height + ")");


    }


    async updateData(weeks) {

        this.data = await d3.json('https://api.covid19api.com/total/country/Kazakhstan').then(function (data) {
            data.forEach((d) => {
                d.Date = new Date(d.Date);
            });
            let periodDate = new Date();
            periodDate.setDate(periodDate.getDate() - weeks * 7);

            return data.filter((d, i) => {
                if (d.Date > periodDate) {
                    return d;
                }
            })

        });
    }


    addLine(param) {

        this.xScale.domain(d3.extent(this.data.map((d) => {
            return d.Date
        })));
        this.yScale.domain(d3.extent(this.data.map((d) => {
            return d.Recovered
        })));

        this.yaxis = d3.axisLeft().scale(this.yScale);
        this.xaxis = d3.axisBottom().scale(this.xScale);


        this.svg.selectAll(".yaxis").transition()
            .duration(3000)
            .call(this.yaxis);

        this.svg.selectAll(".xaxis").transition()
            .duration(3000)
            .call(this.xaxis);

        let line = d3.line()
            .x((d) => {
                return this.xScale(d.Date)
            })
            .y((d) => {
                return this.yScale(d.Recovered)
            });

        if (param === 'new') {
            this.svg.append("path")
                .datum(this.data)
                .attr("fill", "none")
                .attr("class", "line")
                .attr("stroke", "red")
                .attr("stroke-width", 3)
                .attr("d", line);
        } else {
            d3.select(".line").transition()   // change the line
                .duration(750)
                .attr("d", line(this.data));
        }

        this.svg.selectAll("circle")
            .transition()
            .duration(750)
            .remove();

        this.svg.selectAll('.dot')
            .data(this.data)
            .enter()
            .append('circle')
            // .transition()   // change the line
            // .duration(750)
            .attr('class', 'dot')
            .attr('cx', (d) => {return this.xScale(d.Date)})
            .attr('cy',  (d) => {return this.yScale(d.Recovered)})
            .attr('fill', 'red')
            .attr('r', 5)
            .on('mouseover' , (e, d) => {
                d3.select(e.currentTarget)
                    .transition()
                    .duration(500)
                    .attr("fill", "maroon").attr("r", 8);
            })
        ;





    }


}
