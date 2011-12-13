
define(['graph', 'draw'], function(g, d) {

    /*
    QUnit tests
    http://docs.jquery.com/QUnit
    */
    test("createNode should assign node name", function() {
        var n = g.createNode("foo");

        equal(n.name, "foo");
    });
    test("randomizeGraph creates no edges for p=0", function() {

        var na = [
                g.createNode("s"),
                g.createNode("d"),
                g.createNode("1"),
                g.createNode("2"),
                g.createNode("3"),
                g.createNode("4"),
                g.createNode("5"),
                g.createNode("6"),
            ];
            
            g.randomizeGraph(0, na);

            $.each(na, function(i,n) {
                equal(0, n.children.length);
            });

    });
    test("randomizeGraph creates fully connected graph for p=1", function() {
        var na = [
                g.createNode("s"),
                g.createNode("d"),
                g.createNode("1"),
                g.createNode("2"),
                g.createNode("3"),
                g.createNode("4"),
                g.createNode("5"),
                g.createNode("6"),
            ];
            
            g.randomizeGraph(1, na);

            $.each(na, function(i,n) {
                equal(na.length-1, n.children.length);
            });

    });
    test("allPaths should return single node if src and dest are equal", function () {
        var n = g.createNode("s"),
            paths;

        paths = g.allPaths(n, n);

        equal(paths.length, 1);
        equal(paths[0].toArr().length, 1);
        equal(paths[0].toArr()[0].name, "s");
    });
    test("allPaths should return empty array if no path from src to dest", function() {

        var d = g.createNode("d"),
            n = g.createNode("s", [
                  g.createNode("1"),
                  g.createNode("2"),
                  g.createNode("3"),
                ]),
            paths;

        paths = g.allPaths(n, d);

        equal(paths.length, 0);
    });
    test("allPaths handles loops correctly", function() {

        var d = g.createNode("d"),
            n = g.createNode("s", [
                  g.createNode("1", [
                    g.createNode("3", [d])
                  ]),
                  g.createNode("2", [
                    g.createNode("4", [d])
                  ]),
                ]),
            paths;

        // add cycles: 3-2
        n.children[0].children[0].add(
          n.children[1]
        );

        paths = g.allPaths(n, d);

        // correct # paths?
        equal(paths.length, 4);

        // each path starts with 'n' and ends with 'd'?
        $.each(paths, function(i,p) {
            equal('s', p.toArr()[0].name);
            equal('d', p.toArr()[ p.toArr().length-1 ].name);
        });
    });
    test("allPaths is symmetric", function() {
        var d = g.createNode("d"),
            n = g.createNode("s", [
                  g.createNode("1", [
                    g.createNode("3", [d])
                  ]),
                  g.createNode("2", [
                    g.createNode("4", [d])
                  ]),
                ]);

        // add cycles: 3-2
        n.children[0].children[0].add(
          n.children[1]
        );

        var paths1 = g.allPaths(n, d);
        var paths2 = g.allPaths(d, n);

        equal(paths1.length, paths2.length);

    });
    test("shortPaths does not include duplicate edges", function() {
        var d = g.createNode("d"),
            n = g.createNode("s", [
                  g.createNode("1", [
                    g.createNode("2", [d]),
                    g.createNode("3", [d])
                  ])
                ]);

        var sp = g.shortestPaths(n,d);

        equal(1, sp.length);

    });

});
