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
 * ClientDetailVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @param _eventHandler -- the Eventhandling Object to emit data to (see Task 4)
 * @constructor
 */
ReferrerDetailVis = function(_parentElement, _referrerData, _perClientData, _clientData, _clientEventHandler){
    this.parentElement = _parentElement;
    this.perClientData = _perClientData;
    this.referrerData = _referrerData;
    this.clientEventHandler = _clientEventHandler;
    this.displayData = {referrer_code: "",
                        city: "",
                        postal_code_referrer: "",
                        visit_count: ""};


    console.log(this.referrerData);


    // define all "constants" here
    this.margin = {top: 20, right: 20, bottom: 50, left: 60},
        this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
        this.height = 200 - this.margin.top - this.margin.bottom;

    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
ReferrerDetailVis.prototype.initVis = function(){

    var that = this; // read about the this

    // creates svg
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");



    // modify this to append an svg element, not modify the current placeholder SVG element
    this.svg = this.parentElement.select("svg");


    // call the update method
    this.updateVis();
}


/**
 * the drawing function - should use the D3 selection, enter, exit
 * @param  options -- only needed if different kinds of updates are needed
 */
ReferrerDetailVis.prototype.updateVis = function(){

    var x = this.margin.right + 70;

    this.svg.selectAll("text").remove();

    this.svg.append("text")
        .attr('x', x)
        .attr('y', 20)
        .style('font-size', 18)
        .html("Referrer Details");
    this.svg.append("text")
        .attr('x', x)
        .attr('y', 50)
        .html("Referrer Code: " + this.displayData.referrer_code);
    this.svg.append("text")
        .attr('x', x)
        .attr('y', 70)
        .html("City: " + this.displayData.city );
    this.svg.append("text")
        .attr('x', x)
        .attr('y', 90)
        .html("Postal Code: "  + this.displayData.postal_code_referrer);
    this.svg.append("text")
        .attr('x', x)
        .attr('y', 110)
        .html("Total Visits: "  + this.displayData.visit_count);





    // console.log(this.displayData);


};

/**
 * Gets called by event handler
 * @param _client_id
 */
ReferrerDetailVis.prototype.onSelectionChange= function (_referrer_code){

    var that = this;

    if (_referrer_code != null) {
        that.referrerData.forEach(function(d) {
            if (d.referrer_code == _referrer_code) {
                that.displayData = d;
            }
        })

    }
    this.updateVis();

};






/**
 * Created by mwinger on 27/04/15.
 */
