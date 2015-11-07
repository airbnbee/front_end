/*jslint browser: true*/
/*global L, console, $, TweenMax, Back, Strong*/

function showInstructions() {
    "use strict";
    TweenMax.fromTo(".instructions", 0.3, {autoAlpha: 0, bottom: "-100px"}, {autoAlpha: 1, bottom: "0px", ease: Strong.easeOut});
}

function onRedClick() {
    "use strict";
    TweenMax.to(".credits", 0.1, {autoAlpha: 0, top: "-20px"});
    TweenMax.to(".start-btn", 0.1, {autoAlpha: 0, top: "-20px"});
    TweenMax.to(".tagline", 0.1, {autoAlpha: 0, top: "-20px", delay: 0.1});
    TweenMax.to(".logo", 0.1, {autoAlpha: 0, top: "-20px", delay: 0.1});
    TweenMax.to(".overlay", 0.1, {autoAlpha: 0, delay: 0.7});

    TweenMax.to(".intro", 0.35, {width: "5%", height : "5%", ease: Back.easeOut, delay: 0.4});
    TweenMax.to(".intro", 0.35, {autoAlpha: 0, delay: 0.6, onComplete: showInstructions});
}

function hideInstructions() {
    "use strict";
    TweenMax.to(".instructions", 0.3, {autoAlpha: 0, ease: Strong.easeIn});
}

function showResults() {
    "use strict";
    TweenMax.fromTo(".results-tab", 0.3, {autoAlpha: 0, right: "-500px"}, {autoAlpha: 1, right: "0px", ease: Strong.easeOut});
}

var values = ['0', '1', '2', '3', '4', '5'];
var tiles = [
    'Not suitable for bees!',
    'Not suitable for bees!',
    'Poor bee spot!',
    'Ok for bees!',
    'Sweet spot for bees!',
    'Bees will love this!'
];
var classes = [
    'one',
    'one',
    'two',
    'three',
    'four',
    'five'
];



L.mapbox.accessToken =
    'pk.eyJ1IjoiYWlyYm5iZWUiLCJhIjoiY2lnb2RqdmM3MDAybHVja295OHlvdzFyMyJ9.Rso6y4hksAW_qmS-_O_ung';

var marker = L.marker([0.0, 0.0], {
    icon: L.mapbox.marker.icon({
        'marker-color': 'ff8888'
    })//,
//    draggable: true
});

function displayResult(r) {
    "use strict";
    // result = rating: int, cons: String[], pros: String[], point: double[2]
    $('#rating-value').html(values[r.rating] + ' <img src="img/star.svg" alt="stars">').removeClass().addClass('sym ' + classes[r.rating]);
    $('#rating-title').html(tiles[r.rating]);
    $('#ratings').removeClass().addClass('rating ' + classes[r.rating]);
    
    var c = $('#comments');
    r.pros.forEach(function (str) {
        c.html("<li><img src='img/checkmark.svg' alt='checkmark' class='icon-checkmark'> " + str + "</li>");
    });
    
    showResults();
}

function requestEvaluation(latLng) {
    "use strict";
    $.post('https://lmq0hho3q5.execute-api.us-east-1.amazonaws.com/beta/rate-point',
        JSON.stringify(latLng)
        ).done(function (response) {
        displayResult(response);
    });
}

function onMapClick() {
    "use strict";
    console.log("onMapClick()");
}

var map = L.mapbox.map('map', 'airbnbee.2f297ded', {
    scrollWheelZoom: false
}).setView([-41.290852, 174.753433], 16)
    .addControl(L.mapbox.geocoderControl('mapbox.places', {
        autocomplete: true
    }));

map.on('click', function (e) {
    "use strict";
    marker.setLatLng(e.latlng);
    marker.bindPopup('This marker is draggable! Move it around.');
    marker.addTo(map);
    requestEvaluation(e.latlng);
});
//map.on('dragend', function (e) {
//    "use strict";
//    requestEvaluation(marker.getLatLng());
//});

//var geojson = { type: 'LineString', coordinates: [
//    [-35.226488, 173.553415],
//    [-38.316518, 175.648065],
//    [-39.460550, 175.691010],
//    [-45.798172, 168.269557]
//]};
//
//var j = 0;
//var direction = 1;
//var animate = true;
//function tick() {
//    "use strict";
//    // Set the marker to be at the same point as one
//    // of the segments or the line.
//    marker.setLatLng(L.latLng(
//        geojson.coordinates[j][1],
//        geojson.coordinates[j][0]
//    ));
//
//    // Move to the next point of the line
//    // until `j` reaches the length of the array.
//    if ((j += 1) < geojson.coordinates.length)
//        setTimeout (tick, 100);
//}