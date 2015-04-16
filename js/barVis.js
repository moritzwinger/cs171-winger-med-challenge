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
BarVis = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = _data;
    this.allData = [];

    // define all constants here
    this.margin = {top: 20, right: 0, bottom: 30, left: 90},
        this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
        this.height = 400 - this.margin.top - this.margin.bottom;

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
        .range([0, this.height]);

    this.xAxis = d3.svg.axis()
        .scale(this.x)

    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .orient("left")

    // Add axes visual elements

    this.svg.append("g")
        .attr("transform", "translate(0," + this.height + ")")


    this.svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("transform", "rotate(-90)")
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
BarVis.prototype.wrangleData= function(_filterFunction){

    this.allData = this.filterAndAggregate(null);
    // displayData should hold the data which is visualized
    this.displayData = this.filterAndAggregate(_filterFunction);

    //// you might be able to pass some options,
    //// if you don't pass options -- set the default options
    //// the default is: var options = {filter: function(){return true;} }
    //var options = _options || {filter: function(){return true;}};
}



/**
 * the drawing function - should use the D3 selection, enter, exit
 */
BarVis.prototype.updateVis = function(_timeRange) {



    // this.timeRange = _timeRange;
    if (_timeRange == null) {
        this.currentTimeRange = this.totalTimeRange;
    }
    else {
        this.currentTimeRange = _timeRange;
    }

    //...update graphs
    this.y.domain(d3.extent(this.displayData, function(d) { return d; })).range([0, this.height]);

    var that = this;

    var bar = this.svg.selectAll(".bar")
        .data(this.displayData);

    // Append new bar groups, if required
    var bar_enter = bar.enter().append("g");

    // Append a rect and a text only for the Enter set (new g)
    bar_enter.append("rect");

    // Add attributes (position) to all bars
    bar
        .attr("class", "bar")
        .transition()
        .attr("transform", "translate("+ this.margin.left + ", " + this.margin.top + ")")
        .attr("transform", function(d, i) { return "translate(" + i * 40  + ", 0)"; });

    // Remove the extra bars
    bar.exit()
        .remove();

    // Update all inner rects and texts (both update and enter sets)
    bar.selectAll("rect")
        .transition()
        .attr("width", 30)
        .attr("height",function(d) {
            var index = that.allData.indexOf(d);
            return (that.y(that.displayData[index]) + that.margin.top);
        })
        .attr("x", function(d,i) {
            return that.margin.left;
        })
        .attr("y", function(d) {
            var index = that.allData.indexOf(d);
            return 0;//(that.height - that.y(that.displayData[index]) - that.margin.top);
        })
        .style("fill", function(d, i) {
            var index = that.allData.indexOf(d);
            var totalDays = (that.totalTimeRange.selectionEnd - that.totalTimeRange.selectionStart)
                / (60*60*24);
            var currentDays = (that.currentTimeRange.selectionEnd - that.currentTimeRange.selectionStart)
                / (60*60*24);
            if (that.displayData[index] / currentDays > that.allData[index] / totalDays) {
                return "green";
            } else if (that.displayData[index] / currentDays == that.allData[index] / totalDays) {
                return "black"
            } else return "red";
        });

    bar.append("text")
        .text(function(d,i) {
            return that.metaData.choices[i+100];
        })
        .attr("x", 0)
        .attr("transform", function(d, i) {
            var temp =  that.margin.left + 17;
            var height = that.height + that.margin.top - 5;
            return "translate(" + temp   + "," +
                height +")" + "rotate(-90)"})
        .attr("fill", "#BDBBB5")
        .attr("shape-rendering", "crispEdges")

    // updates axis
    this.svg.select(".x.axis")
        .call(this.xAxis)

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





