
define(function() {
    "use strict";

    return {
        createNode: createNode,
        createPath: createPath,
        createEdge: createEdge,
        allPaths: allPaths,
        shortestPaths: shortestPaths,
        randomizeGraph: randomizeGraph
    };

    function createNode(name, children) {
        var _name = name || '',
            _children = children || [],
            that = {
                name: _name,
                children: _children,
                hasChild: function(c) {
                    return that.children.indexOf(c) !== -1;
                },
                add: function(c) {
                    // edges need to be bi-directional, so add to
                    // children too
                    if (!that.hasChild(c)) {
                        that.children.push(c);
                    }
                    if (!c.hasChild(that)) {
                        c.children.push(that);
                    }
                },
                toString: function() { return _name; }
            };

        $.each(that.children, function(i,c) {
            that.add(c);
        });

        return that;
    };

    /**
    createPath - immutable path data structure.
    `add` does not modify the current instance, it 
    returns a new instance with the new node added
    */
    function createPath(arr) {
        var _arr = arr || [];

        return {
            contains: function (node) {
                return _arr.indexOf(node) !== -1;
            },
            add: function (node) {
                // copy path array, add new node, return new path
                var a = _arr.slice(0);
                a.push(node);
                return createPath(a);
            },
            toArr: function () {
                return _arr.slice(0);
            },
            getEdges: function() {
                /*
                  * return an explicit representation of the edges in the path
                  */
                var i, edges = [];
                for (i=1; i < _arr.length; i++) {
                    edges.push( createEdge(_arr[i-1], _arr[i]) );
                }

                return edges;
            },
            getLength: function() {
                return _arr.length;
            },
            toString: function() {
                var i,
                    s = '';
                if (_arr.length > 0) {
                    s = _arr[0].name;
                }
                for(i=1; i < _arr.length; i++) {
                    s = s + "&rarr;" + _arr[i].name;
                }

                return s;
            }
        };
    }

    function createEdge(n1, n2) {
        var that = {
            node1: n1,
            node2: n2,
            toString: function() {
                // need to order the edges for reliable
                // comparison
                if (n1 < n2) {
                    return "(" + n1.toString() + "," + n2.toString() + ")";
                }
                else {
                    return "(" + n2.toString() + "," + n1.toString() + ")";
                }
            }
        };


        return that;
    }

    function allPaths(node, dest) {

        var paths = [];
        _allPaths(node, dest, createPath());
        return paths;

        function _allPaths(node, dest, path) {
            var i, newPath;

            // abort traversal if we're in a loop
            if (path.contains(node)) {
                return;
            }

            newPath = path.add(node);
            if (node === dest) {
                // abort traversal and return the 
                paths.push(newPath);
                return;
            }

            for (i = 0; i < node.children.length; i++) {
                _allPaths(node.children[i], dest, newPath);
            }
        }
    }

    function shortestPaths(node, dest) {
        var paths = [],
            visitedEdges = {},
            min = Infinity,
            ap = allPaths(node, dest);

        $.each(ap, function(i,path) {

            if (path.getLength() < min) {
                // we found a new minimum path length,
                // so start over
                paths = [path];
                visitedEdges = {};
                markEdges(path);
                min = path.getLength();
            }
            else if (path.getLength() === min) {
                // we found a new path with the minimum
                // length. Add it if it does not have
                // any edges in common with existing
                //shortest paths
                if (!hasVisitedEdges(path)) {
                    paths.push(path);
                    markEdges(path);
                }
            }
        });

        return paths;

        /* private helper functions */
        function markEdges(path) {
            var i,
                edges = path.getEdges();

            $.each(edges, function(i, edge) {
                visitedEdges[edge] = true;
            });
        }
        function hasVisitedEdges(path) {
            var edges = path.getEdges();

            return edges.some(function(edge) {
                return visitedEdges[edge];
            });
        }
    }

    /**
      create random edges among a list of edges,
      creating an edge between any two nodes 
      with probability p
    */
    function randomizeGraph(p, nodeArr) {

        // start fresh
        $.each(nodeArr, function(i,n) {
            n.children = [];
        });

        // add edges randomly
        $.each(nodeArr, function(i,n) {
            var j;
            for(j=i+1; j < nodeArr.length; j++) {
                if (Math.random() < p) {
                    n.add(nodeArr[j]);
                }
            }
        });
    }

});
