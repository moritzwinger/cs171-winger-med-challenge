/**
 * MedVis
 */


MedVis = function(_parentElement, _cityData, _clientData, _referrerData, _storeData){
    this.parentElement = _parentElement;
    this.referrerData = _referrerData;
    this.storeData = _storeData;
    this.displayData = [];

    // define all constants here
    this.margin = {top: 20, right: 0, bottom: 30, left: 90},
        this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
        this.height = 400 - this.margin.top - this.margin.bottom;

    this.initVis();

};

/**
 * Method that sets up the SVG and the variables
 */
MedVis.prototype.initVis = function(){
    var that = this;
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.x = d3.scale.linear()
        .range([0, this.width]);

    this.y = d3.scale.linear()
        .range([0, this.height]);

    // modify this to append an svg element, not modify the current placeholder SVG element
    this.svg = this.parentElement.select("svg");

    this.wrangleData();

    this.updateVis();
};


/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
MedVis.prototype.wrangleData= function(_filterFunction){
    this.displayData = this.referrerData;

};

/**
 * the drawing function - should use the D3 selection, enter, exit
 */
MedVis.prototype.updateVis = function(_timeRange) {
    var that = this;

    this.y.domain(d3.extent(this.displayData, function(d) { return d.latitude; }))
                    .range([0, this.height]);
    this.x.domain(d3.extent(this.displayData, function(d) { return d.longitude; }))
                    .range([0, this.width]);

    // graph
    var graph = {nodes: [], links: []};

    graph.nodes = d3.range(this.displayData.length + 1).map(function (d) {
        return {
            city: "",
            latitude: 0,
            longitude: 0
        }
    });
    
    // store is first node
    graph.nodes[0] = this.storeData[0];
    //graph.nodes[0].longitude = this.storeData.longitude;

    graph.nodes.forEach(function (d, i) {
        //console.log(that.displayData[i]);
        graph.nodes[i + 1] = that.displayData[i];
        //graph.links.push({"source": graph.nodes[0], "target": graph.nodes[i]})
    });

    graph.nodes.forEach(function(d, i) {
        graph.links.push({"source": graph.nodes[0], "target": graph.nodes[i]})
    });

    console.log(graph);

};