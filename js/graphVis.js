/**
 * GraphVis
 *
 * creates the graph visualization
 */


GraphVis = function(_parentElement, _cityData, _clientData, _perClientData, _referrerData, _storeData){
    this.parentElement = _parentElement;
    this.referrerData = _referrerData;
    this.storeData = _storeData;
    this.displayReferrerData = [];
    this.displayPerClientData= _perClientData;

    this.referrerGraph = {nodes: [], links: []};
    this.clientGraph = {nodes: [], links: []};

   // this.referrerNode;

    // define all constants here
    this.margin = {top: 20, right: 30, bottom: 170, left: 20},
        this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
        this.height = 600 - this.margin.top - this.margin.bottom;

    this.initVis();

};

/**
 * Method that sets up the SVG and the variables
 */
GraphVis.prototype.initVis = function(){
    var that = this;
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.x = d3.scale.linear()
        .range([this.width, 20]);

    this.y = d3.scale.linear()
        .range([this.height, 20]);

    // modify this to append an svg element, not modify the current placeholder SVG element
    this.svg = this.parentElement.select("svg");

    this.wrangleData();

    this.updateVis();
};


/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
GraphVis.prototype.wrangleData= function(){
    this.displayReferrerData = this.referrerData;

};

/**
 * the drawing function
 */
GraphVis.prototype.updateVis = function() {
    var that = this;

    this.y.domain(d3.extent(this.displayReferrerData, function(d) { return d.latitude; }))

    // this.x.domain(d3.extent(this.displayReferrerData, function(d) { return d.longitude; }))
    this.x.domain([d3.min(this.displayReferrerData, function(d) { return d.longitude; }),
        d3.max(this.displayReferrerData, function(d) { return d.longitude; })])

    // create the referrer and client graphs
    this.createReferrerGraph();
    this.createClientGraph();

    // client circles and lines go here (in red)

    this.clientNode = this.svg.selectAll(".clientNode")
        .data(this.clientGraph.nodes)
        .enter()
        .append("g").attr("class", "node");

    // create svg for links
    var clientLink = this.svg.selectAll(".clientLink")
        .data(this.clientGraph.links);

    this.clientGraph.nodes.forEach(function(d, i) {
        d.x =  d.longitude;
        d.y =  d.latitude;
    });

    // connect links using lines
    var clientLines = clientLink.enter().append("line")
        .attr("class", "link")

    // draw circles
    this.clientNode.append("circle")
        .attr("r", function(d) {
            return d.product_count * 2;
        })
        .attr("fill", "red")
        .attr('fill-opacity', 0.1);


    clientLink.transition().duration(500)
        .attr("x1", function(d) { return that.x(d.target.longitude); })
        .attr("y1", function(d) { return that.y(d.target.latitude); })
        .attr("x2", function(d) { return that.x(d.source.x); })
        .attr("y2", function(d) { return that.y(d.source.y); });

    this.clientNode.transition().duration(500)
        .attr("transform", function(d) {
            return "translate("+ that.x(d.x) +","+ that.y(d.y) +")";
        });


    // create svg for nodes
    this.referrerNode = this.svg.selectAll(".referrerNode")
        .data(this.referrerGraph.nodes)
        .enter()
        .append("g").attr("class", "node");

    // create svg for links
    var referrerLink = this.svg.selectAll(".referrerLink")
        .data(this.referrerGraph.links);

    this.referrerGraph.nodes.forEach(function(d, i) {
        d.x =  d.longitude;
        d.y =  d.latitude;
    });

    // connect links using lines
    var referrerLines = referrerLink.enter().append("line")
        .attr("class", "link")
        .style("stroke", "gray")
        .attr("opacity", 0.2);

    // draw circles
    this.referrerNode.append("circle")
        .attr("r", function(d) {
            return d.visit_count * 1.5;
        })
        .attr('fill-opacity', 0.2)
        .on("mouseover", function(d) {
            d3.select(this).attr("fill-opacity", 0.7);
            // highlight client circles if they are related to the source
            that.clientNode.each(function(item) {
                if (d.referrer_code == item.referrer_code) {
                    d3.select(this).selectAll("circle")
                        .attr('fill-opacity', 0.9);
                }
            });
        })
        .on('mouseout', function(d){
            d3.select(this).attr("fill-opacity", 0.1);
            that.clientNode.each(function() {
                    d3.select(this).selectAll("circle")
                        .attr('fill-opacity', 0.1);

            });
        });

    referrerLink.transition().duration(500)
        .attr("x1", function(d) { return that.x(d.target.x); })
        .attr("y1", function(d) { return that.y(d.target.y); })
        .attr("x2", function(d) { return that.x(d.source.x); })
        .attr("y2", function(d) { return that.y(d.source.y); });

    this.referrerNode.transition().duration(500)
        .attr("transform", function(d) {
            return "translate("+ that.x(d.x) +","+ that.y(d.y) +")";
        });




};
/**
 * create referrer Graph
 */
