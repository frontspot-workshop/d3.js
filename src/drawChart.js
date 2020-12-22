const drawChart = () => {

    let data = [{Date: new Date('2015-05-05'), score: 5}
        , {Date: new Date('2015-06-05'), score: 10}
        , {Date: new Date('2015-07-05'), score: 30}
        , {Date: new Date('2015-08-05'), score: 25}
    ]


    const margin = {top: 20, right: 20, bottom: 20, left: 60},
        padding = {top: 60, right: 60, bottom: 60, left: 60},
        outerWidth = 960,
        outerHeight = 500,
        innerWidth = outerWidth - margin.left - margin.right,
        innerHeight = outerHeight - margin.top - margin.bottom,
        width = innerWidth - padding.left - padding.right,
        height = innerHeight - padding.top - padding.bottom;

    const svg = d3.select("main").append("svg")
        .attr("width", outerWidth)
        .attr("height", outerWidth)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    const xScale = d3.scaleTime().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);

    xScale.domain(d3.extent(data.map((d) => {return d.Date})));
    yScale.domain(d3.extent(data.map((d) => {return d.score})));


    const yAxis = d3.axisLeft().scale(yScale);
    const xAxis = d3.axisBottom().scale(xScale);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "axis")
        .call(yAxis);

    const line = d3.line()
        .x((d) => {return xScale(d.Date)})
        .y((d) => {return yScale(d.score)})
    ;

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "line")
        .attr("stroke", "red")
        .attr("stroke-width", 3)
        .attr("d", line)
    ;

    svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', function(d) {return xScale(d.Date)})
        .attr('cy', function (d) {return yScale(d.score)})
        .attr('fill', 'red')
        .attr('r', 5)
        .on('click' , (e,d) => {
            console.log('d: ', d.Date);
            console.log('d: ', d.score);
        })
    ;
}
