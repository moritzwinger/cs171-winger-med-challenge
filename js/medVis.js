/**
 * MedVis
 */


MedVis = function(_parentElement, _cityData, _clientData, _perClientData, _referrerData, _storeData){
    this.parentElement = _parentElement;
    this.referrerData = _referrerData;
    this.storeData = _storeData;
    this.displayData = [];
    this.graph = {nodes: [], links: []};

    // define all constants here
    this.margin = {top: 20, right: 0, bottom: 30, left: 20},
        this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
        this.height = 600 - this.margin.top - this.margin.bottom;

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
        .range([20, this.width]);

    this.y = d3.scale.linear()
        .range([20, this.height]);

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
 * the drawing function
 */
MedVis.prototype.updateVis = function() {
    var that = this;

    this.y.domain(d3.extent(this.displayData, function(d) { return d.latitude; }))

   // this.x.domain(d3.extent(this.displayData, function(d) { return d.longitude; }))
    this.x.domain([d3.min(this.displayData, function(d) { return d.longitude; }),
                   d3.max(this.displayData, function(d) { return d.longitude; })])

    this.createGraph();

    // create svg for nodes
    var node = this.svg.selectAll(".node")
        .data(this.graph.nodes)
        .enter()
        .append("g").attr("class", "node");

    // create svg for links
    var link = this.svg.selectAll(".link")
        .data(this.graph.links);

    this.graph.nodes.forEach(function(d, i) {
        d.x =  d.longitude;
        d.y =  d.latitude;
    });

    // connect links using lines
    var lines = link.enter().append("line")
        .attr("class", "link")
        .style("stroke", "gray")
        .attr("opacity", 0.1);

    // draw circles
    node.append("circle")
        .attr("r", function(d) {
            return d.visit_count * 2;
        })
        .attr('fill-opacity', 0.1)
        .on("mouseover", function(d) {
            d3.select(this).attr("fill-opacity", 0.7);
        })
        .on('mouseout', function(d){
            d3.select(this).attr("fill-opacity", 0.1);
        });

    link.transition().duration(500)
        .attr("x1", function(d) { return that.x(d.target.x); })
        .attr("y1", function(d) { return that.y(d.target.y); })
        .attr("x2", function(d) { return that.x(d.source.x); })
        .attr("y2", function(d) { return that.y(d.source.y); });

    node.transition().duration(500)
        .attr("transform", function(d) {
            return "translate("+ that.x(d.x) +","+ that.y(d.y) +")";
        });


    // client circles go here (in red)



};
/**
 * create Graph
 */
MedVis.prototype.createGraph = function() {

    var that = this;

    this.graph.nodes = d3.range(this.displayData.length).map(function (d) {
        return {
            city: "",
            latitude: 0,
            longitude: 0
        }
    });

    // store is first node
    this.graph.nodes[0] = this.storeData[0];

    this.graph.nodes.forEach(function (d, i) {

        if (that.displayData[i].city != "") {
            that.graph.nodes[i + 1] = that.displayData[i];
        }

    });

    this.graph.nodes.forEach(function(d, i) {

        that.graph.links.push({"source": that.graph.nodes[0], "target": that.graph.nodes[i]})
    });
};
