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
    this.margin = {top: 20, right: 20, bottom: 50, left: 60},
        this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
        this.height = 200 - this.margin.top - this.margin.bottom;

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
        .range([0, this.width]);

    this.y = d3.scale.linear()
        .range([this.height, 0]);

    this.xAxis = d3.svg.axis()
        .scale(this.x)
        .orient("bottom");

    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .ticks(5)
        .orient("left");

    this.lineGen = d3.svg.line()
        .x(function(d) { return that.x(d.visit_time); })
        .y(function(d) { return that.y(d.product_count); });

    // Add axes visual elements
    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")
        .style("font-size", "24px")
        .attr('fill-opacity', 0.4);

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
        .text("Product Count");

    // modify this to append an svg element, not modify the current placeholder SVG element
    this.svg = this.parentElement.select("svg");

    var referrer_code = null;

    // filter, aggregate, modify data
    this.wrangleData(referrer_code);

    // call the update method
    this.updateVis();
}



/**
 * Method to wrangle the data. In this case it takes an options object
 */
TimeVis.prototype.wrangleData= function(_referrer_code){
    var that = this;
    this.displayData = [];
    // show clients related to referrer
    if (_referrer_code != null) {
        this.perClientData.forEach(function (item) {
            if (item.referrer_code == _referrer_code) {
                that.displayData.push(item);
            }
        })
    }
};

/**
 * the drawing function - should use the D3 selection, enter, exit
 * @param  options -- only needed if different kinds of updates are needed
 */
TimeVis.prototype.updateVis = function(){

    // update graphs (D3: update, enter, exit)
    // updates scales

    var that = this;

    var firstVisit = new Date(2012,0,11);
    var lastVisit = new Date(2014,10,29);

    this.x.domain([firstVisit, lastVisit]);
    this.y.domain([0,5]);

    this.svg.selectAll('path').remove();
    this.svg.selectAll('circle').remove();
    this.svg.selectAll().remove();
    //this.svg.selectAll('.textLabel').exit().remove();

    // add text label
    this.svg.selectAll('.text')
        .data(this.displayData)
        .enter()
        .append("text")
        .text(function(d) {
            return d.referrer_code;
        })
        .attr("x", 100)
        .attr("y", 30)


    // do for every client
    for (var i = 0; i < this.displayData.length; i++) {
        var visits = [];

        this.displayData[i].visit_dates.forEach(function(item) {
            visits.push(item);
        });

        // add line
        this.svg.append('path')
            .attr("class", "line")
            .attr('d', this.lineGen(visits))
            .attr('stroke', 'red')
            .attr('stroke-width', 1)
            .attr('fill', 'none')
            .attr('stroke-opacity', 0.2)
            .attr("transform", "translate("+ this.margin.left + ", " + this.margin.top + ")")
            .on("mouseover", function(d){
                // find associated client id and highlight circles in the
                // current plot
                console.log(d3.select(this.nextElementSibling).data()[0]);
                var associated_referrer_code = d3.select(this.nextElementSibling).data()[0].referrer_code;
                var associated_client_id = d3.select(this.nextElementSibling).data()[0].client_id;
                that.svg.selectAll('circle').data().forEach(function(item, i) {
                    if (item.client_id == associated_client_id) {
                      //  console.log(associated_referrer_code);
                        d3.select(that.svg.selectAll('circle')[0][i])
                            .attr("r", 4)
                            .attr('fill-opacity', 0.7);
                    }
                });
                // and now highlight the user in the graphVis
                var temp = d3.select("#graphVis");
                temp.selectAll("circle").data().forEach( function(item, i) {
                    if (item.client_id == associated_client_id) {
                        var tmp = d3.select("#graphVis").selectAll("circle");
                        // TODO highlight client circle in graphVis
                      //  console.log(d3.select(tmp[i]));

                          //  .attr('fill-opacity', 0.7);
                    }
                });
                d3.select(this)
                    .attr("stroke-opacity", 0.7)
                    .attr('stroke-width', 1.5);
            })
            .on("mouseout", function(d){
                d3.select(this).attr("stroke-opacity", 0.2)
                    .attr('stroke-width', 1.5);
                // circles back to normal
                that.svg.selectAll('circle').data().forEach(function(item, i) {
                    d3.select(that.svg.selectAll('circle')[0][i])
                        .attr("r", 2)
                        .attr('fill-opacity', 0.2);
                });
            });

        // add circles
        this.svg.selectAll('.circle')
            .data(visits)
            .enter()
            .append("circle")
            .attr("r", 2)
            .attr("cx", function(d) {
                return that.x(d.visit_time);
            })
            .attr("cy", function(d) {
                return that.y(d.product_count);
            })
            .attr('fill', 'red')
            .attr('fill-opacity', 0.2)
            .attr("transform", "translate("+ this.margin.left + ", " + this.margin.top + ")")
            .on("mouseover", function(d){
                // highlight path
                d3.selectAll("path").forEach(function(item, i) {
                    //TODO
                    console.log(item);
                  //  console.log(i, item[i]);
                   // d3.select(item[i])
                });

                //d3.select(this.nextElementSibling)
                 //   .attr("stroke-opacity", 0.7)
                   // .attr('stroke-width', 1.5);
                // highlight circle
                d3.select(this).attr("fill-opacity", 0.7);
                d3.select(this).attr('r', 4);

                // TODO highlight associated line and connected circles
            })
            .on("mouseout", function(d){
                // reset the circles
                d3.select(this).attr("fill-opacity", 0.4);
                d3.select(this).attr('r', 2);
            });


        // updates axis
        this.svg.select(".x.axis")
            .call(this.xAxis);

        this.svg.selectAll(".y.axis")
            .call(this.yAxis)
    }

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
TimeVis.prototype.onSelectionChange= function (_referrer_code){

    // only update plot when mouse hits a referrer otherwise leave it for inspection
    if (_referrer_code != null) {
        this.wrangleData(_referrer_code);
        this.updateVis();
        // add referrer text label

    }

};






