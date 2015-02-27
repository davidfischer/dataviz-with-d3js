"use strict";

(function () {
  // Define the margins around the plot (with enough space for axes),
  // the height and width of the actual plotting area
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // Parse the date from the representation in the CSV (iso8601)
  // When displaying dates, use "Month, Year"
  var parseDate = d3.time.format("%Y-%m-%d").parse,
      formatDate = d3.time.format('%B %Y');

  // Creates a scale to translate CSV data into X,Y points on the plot
  // The domain of this scale will be set after the data is fetched
  var x = d3.time.scale()
      .range([0, width]);
  var y = d3.scale.linear()
      .range([height, 0]);

  // Create and orient the axes which will be drawn later
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  // Creates an SVG line
  // The actual line is drawn later after the data is fetched
  var line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.members); });

  // Append the root <svg> element to the DOM
  // All other elements (except the tooltip) will be added to this element
  var svg = d3.select("#sdpython-meetup").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create a <div> element where additional tooltip data will be displayed
  var tooltip = d3.select("#sdpython-meetup").append("div")
      .attr("id", "sdpython-meetup-tooltip")
      .style("display", "none")
      .style("position", "absolute");


  // Fetch the actual data via AJAX
  d3.csv("datasets/sdpython-meetup.csv", function(error, data) {
    // Parse the CSV data into the appropriate data types
    data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.members = parseInt(d.members);
    });

    // Creates a range for the X and Y data that can translate the data
    // from the CSV (dates and integers) into points on the plot
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain(d3.extent(data, function(d) { return d.members; }));

    // Now that the range of the data (min, max) has been calculated
    // The actual tick marks on the axes can be drawn
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Members");

    // Draw the actual line onto the graph
    svg.append("path")
        .datum(data)            // This is the key to data binding
        .attr("class", "line")
        .attr("d", line);

    // Draw SVG circles onto the graph for the actual data points
    // These circles allow hovering and show the tooltip when
    // notes about that data point are available
    svg.selectAll(".dots")
        .data(data).enter()
        .append("circle")
        .attr("class", function (d) {
          return d.notes ? "dot poi" : "dot";
        })
        .attr("r", 5)   // Circle radius = 5
        .attr("transform", function(d) {
          // Place the circle on the graph based on the X, Y coords
          return "translate(" + x(d.date) + "," + y(d.members) + ")";
        })
        .on("mouseover", function(d) {
          // Show the tooltip at the current mouse position
          var m = d3.mouse(d3.select("#sdpython-meetup").node());
          if (d.notes) {
            tooltip.style("display", null)
                .style("left", m[0] + 30 + "px")
                .style("top", m[1] - 20 + "px");
            tooltip.html('<strong>' + formatDate(d.date) + '</strong><br />' + d.notes);
          }
        }).on("mouseout", function() {
          // Hide the tooltip
          tooltip.style("display", "none");
        });
  });
}());
