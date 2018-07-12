
  var map;
  var mapObjects = [];

  function loadData(from,to){

    var q = {}; 

    if(from && to){
        q = { from: from, to: to }
    }

    jQuery.get("/api/route", q, function(dataFromDB, status){

      console.log("dataFromDB",dataFromDB);
      cleanMap();
      addLine(dataFromDB);
      var firstItem = dataFromDB[0];
      var lastItem = dataFromDB[dataFromDB.length-1];
      
      addMarker(lastItem,'#START');
      addMarker(firstItem,'#STOP');
    });
  }


  function initMap() {
    document.getElementById('end').valueAsDate = new Date();
    var d = new Date();
    d.setDate(d.getDate() - 7);
    document.getElementById('start').valueAsDate = d;
    
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
    
    loadData(); // it will load last 1000 points 
  } 

  document.getElementById('submit-query').onclick=function() {                // button submit date
    var startDate = new Date(document.getElementById('start').value);
    var endDate = new Date(document.getElementById('end').value);

    if((startDate== 'Invalid Date')||(endDate == 'Invalid Date')||(endDate<startDate)){   // Date validation
      alert('Invalid Date');
    }else{
      loadData(startDate.toISOString(), endDate.toISOString());
    }

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

