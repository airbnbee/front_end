/*jslint browser: true*/
/*global L, console, $, TweenMax, Back, Strong, TimelineMax, Sine*/

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

function showLoader() {
    "use strict";
    TweenMax.fromTo(".loader", 0.3, {autoAlpha: 0, width: "0px", height: "0px", rotation: "-30"}, {autoAlpha: 1, width: "40px", height: "45px", rotation: "0", ease: Strong.easeOut});

    //var beeTime = new TimelineMax({repeat:6, yoyo:true, onComplete: hideLoader});
    var beeTime = new TimelineMax({repeat: -1, yoyo: true});

    beeTime.add(TweenMax.fromTo(".bee", 0.5, {top: "25px", rotation: "-8"}, {top: "20px", rotation: "0", ease: Sine.easeInOut}));

}

function showResults() {
    "use strict";
    TweenMax.fromTo(".results-tab", 0.3, {autoAlpha: 0, right: "-500px"}, {autoAlpha: 1, right: "0px", ease: Strong.easeOut});
}

function hideLoader() {
    "use strict";
    TweenMax.fromTo(".loader", 0.3, {autoAlpha: 1, width: "40px", height: "45px", rotation: "0"}, {autoAlpha: 0, width: "0px", height: "0px", rotation: "-30", ease: Strong.easeIn, onComplete: showResults});
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
    var rating = r.rating || 4;
    $('#rating-value').html(values[rating] + ' <img src="img/star.svg" alt="stars">').removeClass().addClass('sym ' + classes[rating]);
    $('#rating-title').html(tiles[rating]);
    $('#ratings').removeClass().addClass('rating ' + classes[rating]);
    
    var comments = r.pros || [];
    var html = '';
    comments.forEach(function (str) {
        html += "<li><img src='img/checkmark.svg' alt='checkmark' class='icon-checkmark'> " + str + "</li>";
    });
    if (html.length > 0) {
        $('#comments').html(html);
    }
    
    hideLoader();
    showResults();
}

function requestEvaluation(latLng) {
    "use strict";
    $.post('https://lmq0hho3q5.execute-api.us-east-1.amazonaws.com/beta/rate-point',
        JSON.stringify(latLng)
        ).done(function (response) {
        console.log(response);
        displayResult(response);
    });
    
//    showLoader();
}

function onMapClick() {
    "use strict";
    console.log("onMapClick()");
}

var map = L.mapbox.map('map', 'airbnbee.2f297ded', {
    scrollWheelZoom: true
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