var map;
var mapObjects = [];

function toInterval(speed) {
    return Math.ceil(speed / 10) * 10;
}

function calculatePercent(input, max) {
    var min = 0;
    var range = max - min;
    var correctedStartValue = input - min;
    return (correctedStartValue * 100) / range;
}

function getGreenToRed(speed) {
    speed = toInterval(speed);
    var percent = calculatePercent(speed, 170);
    r = percent < 50 ? 255 : Math.floor(255 - (percent * 2 - 100) * 255 / 100);
    g = percent > 50 ? 255 : Math.floor((percent * 2) * 255 / 100);
    return 'rgb(' + g + ',' + r + ',0)';
}


function initMap() {
    document.getElementById('end').valueAsDate = new Date();
    var dStart = new Date();
    dStart.setDate(dStart.getDate());
    document.getElementById('start').valueAsDate = dStart;

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: {lat: 49.328434, lng: 31.561580},

        mapTypeControl: true,                                       // moove google bar buttons
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.BOTTOM_CENTER
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_BOTTOM
        },
        fullscreenControl: false
    });

    // Add a listener for the click event
    //map.addListener('click', addLatLng);

    loadData({cb: visualizeData}); // it will load last 1000 points
}

document.getElementById('submit-query').onclick = function() {                // button submit date
    var startDate = new Date(document.getElementById('start').value);
    var endDate = new Date(document.getElementById('end').value);
    if ((startDate == 'Invalid Date') || (endDate == 'Invalid Date') || (endDate < startDate)) {   // Date validation
        alert('Invalid Date');
    } else {
        endDate.setUTCHours(23);    //corection calendar date object
        endDate.setMinutes(59);
        endDate.setSeconds(59);
        loadData({from: startDate.toISOString(), to: endDate.toISOString(), cb: visualizeData});
    }
}

function getPolyLineLenght(polyLine) {
    return google.maps.geometry.spherical.computeLength(polyLine.getPath().getArray());
}

function fitMapPoints(forZoomPoints) {
    var bounds = new google.maps.LatLngBounds();

    forZoomPoints.forEach((forZoomPoint) => {
        bounds.extend(forZoomPoint);
    });

    map.fitBounds(bounds);
}

function haversine_distance(position1, position2) {
    var R = 3958.8; // Radius of the Earth in miles
    var rlat1 = position1.lat() * (Math.PI / 180); // Convert degrees to radians
    var rlat2 = position2.lat() * (Math.PI / 180); // Convert degrees to radians
    var difflat = rlat2 - rlat1; // Radian difference (latitudes)
    var difflon = (position2.lng() - position1.lng()) * (Math.PI / 180); // Radian difference (longitudes)

    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
    return d;
}

function visualizeData(points) {

    points = points.reverse();    //array comming from last to fresh value
    // console.log("points",points);
    cleanMap();

    if (points.length == 0) return;


    var prevPoint = points[0];
    var prevSpeed = toInterval(points[0].speed);
    var newPoints = [prevPoint];
    var fullPolyLineLength = 0;
    var speedObj = {
        'max': 0,
        'min': 500,
        'interval': 0,
        'time': null,
        'direction': null
    };
    for (let i = 1; i < points.length; i++) {

        var speed = toInterval(points[i].speed);
        var from = new Date(prevPoint.trackerTime);
        var to = new Date(points[i].trackerTime);
        var seconds = (to.getTime() - from.getTime()) / 1000;
        if (seconds < 2) {
            prevPoint = points[i];
            continue;
        }

        speedObj.interval = speed;

        if (speedObj.max < points[i].speed) {
            speedObj.max = points[i].speed;
        }

        if (speedObj.min > points[i].speed) {
            speedObj.min = points[i].speed;
        }


        if (seconds < 15) {

            // var dist = haversine_distance(new google.maps.LatLng(prevPoint.lat, prevPoint.lng), new google.maps.LatLng(points[i].lat, points[i].lng))
            // console.log(seconds / dist, dist, seconds);
        }

        if (speed != prevSpeed) {
            speedObj.interval = speed;
            newPoints.push(points[i])

            speedObj.direction = points[i].direction;
            speedObj.time = points[i].trackerTime;
            let polyLineObgect = addLine(newPoints, speedObj);
            fullPolyLineLength += getPolyLineLenght(polyLineObgect);

            // if (seconds > 7200) {
            //     newPoints = [];
            // } else {
            newPoints = [points[i]];
            // }


            speedObj = {
                'max': 0,
                'min': 500,
                'interval': 0,
                'time': null,
                'direction': null
            };
        } else {
            newPoints.push(points[i])
        }
        prevSpeed = speed;
        prevPoint = points[i];
    }

    document.getElementById("path-value").innerHTML = parseInt(fullPolyLineLength) / 1000;   //  parseInt(polyLineLength)/1000 for indication in km
    var startItem = points[0];
    var stopItem = points[points.length - 1];
    fitMapPoints(points);   // fit map to points
    addMarker(startItem, '#START');
    addMarker(stopItem, '#STOP');
}

function loadData(optoins) {

    var q = {};

    if (optoins.from && optoins.to) {
        q = {from: optoins.from, to: optoins.to};
    }

    jQuery.get("/api/route", q, optoins.cb);
}

// Adds a marker to the map and push to the array.
function addMarker(location, tag) {
    var marker = new google.maps.Marker({
        position: location,
        title: tag,
        map: map
    });
    mapObjects.push(marker)
}

var lineSymbol = {
    path: "M 0,-1 0,1",
    strokeOpacity: 1,
    scale: 4
};

// Adds a polyline to the map and push to the array.
function addLine(points, speed) {

    var path = [];
    var line = new google.maps.Polyline({
        path: points,
        geodesic: false,
        strokeColor: 'black',
        strokeOpacity: 1.0,
        map: map,
        strokeWeight: 4
    });
    mapObjects.push(line);

    var tripPath = new google.maps.Polyline({
        path: points,
        geodesic: false,
        strokeColor: getGreenToRed(speed.interval),
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map,
        icons: [{
            // icon: {path: google.maps.SymbolPath.FORWARD_OPEN_ARROW},
            // icon: lineSymbol,
            offset: `100%`,
            repeat: '150px'
        }]
    });


    tripPath.addListener('click', function(e) {
        var infowindow = new google.maps.InfoWindow({
            content: speed.min + "-" + speed.max + 'km/h<br>' + speed.direction + '<br>' + speed.time
        });
        infowindow.open(map);
        infowindow.setPosition(e.latLng);
    });

    mapObjects.push(tripPath);
    return tripPath;// return polyline
}

// Removes the objects from the map, but keeps them in the array.
function cleanMap() {
    mapObjects.forEach(function(item) {
        item.setMap(null);
    });
    mapObjects = [];
}

// Handles click events on a map, and adds a new point to the Polyline.
function addLatLng(event) {
    // var path = poly.getPath();

    // // Because path is an MVCArray, we can simply append a new coordinate
    // // and it will automatically appear.
    // console.log("event.latLng",event.latLng)
    // path.push(event.latLng);

    // // Add a new marker at the new plotted point on the polyline.
    // var marker = new google.maps.Marker({
    //   position: event.latLng,
    //   title: '#' + path.getLength(),
    //   map: map
    // });
}


