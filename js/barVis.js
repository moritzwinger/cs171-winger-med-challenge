/**
 * BarVis: Bar Chart on Referrer Information (Number of referrals as function of source)
 * @param _parentElement
 * @param _data
 * @param _eventHandler
 * @param _clientEventHandler
 * @param _referrerEventHandler
 * @constructor
 */
BarVis = function(_parentElement, _data, _eventHandler, _clientEventHandler, _referrerEventHandler){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = _data;
    this.eventHandler = _eventHandler;
    this.clientEventHandler = _clientEventHandler;
    this.referrerEventHandler = _referrerEventHandler;

    // define all constants here
    this.margin = {top: 20, right: 0, bottom: 50, left: 90},
        this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
        this.height = 200 - this.margin.top - this.margin.bottom;

    this.initVis();

};

/**
 * sets up the SVG and the variables
 */
BarVis.prototype.initVis = function(){
    var that = this;
    // construct or select SVG
    // create axis and scales
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.x = d3.scale.linear()
        .range([0, this.width]);

    this.y = d3.scale.linear()
        .range([this.height - that.margin.top  - 35, 0]);

    this.xAxis = d3.svg.axis()
        .scale(this.x);

    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .ticks(5)
        .orient("left");

    // Add axes visual elements
    this.svg.append("g")
        .attr("transform", "translate(0," + this.height + ")")

    this.svg.append("g")
        .attr("class", "y axis")
        .style("fill-opacity", 0.4)
        .append("text")
        .attr("transform", "rotate(-90)")
        .style("font-size", "24px")
        .attr("y", -60)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr('fill-opacity', 0.4)
        .text("Visit Count");

    // modify this to append an svg element, not modify the current placeholder SVG element
    this.svg = this.parentElement.select("svg");

    // modify data
    this.wrangleData(null);

    // call the update method
    this.updateVis(null);
};

/**
 * modify data
 */
BarVis.prototype.wrangleData= function(){
    this.displayData = this.displayData;
};

/**
 * update vis
 */
BarVis.prototype.updateVis = function() {
    //...update graphs
    this.y.domain(d3.extent(this.displayData, function(d) { return d.visit_count; }));
    this.x.domain([0,100]);

    var that = this;

    var bar = this.svg.selectAll(".bar")
        .data(this.displayData);

    // Append new bar groups, if required
    this.bar_enter = bar.enter().append("g");

    // Append a rect and a text only for the Enter set (new g)
    this.bar_enter.append("rect")
        .on("mouseover", function(d) {
            d3.select(this).attr("fill-opacity", 0.7);
            $(that.referrerEventHandler).trigger("selectionChanged", d.referrer_code.toString());
            $(that.eventHandler).trigger("selectionChanged", d.referrer_code);
        })
        .on('mouseout', function(d) {
            d3.select(this).attr("fill-opacity", 0.2);
            $(that.eventHandler).trigger("selectionChanged", null);
        });

    // Add attributes (position) to all bars
    bar
        .attr("class", "bar")
        .transition()
        .attr("transform", "translate("+ this.margin.left + ", " + this.margin.top + ")")
        .attr("transform", function(d, i) {
            return "translate(" + i * 12  + "," + 0 + ")";
        });

    // Remove the extra bars
    bar.exit()
        .remove();

    // Update all inner rects and texts (both update and enter sets)
    bar.selectAll("rect")
        .transition()
        .attr("width", 10)
        .attr('fill-opacity', 0.2)
        .attr("height",function(d) {
            return d.visit_count;
        })
        .attr("x", function(d,i) {
            return that.margin.left;
        })
        .attr("y", function(d) {
           // var index = that.allData.indexOf(d);
            return that.height - d.visit_count - 35;
        });

    bar.append("text")
        .text(function(d,i) {
            return that.displayData[i].referrer_code;
        })
        .attr("x", 0)
        .attr("transform", function(d, i) {
            var temp =  that.margin.left;
            var height = that.height + that.margin.top - 50 ;
            return "translate(" + temp   + "," +
                height +")" + "rotate(-270)"})
        .attr("fill", "#BDBBB5")
        .attr("shape-rendering", "crispEdges")
        .on("mouseover", function(d) {
            d3.select(this).attr("fill", "black");
            $(that.eventHandler).trigger("selectionChanged", d.referrer_code);
            $(that.referrerEventHandler).trigger("selectionChanged", d.referrer_code);
        })
        .on("mouseout", function(d) {
            d3.select(this).attr("fill", "#BDBBB5");
            $(that.eventHandler).trigger("selectionChanged", null);
        });

    this.svg.selectAll(".y.axis")
        .call(this.yAxis)
};

/**
 * called by event handler
 * @param _referrer_code
 */
BarVis.prototype.onSelectionChange= function (_referrer_code){
    if (_referrer_code != null) {
        this.bar_enter.each(function(d) {
            if (d.referrer_code == _referrer_code) {
                d3.select(this).selectAll("rect")
                    .attr('fill-opacity', 0.7);
                d3.select(this).selectAll("text")
                    .attr("fill", "black")
            }
        });
    } else {
        this.bar_enter.each(function(d) {
            d3.select(this).selectAll("rect")
                .attr('fill-opacity', 0.2);
            d3.select(this).selectAll("text")
                .attr("fill", "#BDBBB5")
        });
    }
};





