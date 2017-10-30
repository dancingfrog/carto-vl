"use strict";

var map = {};

function start() {
    var renderer = new Renderer(document.getElementById('glCanvas'));
    var layer = renderer.addLayer();

    var autoinc = 5;
    //WHERE latin_species LIKE 'Platanus x hispanica'
    // AND ((latin_species LIKE 'Platanus x hispanica') OR (LOWER(latin_species) LIKE 'metrosideros excelsa') OR (latin_species LIKE 'lophostemon confertus'))
    $.getJSON("https://dmanzanares.carto.com/api/v2/sql?q=" + encodeURIComponent("SELECT ST_AsGeoJSON(the_geom_webmercator), temp, DATE_PART('day', date::timestamp-'1912-12-31 01:00:00'::timestamp ) AS diff FROM wwi_ships  WHERE the_geom_webmercator IS NOT NULL  LIMIT 1000000"), function (data) {
        console.log("Downloaded", data);
        var points = new Float32Array(data.rows.length * 2);
        var property0 = new Float32Array(data.rows.length);
        var property1 = new Float32Array(data.rows.length);
        var i = 0;
        data.rows.forEach((e, index) => {
            var point = $.parseJSON(e.st_asgeojson).coordinates;
            points[2 * index + 0] = (point[0])+Math.random()*1000;
            points[2 * index + 1] = (point[1])+Math.random()*1000;
            property0[index] = Number(e.temp);
            property1[index] = Number(e.diff);
        });
        var tile = {
            center: { x: 0, y: 0 },
            scale: 1 / 10000000.,
            count: data.rows.length,
            geom: points,
            properties: {
                'zero': property0,
                'date': property1
            }
        };
        layer.addTile(tile);
        layer.style.setWidth(new Near('date', Date.now() * 0.1 % 4000, 1, 29, 1., 10.), 1000);
    });

    window.onresize = function () { renderer.refresh(); };
    $(window).bind('mousewheel DOMMouseScroll', function (event) {
        if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
            renderer.setZoom(renderer.getZoom() * 0.8);
        } else {
            renderer.setZoom(renderer.getZoom() / 0.8);
        }
    });


    var isDragging = false;
    var draggOffset = {
        x: 0.,
        y: 0.
    };
    document.onmousedown = function (event) {
        isDragging = true;
        draggOffset = {
            x: event.clientX,
            y: event.clientY
        };
    };
    document.onmousemove = function (event) {
        if (isDragging) {
            var c = renderer.getCenter();
            var k = renderer.getZoom() / document.body.clientHeight * 2.;
            c.x += (draggOffset.x - event.clientX) * k;
            c.y += -(draggOffset.y - event.clientY) * k;
            renderer.setCenter(c.x, c.y);
            draggOffset = {
                x: event.clientX,
                y: event.clientY
            };
        }
    };
    layer.style.getColor().blendTo(new ContinuousRampColor('p0', 5, 30, ['#008080','#70a494','#b4c8a8','#f6edbd','#edbb8a','#de8a5a','#ca562c']), 1000);
    layer.style.getWidth().blendTo(3., 1000);

    document.onkeypress = function (event) {
        const ramp = new DiscreteRampColor('latin_species',
            ["Lophostemon confertus", "Platanus x hispanica", "Metrosideros excelsa"].map(str => {
                return map[str.toLowerCase()];
            }),
            [[1, 0, 0, 1], [0, 1, 0, 1], [0, 0, 1, 1]], [0, 0, 0, 1]);
        const yellow = new UniformColor([1, 1, 0, 1]);
        const red = new UniformColor([1, 0, 0, 1]);
        //layer.style.setColor(new ColorBlend(yellow, ramp, "500ms"));
        if (Math.random() > 0.5) {
            //layer.style.getColor().blendTo(ramp, 1000);
            //layer.style.getColor().blendTo(new ContinuousRampColor('p0', 0, 35, ['#3d5941', '#778868', '#b5b991', '#f6edbd', '#edbb8a', '#de8a5a', '#ca562c']), 1000);
        } else {
            //layer.style.getColor().blendTo(new UniformColor([Math.random(), Math.random(), Math.random(), 0.4]), 1000);
            //layer.style.getColor().blendTo(new ContinuousRampColor('p0', 0, 35, ['#009392', '#39b185', '#9ccb86', '#e9e29c', '#eeb479', '#e88471', '#cf597e']), 1000);
        }
        //        layer.style.getWidth().center=Math.random()*4000.;
        //layer.style.getWidth().notify();
        layer.style.getWidth().blendTo(0. + 1. * 15. * Math.random(), 1000);
        //layer.style.getWidth().blendTo(8. * Math.random(), 1400);
    }
    document.onmouseup = function () {
        isDragging = false;
    };
}
