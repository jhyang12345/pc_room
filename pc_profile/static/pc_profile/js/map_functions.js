// 9:14 marker image ratio
const blueMarkerImage = {
  url: '/static/pc_profile/images/marker_blue.png',
  size: new google.maps.Size(90, 140),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(14, 42),
  scaledSize: new google.maps.Size(27, 42)
};

const greenMarkerImage = {
  url: '/static/pc_profile/images/marker_green.png',
  size: new google.maps.Size(90, 140),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(14, 42),
  scaledSize: new google.maps.Size(27, 42)
};

const orangeMarkerImage = {
  url: '/static/pc_profile/images/marker_orange.png',
  size: new google.maps.Size(90, 140),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(14, 42),
  scaledSize: new google.maps.Size(27, 42)
};

const redMarkerImage = {
  url: '/static/pc_profile/images/marker_red.png',
  size: new google.maps.Size(90, 140),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(14, 42),
  scaledSize: new google.maps.Size(27, 42)
};

const myLocationClear = {
  url: '/static/pc_profile/images/my_location_clear.png',
  size: new google.maps.Size(90, 140),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(14, 42),
  scaledSize: new google.maps.Size(27, 42)
};

const myLocationBold = {
  url: '/static/pc_profile/images/my_location_bold.png',
  size: new google.maps.Size(90, 140),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(9, 28),
  scaledSize: new google.maps.Size(18, 28)
};

function initializeMap(mapHolder) {
  var map = new google.maps.Map(mapHolder, {
    center: {lat: 37.561225, lng: 127.035503},
    zoom: 15,
    zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_BOTTOM
    },
    streetViewControlOptions: {
      position: google.maps.ControlPosition.LEFT_BOTTOM
    },
    disableDefaultUI: true,
    gestureHandling: "greedy"
  });

  pageObject.map = map;

  getLocation(map);

  if(typeof(mapMarkerList) != "undefined") {
    for(const marker of mapMarkerList) {
      addActualMarker(marker, map);
    }
  }

  // Map listener may be covering marker listener
  google.maps.event.addListener(map, 'click', function(evt) {
    console.log(evt.latLng.lat());
    console.log(evt.latLng.lng());
  });

  return map;

}

function addMyLocationMarker(location, map) {
  const marker = new google.maps.Marker({
    position: location,
    map: map,
    icon: myLocationClear,
    draggable: true
  });
  console.log("See");
  google.maps.event.addListener(marker, 'dragend', function() {
    if(pageObject.storageAvailable) {
      localStorage["lat"] = this.getPosition().lat();
      localStorage["lng"] = this.getPosition().lng();
      console.log({"lat": this.getPosition().lat(), "lng": this.getPosition().lng()});
    }

  }.bind(marker));
}

function addActualMarker(object, map) {
  const markerInfo = markerInfoDict[object.profile_name];

  console.log("Adding marker!");
  const marker = new google.maps.Marker({
    position: markerInfo,
    map: map,
    icon: blueMarkerImage
  });

  marker.setMap(map);

  google.maps.event.addListener(marker, 'click', function() {

    handleInfoBoxAnimation(this);
  }.bind(markerInfo));

}

function getLocation(map) {
  console.log("Retrieving location!");

  let location = {lat: 0, lnt: 0};

  if(pageObject.storageAvailable) {
    if(localStorage["lat"]) {
      location["lat"] = parseFloat(localStorage["lat"]);
      location["lng"] = parseFloat(localStorage["lng"]);
      addMyLocationMarker(location, map);
      return;
    }
  }

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition.bind(map), showError);

  } else {
    console.log("Failed to retrieve geolocation!");
  }
}

function showPosition(position, map) {
  const location = {lat: position.coords.latitude,
    lng: position.coords.longitude};
  addMyLocationMarker(location, this);
}

function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      console.log("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      console.log("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      console.log("An unknown error occurred.");
      break;
  }
}
