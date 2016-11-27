
// Set the dimensions of the canvas / graph
var margin = {top: 10, right: 20, bottom: 200, left: 50},
    width = 1050,
    height = 200 - margin.top + margin.bottom;

// Set the ranges
var x = d3.scale.ordinal().rangeRoundBands([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.geoarea); })
    .y(function(d) { return y(d.meanrate * 100); });

// Adds the svg canvas
var svg = d3.select("#linechart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Get the data
var elemline = document.getElementById("linechart");
elemline = d3.csv("data/meanObesityGenGeoArea.csv", function(error, data) {

    // Scale the range of the data
    x.domain(data.map(function (d) {
            return d.geoarea;
    }));

    y.domain([0, d3.max(data, function (d) {
        return d.meanrate * 100;
    })]);


    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data))
        .attr("transform", "translate(18, 0)")
        .style("stroke", "steelblue")
        .style("stroke-width", 2)
        .style("fill", "none");

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function (d) {
            return "rotate(-65)"
        });

    //Add X Axis label
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("Geographic Areas and Other Categories");

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // Add Y Axis label
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Percent Population Obese");

    // Choose data according to option selection
    var selectChange = function () {
        // Clear existing path
        svg.selectAll(".line").remove();

        // Get value of selection from drop down menu
        var selectedValue = d3.event.target.value;

        // Filter data according to year selected
        var filteredData = data.filter(function (d) {
            return (selectedValue === d.year) || 'all' === selectedValue;
        });

        // Scale the range of the filtered data
        x.domain(filteredData.map(function (m) {
            return m.geoarea;
        }));

        y.domain([0, d3.max(filteredData, function (m) {
            return m.meanrate * 100;
        })]);

        // Add the valueline path.
        svg.append("path")
            .attr("class", "line")
            .attr("d", valueline(filteredData))
            .attr("transform", "translate(18, 0)")
            .style("stroke", "steelblue")
            .style("stroke-width", 2)
            .style("fill", "none");
    };

    d3.select(".lineoption").on("change", selectChange);
});