GraphVis.prototype.createReferrerGraph = function() {

    var that = this;

    this.referrerGraph.nodes = d3.range(this.displayReferrerData.length).map(function (d) {
        return {
            city: "",
            latitude: 0,
            longitude: 0
        }
    });

    // store is first node
    this.referrerGraph.nodes[0] = this.storeData[0];

    this.referrerGraph.nodes.forEach(function (d, i) {
            that.referrerGraph.nodes[i + 1] = that.displayReferrerData[i];
    });

    this.referrerGraph.nodes.forEach(function(d, i) {
        // no link to store if Walk IN etc.
        if (i > 44) {
            that.referrerGraph.links.push({"source": that.referrerGraph.nodes[i],
                "target": that.referrerGraph.nodes[i]});
        } else {
            that.referrerGraph.links.push({"source": that.referrerGraph.nodes[0],
                "target": that.referrerGraph.nodes[i]});
        }
    });
};

/**
 * create clients Graph
 */
GraphVis.prototype.createClientGraph = function() {
    var that = this;

    this.clientGraph.nodes = d3.range(this.displayPerClientData.length).map(function (d) {
        return {
            city: "",
            latitude: 0,
            longitude: 0,
            product_count: 0,
            referrer_code: ""
        }
    });

    // fill up nodes from 1 to 351
    this.clientGraph.nodes.forEach(function (d, i) {
        that.clientGraph.nodes[i] = that.displayPerClientData[i];
    });

    // keep index 0 out of the game for links... rmemeber index by client_id starts with 1
    that.clientGraph.links.push({"source": that.clientGraph.nodes[0],
        "target": that.clientGraph.nodes[0]});

    // create a link to the referrer, atm. to itsself if referrer is walk in etc...
    this.clientGraph.nodes.forEach(function(d, i) {
        var searchTerm = d.referrer_code;
        var index = -1;

        for(var i = 0, len = that.displayReferrerData.length; i < len; i++) {
            if (that.displayReferrerData[i].referrer_code === searchTerm) {
                index = i;
                break;
            }
        }

        if (index != -1) {
            that.clientGraph.links.push({"source": that.clientGraph.nodes[i],
                "target": that.displayReferrerData[index]})
        }
        else {
            that.clientGraph.links.push({"source": that.clientGraph.nodes[i],
                "target": that.clientGraph.nodes[i]})
        }
    });
};

/**
 * Gets called by event handler
 *
 */
GraphVis.prototype.onSelectionChange= function (referrer_code){

    var that = this;

    if (referrer_code != null) {
       // this.svg.selectAll("circle").data().forEach(function(item) {
        this.referrerNode.each(function(d) {
            if (d.referrer_code == referrer_code) {
                d3.select(this).selectAll("circle")
                    .attr('fill-opacity', 0.7);
            }
            that.clientNode.each(function(item) {
                if (referrer_code == item.referrer_code) {
                    d3.select(this).selectAll("circle")
                        .attr('fill-opacity', 0.9);
                }
            });
        })
    } else {
        this.referrerNode.each(function() {
            d3.select(this).selectAll("circle")
                .attr('fill-opacity', 0.1);
        });
        that.clientNode.each(function(item) {
                d3.select(this).selectAll("circle")
                    .attr('fill-opacity', 0.1);
        });
    }



};
