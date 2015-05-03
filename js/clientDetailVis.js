/**
 * ClientDetailVis: print details of a particular client
 * @param _parentElement
 * @param _referrerData
 * @param _perClientData
 * @param _clientData
 * @param _clientEventHandler
 * @constructor
 */
ClientDetailVis = function(_parentElement, _referrerData, _perClientData, _clientData, _clientEventHandler){
    this.parentElement = _parentElement;
    this.perClientData = _perClientData;
    this.referrerData = _referrerData;
    this.clientEventHandler = _clientEventHandler;
    this.displayData = {product_count: "",
                        latitude: "",
                        longitude: "",
                        city: "",
                        client_id: "",
                        latitude: "",
                        longitude: "",
                        product_count: "",
                        referrer_code: "",
                        visit_dates: []
                        };

    // define all "constants" here
    this.margin = {top: 20, right: 20, bottom: 50, left: 60},
        this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
        this.height = 200 - this.margin.top - this.margin.bottom;

    this.initVis();
};


/**
 * set up the SVG and the variables
 */
ClientDetailVis.prototype.initVis = function(){
    // create svg
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // modify this to append an svg element, not modify the current placeholder SVG element
    this.svg = this.parentElement.select("svg");

    // call the update method
    this.updateVis();
};


/**
 * update vis
 */
ClientDetailVis.prototype.updateVis = function(){

    var x = this.margin.right + 30;

    this.svg.selectAll("text").remove();

    this.svg.append("text")
        .attr('x', x)
        .attr('y', 20)
        .style('font-size', 18)
        .html("Client Details");
    this.svg.append("text")
        .attr('x', x)
        .attr('y', 50)
        .html("Client ID: " + this.displayData.client_id);
    this.svg.append("text")
        .attr('x', x)
        .attr('y', 70)
        .html("City: " + this.displayData.city);
    this.svg.append("text")
        .attr('x', x)
        .attr('y', 90)
        .html("Referrer Code: " + this.displayData.referrer_code);
    this.svg.append("text")
        .attr('x', x)
        .attr('y', 110)
        .html("Total Number of Products purchased: " + this.displayData.product_count);
    this.svg.append("text")
        .attr('x', x)
        .attr('y', 130)
        .html("Visit Dates :: Items per Visit:");
        var temp_y = 130;
    for (var i = 0; i < this.displayData.visit_dates.length; i++) {
        temp_y = temp_y + 20;
        this.svg.append("text")
            .attr('x', x + 20)
            .attr('y', temp_y)
            .html(this.displayData.visit_dates[i].visit_time.getDate() + "/" +
                  (this.displayData.visit_dates[i].visit_time.getMonth() + 1) + "/" +
                   this.displayData.visit_dates[i].visit_time.getFullYear()
                        + " :: " + this.displayData.visit_dates[i].product_count, " item(s)");
    }
};

/**
 * Gets called by event handler
 * @param _client_id
 */
ClientDetailVis.prototype.onSelectionChange= function (_client_id){

    var that = this;

    if (_client_id != null) {
        // highlight client in graph Vis
        d3.select('#graphVis').selectAll('circle').data().forEach(function(item, i) {
            if (item.client_id == _client_id) {

                //console.log(item);
                d3.select(d3.select('#graphVis').selectAll('circle')[0][i])
                    .attr('fill-opacity', 0.9);
            }
        });
        // only update plot when mouse hits a referrer otherwise leave it for inspection
        this.displayData = this.perClientData[parseInt(_client_id)];

        this.updateVis();

    }
    // on mouse-out reset all graph nodes
    else {
        d3.select('#graphVis').selectAll('circle').data().forEach(function (item, i) {
            if (item.client_id != null) {
                d3.select(d3.select('#graphVis').selectAll('circle')[0][i])
                    .attr('fill-opacity', 0.1);
            }
        });
        // on mouseout get rid of current client info
        this.displayData = {product_count: "",
            latitude: "",
            longitude: "",
            city: "",
            client_id: "",
            latitude: "",
            longitude: "",
            product_count: "",
            referrer_code: "",
            visit_dates: []
        };
        this.updateVis();

    }
};






