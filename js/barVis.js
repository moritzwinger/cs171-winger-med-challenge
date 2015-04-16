/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 1/28/15.
 */



/*
 *
 * ======================================================
 * We follow the vis template of init - wrangle - update
 * ======================================================
 *
 * */

/**
 * BarVis object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
BarVis = function(_parentElement, _data, _eventHandler){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = _data;
    this.eventHandler = _eventHandler;

    // define all constants here
    this.margin = {top: 20, right: 0, bottom: 50, left: 90},
        this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
        this.height = 200 - this.margin.top - this.margin.bottom;

    this.initVis();

}


/**
 * Method that sets up the SVG and the variables
 */
BarVis.prototype.initVis = function(){


    var that = this; // read about the this

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
        .append("text")
        .attr("transform", "rotate(-90)")
        .style("font-size", "24px")
        .attr("y", -60)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Visit Count");


    // modify this to append an svg element, not modify the current placeholder SVG element
    this.svg = this.parentElement.select("svg");

    // filter, aggregate, modify data
    this.wrangleData(null);

    // call the update method
    this.updateVis(null);
}


/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
BarVis.prototype.wrangleData= function(){
    this.displayData = this.displayData;
};



/**
 * the drawing function - should use the D3 selection, enter, exit
 */
BarVis.prototype.updateVis = function() {
    //...update graphs
    this.y.domain(d3.extent(this.displayData, function(d) { return d.visit_count; }));
    this.x.domain([0,100]);

    var that = this;

    var bar = this.svg.selectAll(".bar")
        .data(this.displayData);

    // Append new bar groups, if required
    var bar_enter = bar.enter().append("g");

    // Append a rect and a text only for the Enter set (new g)
    bar_enter.append("rect")
        .on("mouseover", function(d) {
            d3.select(this).attr("fill-opacity", 0.7);
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

    this.svg.selectAll(".y.axis")
        .call(this.yAxis)



}


/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
BarVis.prototype.onSelectionChange= function (timeRange){

    // call wrangle function
    this.wrangleData(timeRange);

    this.updateVis(timeRange);
}





