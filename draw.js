
define(['graph'], function(g) {
    return {
        createGraphDrawer: createGraphDrawer
    }

    function createGraphDrawer(nodes, canvas, width, height) {

        // need to be able to map easily between nodes and circles
        // also between edges and lines
        var _width=width,
            _height=height,
            _r = canvas,
            _circles = [],
            _nodeToCircle = {},
            _circleToNode = {},
            _edgesToLines = {},
            that;

        that = {
            nodes: nodes || [],
            draw: function() {
                var angle = 0,
                    edgesDrawn = {};

                _r.clear();

                // draw nodes
                $.each(that.nodes, function(i,n) {
                    var c = Raphael.getColor(),
                        t = "r" + angle + " " + _width/2 + " " + _height/2,
                        circle;

                    // draw circle for node
                    circle = _r.circle(320, 450, 10).attr({transform: t, "fill-opacity": .4});
                    _r.text(320,450,n.name).attr({stroke: c, fill: c, transform: t, "fill-opacity": .4});

                    // save circle reference, and map so that lookups
                    // are easy
                    _circles.push(circle);
                    _nodeToCircle[n] = circle;
                    _circleToNode[circle] = n;

                    // increment length the appropriate amount
                    angle = angle + (360 / nodes.length);
                });

                // draw edges
                $.each(nodes, function(i,n) {
                    $.each(n.children, function(j,c) {
                        var edge = g.createEdge(n,c),
                            c1 = _nodeToCircle[n],
                            bb1 = c1.getBBox(),
                            x1 = bb1.x + bb1.width/2,
                            y1 = bb1.y + bb1.height/2,
                            c2 = _nodeToCircle[c],
                            bb2 = c2.getBBox(),
                            x2 = bb2.x + bb2.width/2,
                            y2 = bb2.y + bb2.height/2,
                            line;

                        // do not draw an edge twice!
                        if (!edgesDrawn[edge]) {
                            line = _r.path("M" + x1 + "," + y1 + 
                                    "L" + x2 + "," + y2);

                            edgesDrawn[edge] = true;

                            // remember lines for future reference
                            _edgesToLines[edge] = line;
                        }
                    });
                });
            },
            highlightPath: function(path) {
                var edges = path.getEdges();

                $.each(edges, function(i,edge) {
                    var line = _edgesToLines[edge];
                    if (line) {
                        line.attr({ stroke: Raphael.color("red"), "stroke-width": 3 });
                    }

                });

            }
        }

        return that;
    };
});
