//Width and height
var w = 1050;
var h = 600;

//Define map projection
var projection = d3.geo.robinson()
    .scale(200)
    .translate([w/2,h/2]);

//Define path generator
var path = d3.geo.path()
    .projection(projection);

//Create SVG element
var svgMap = d3.select("#map")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

var color = d3.scale.quantize()
    .domain([0, 0.601])
    .range(['#2c7bb6','#abd9e9','#ffffbf','#fdae61','#d7191c']);

var elem = document.getElementById("map");
elem = d3.csv("data/obesitydata2013.csv", function(data) {

            //Load in GeoJSON data
            d3.json("data/world-population.geo.json", function(json) {

                //Merge the data and GeoJSON
                //Loop through once for each data value
                for (var i = 0; i < data.length; i++) {

                    //Grab country name
                    var meanCountry = data[i].country;

                    //Grab data value, and convert from string to float
                    var meanValue = parseFloat(data[i].meanrate);

                    //Find the corresponding country inside the GeoJSON
                    for (var j = 0; j < json.features.length; j++) {

                        var jsonCountry = json.features[j].properties.NAME;

                        if(meanCountry == jsonCountry) {

                            json.features[j].properties.value = meanValue;

                            break;
                        }
                    }
                }

                //Bind data and create one path per GeoJSON feature
                svgMap.selectAll("path")
                    .data(json.features)
                    .enter()
                    .append("path")
                    .attr("d", path)
                    .style("stroke", "#666666")
                    .style("fill", function(d) {
                        var value = d.properties.value;

                        if (value) {
                            return color(value);
                        } else {
                            return "#dddddd";
                        }
                    });
            });
        });

