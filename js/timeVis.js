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
 * TimeVis object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @param _eventHandler -- the Eventhandling Object to emit data to (see Task 4)
 * @constructor
 */
TimeVis = function(_parentElement, _referrerData, _perClientData, _clientData, _eventHandler){
    this.parentElement = _parentElement;
    this.perClientData = _perClientData;
    this.referrerData = _referrerData;
    this.eventHandler = _eventHandler;
    this.displayData = [];

    // define all "constants" here
    this.margin = {top: 20, right: 0, bottom: 30, left: 30},
        this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
        this.height = 400 - this.margin.top - this.margin.bottom;

    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
TimeVis.prototype.initVis = function(){

    var that = this; // read about the this

    // creates svg
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // creates axis and scales
    this.x = d3.time.scale()
        .range([30, this.width]);

    this.y = d3.scale.linear()
        .range([this.height, 30]);

    this.xAxis = d3.svg.axis()
        .scale(this.x)
        .orient("bottom");

    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .orient("left")

    // Add axes visual elements
    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")

    this.svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Purchased Articles");


    // modify this to append an svg element, not modify the current placeholder SVG element
    this.svg = this.parentElement.select("svg");

    // filter, aggregate, modify data
    this.wrangleData();

    // call the update method
    this.updateVis();
}



/**
 * Method to wrangle the data. In this case it takes an options object
 */
TimeVis.prototype.wrangleData= function(){
    // displayData should hold the data which is visualized
    // pretty simple in this case -- no modifications needed
    this.displayData = this.perClientData;
}

/**
 * the drawing function - should use the D3 selection, enter, exit
 * @param  options -- only needed if different kinds of updates are needed
 */
TimeVis.prototype.updateVis = function(){

    // update graphs (D3: update, enter, exit)
    // updates scales
    console.log(this.displayData);

    this.x.domain(d3.extent(this.displayData, function(d) { return d.time; }));
    this.y.domain(d3.extent(this.displayData, function(d) { return d.product_count; }));

    // updates graph
    var path = this.svg.selectAll(".circle")
        .data([this.displayData])

    path.enter()
        .append("circle")
        .attr("r", 5)
        .attr("transform", "translate("+ this.margin.left + ", " + this.margin.top + ")");

    path.transition()
        .attr("d", this.area);

    path.exit()
        .remove();

    // updates axis
    this.svg.select(".x.axis")
        .call(this.xAxis);

    this.svg.selectAll(".y.axis")
        .call(this.yAxis)

}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
TimeVis.prototype.onSelectionChange= function (){

};






