
  var map;
  var mapObjects = [];

  function initMap() {
    document.getElementById('end').valueAsDate = new Date();;
    var dStart = new Date();
    dStart.setDate(dStart.getDate() - 7);
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
    
    loadData({cb:visualizeData}); // it will load last 1000 points 
  } 

  document.getElementById('submit-query').onclick=function() {                // button submit date
    var startDate = new Date(document.getElementById('start').value);
    var endDate = new Date(document.getElementById('end').value);

    if((startDate== 'Invalid Date')||(endDate == 'Invalid Date')||(endDate<startDate)){   // Date validation
      alert('Invalid Date');
    }else{
      
      endDate.setUTCHours(23);    //corection calendar date object
      endDate.setMinutes(59);
      endDate.setSeconds(59);
      loadData({from:startDate.toISOString(), to:endDate.toISOString(), cb:visualizeData});
    }

  }

  function getPolyLineLenght(){
    
  }

  function zoomToPoints(forZoomPoints){
    var bounds = new google.maps.LatLngBounds();
    
    forZoomPoints.forEach((forZoomPoint)=>{
      bounds.extend(forZoomPoint);
    });
    
    map.fitBounds(bounds);
  }

  function visualizeData(points){
    console.log("points",points);
    cleanMap();

    if(points.length == 0) return;

    var polyLineLength = addLine(points);
    var stopItem = points[0];
    var startItem = points[points.length-1];
    
    console.log("polyLineLength", polyLineLength);

    zoomToPoints(points);

    addMarker(startItem,'#START');
    addMarker(stopItem,'#STOP');
  }

  function loadData(optoins){

    var q = {}; 

    if(optoins.from && optoins.to){
        q = { from: optoins.from, to: optoins.to };
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

  // Adds a polyline to the map and push to the array.
  function addLine(points) {

   var path = [];
   var tripPath = new google.maps.Polyline({
      path: points,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,  
      map:map
    });

    mapObjects.push(tripPath)

    tripPath.setMap(map);
    return google.maps.geometry.spherical.computeLength(tripPath.getPath().getArray()); // return polyline length in meters
  }

  // Removes the objects from the map, but keeps them in the array.
  function cleanMap(){
    mapObjects.forEach(function(item){
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
