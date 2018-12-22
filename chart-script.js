var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// load data
d3.json("result.json", function(error, data) {
    //console.log(data);

    // setup x
    var xValue = function(d) { return d.rollNo; }, // data -> value
        xScale = d3.scale.linear().range([0, width]).domain([d3.min(data, xValue) - 2, d3.max(data, xValue) + 1]), // value -> display
        xMap = function(d) { return xScale(xValue(d)); }, // data -> display
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    // setup y
    var yValue = function(d) { return d.marks; }, // data -> value
        yScale = d3.scale.linear().range([height, 0]).domain([d3.min(data, yValue) - 2, d3.max(data, yValue) + 1]), // value -> display
        yMap = function(d) { return yScale(yValue(d)) }, // data -> display
        yAxis = d3.svg.axis().scale(yScale).ticks(15).orient("left");

    // setup fill color
    var cValue = function(d) { return d.name; },
        color = '#000'; //d3.scale.category10()
    var showGreenBand = true

    // add the graph canvas to the body of the webpage
    var svg = d3.select("#chartContainer").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("viewBox", "0 0 250 250")
        .attr("preserveAspectRatio", "xMinYMin meet");

    // add the tooltip area to the webpage
    var tooltip = d3.select("#chartContainer").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    // add graph options for customizing graph
    var graph_options = {
        "SkyBlueValue": "90.0",
        "AmberValue": "60.0",
        "RedValue": "35.0",
        "Operator": "<"
    };

    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Roll Number");

    // y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Marks (out of 100)");

    //append color to the bands
    appendColorBands();

    // draw dots
    var dot = svg.selectAll(".dot")
        .data(data)
        .enter().append("rect")
        .attr("class", "dot")
        .attr("width", 5)
        .attr("height", 5)
        .attr("x", xMap)
        .attr("y", yMap)
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", .9);
            tooltip.html(d.name + "<br/> (" + xValue(d) +
                    ", " + yValue(d) + ")")
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(1000)
                .style("opacity", 0);
        });

    //apply transition to the dots
    dot.transition()
        .each(showAmimation);

    function showAmimation() {
        var rect = d3.select(this);
        //console.log(rect.attr("x"), rect.attr("y"));
        if (rect.attr("y") > 332) {
            //console.log('If');
            let y1 = Math.floor(Math.random() * (450 - 332) + 332);
            let x1 = Math.floor(Math.random() * (450 - 332) + 332);

            function loop1() {
                rect.transition()
                    .duration(5000)
                    .attr("x", x1)
                    .attr("y", y1)
                    .transition()
                    .attr("x", xMap)
                    .attr("y", yMap)
                    .each("end", function() { loop1(); });
            }
            loop1();
        }
        if (rect.attr("y") > 200 && rect.attr("y") < 332) {
            //console.log('If-else');
            let y2 = Math.floor(Math.random() * (330 - 200) + 200);
            let x2 = Math.floor(Math.random() * (330 - 200) + 200);

            function loop2() {
                rect.transition()
                    .duration(5000)
                    .attr("x", x2)
                    .attr("y", y2)
                    .transition()
                    .attr("x", xMap)
                    .attr("y", yMap)
                    .each("end", function() { loop2(); });
            }
            loop2();
        }
        if (rect.attr("y") > 45 && rect.attr("y") < 200) {
            //console.log('If-else2');
            let y3 = Math.floor(Math.random() * (200 - 45) + 45);
            let x3 = Math.floor(Math.random() * (200 - 45) + 45);

            function loop3() {
                rect.transition()
                    .duration(5000)
                    .attr("x", x3)
                    .attr("y", y3)
                    .transition()
                    .attr("x", xMap)
                    .attr("y", yMap)
                    .each("end", function() { loop3(); });
            }
            loop3();
        }
        if (rect.attr("y") < 45) {
            //console.log('If-else3');
            let y4 = Math.floor(Math.random() * (45 - 0) + 0);
            let x4 = Math.floor(Math.random() * (45 - 0) + 0);

            function loop4() {
                rect.transition()
                    .duration(5000)
                    .attr("x", x4)
                    .attr("y", y4)
                    .transition()
                    .attr("x", xMap)
                    .attr("y", yMap)
                    .each("end", function() { loop4(); });
            }
            loop4();
        }
    }

    function pathBandData(yStart, yEnd) {
        // check to see if band falls outside of the y-Axis scale, if so, return nothing
        if (yStart > yScale.domain()[1] && yEnd > yScale.domain()[1]) {
            return null;
        } else // otherwise, draw the banding box. still check we don't go beyond the y-Axis scale at each point.
        {
            return "M" + xScale(xScale.domain()[0]) + "," + (yStart > yScale.domain()[1] ? yScale(yScale.domain()[1]) : yScale(yStart)) +
                "L" + xScale(xScale.domain()[0]) + "," + (yEnd > yScale.domain()[1] ? yScale(yScale.domain()[1]) : yScale(yEnd)) +
                "L" + xScale(xScale.domain()[1]) + "," + (yEnd > yScale.domain()[1] ? yScale(yScale.domain()[1]) : yScale(yEnd)) +
                "L" + xScale(xScale.domain()[1]) + "," + (yStart > yScale.domain()[1] ? yScale(yScale.domain()[1]) : yScale(yStart));
        }
    }

    function appendColorBands() {
        var GreenValue = yScale.domain()[0];
        var EndValue = yScale.domain()[1];
        if (graph_options.Operator == "<") {
            // SWAP RED/GREEN START POINTS IF LESS IS WORSE
            GreenValue = yScale.domain()[1];
            EndValue = yScale.domain()[0];
        }
        if (showGreenBand) {
            svg.append("g").append("path") // GREEN
                .attr("d", pathBandData(GreenValue, graph_options.SkyBlueValue))
                .style("opacity", 0.2)
                .style("stroke", "#005e23")
                .style("fill", "#005e23");
        }
        svg.append("g").append("path")
            .attr("d", pathBandData(graph_options.SkyBlueValue, graph_options.AmberValue))
            .style("opacity", 0.2)
            .style("stroke", "#00bfff")
            .style("fill", "#00bfff");
        svg.append("g").append("path")
            .attr("d", pathBandData(graph_options.AmberValue, graph_options.RedValue))
            .style("opacity", 0.2)
            .style("stroke", "#f90")
            .style("fill", "#f90");
        svg.append("g").append("path")
            .attr("d", pathBandData(graph_options.RedValue, EndValue))
            .style("opacity", 0.2)
            .style("stroke", "#c03")
            .style("fill", "#c03");
    }


    // draw legend
    /*var legend = svg.selectAll(".legend")
        .data(color.domain())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });*/

    // draw legend colored rectangles
    /*legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    // draw legend text
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d;})*/
});