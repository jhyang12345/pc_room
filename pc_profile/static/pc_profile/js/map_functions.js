// 9:14 marker image ratio
// 18, 28
// 27, 42

const blueMarkerImage = {
  url: '/static/pc_profile/images/marker_blue.png',
  size: new google.maps.Size(27, 42),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(14, 42),
  scaledSize: new google.maps.Size(27, 42)
};

const blueMarkerImageSmall = {
  url: '/static/pc_profile/images/marker_blue.png',
  size: new google.maps.Size(18, 28),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(9, 28),
  scaledSize: new google.maps.Size(18, 28)
};

const selectedMarker = {
  url: '/static/pc_profile/images/selected_marker.png',
  size: new google.maps.Size(27, 42),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(14, 42),
  scaledSize: new google.maps.Size(27, 42)
};

const greenMarkerImage = {
  url: '/static/pc_profile/images/marker_green.png',
  size: new google.maps.Size(27, 42),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(14, 42),
  scaledSize: new google.maps.Size(27, 42)
};

const orangeMarkerImage = {
  url: '/static/pc_profile/images/marker_orange.png',
  size: new google.maps.Size(27, 42),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(14, 42),
  scaledSize: new google.maps.Size(27, 42)
};

const redMarkerImage = {
  url: '/static/pc_profile/images/marker_red.png',
  size: new google.maps.Size(27, 42),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(14, 42),
  scaledSize: new google.maps.Size(27, 42)
};

const myLocationClear = {
  url: '/static/pc_profile/images/my_location_clear.png',
  size: new google.maps.Size(27, 42),
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

function initializeMap(mapHolder, small) {
  var map = new google.maps.Map(mapHolder, {
    center: {lat: 37.56058516193408, lng: 127.03855991363525},
    zoom: 15,
    zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_BOTTOM
    },
    streetViewControlOptions: {
      position: google.maps.ControlPosition.LEFT_BOTTOM
    },
    disableDefaultUI: true,
    gestureHandling: "none",

  });

  pageObject.map = map;

  // Adding loaded markerlist
  if(typeof(mapMarkerList) != "undefined") {
    for(const marker of mapMarkerList) {
      pageObject.mapMarkerDict[marker.profile_name] = addActualMarker(marker, map, small);
    }
  }

  // Map listener may be covering marker listener
  google.maps.event.addListener(map, 'click', function(evt) {
    console.log(evt.latLng.lat());
    console.log(evt.latLng.lng());
  });

  // setTimeout(() => {
  //   $(window).trigger("resize");
  //   console.log("Trigger resize");
  //   map.setCenter({lat: 37.56058516193408, lng: 127.0388});
  //
  //   map.fitBounds(map.getBounds());
  //   google.maps.event.trigger(map, 'resize');
  //
  // }, 1000);

  return map;

}

function applyPartyMarkerImage(partySize) {
  for(const item of mapMarkerList) {
    const marker = pageObject.mapMarkerDict[item.profile_name];
    const markerInfo = markerInfoDict[item.profile_name];
    if(partySize < markerInfo.largest_empty_seats) {
      marker.setIcon(greenMarkerImage);
    } else if(partySize < markerInfo.two_empty_seats) {
      marker.setIcon(blueMarkerImage);
    } else if(partySize < markerInfo.empty_seats) {
      marker.setIcon(orangeMarkerImage);
    } else {
      marker.setIcon(redMarkerImage);
    }
  }
}

function getPartyMarkerImage(partySize, markerInfo) {
  if(partySize < markerInfo.largest_empty_seats) {
    return "/static/pc_profile/images/marker_green.png";
  } else if(partySize < markerInfo.two_empty_seats) {
    return "/static/pc_profile/images/marker_blue.png";
  } else if(partySize < markerInfo.empty_seats) {
    return "/static/pc_profile/images/marker_orange.png";
  } else {
    return "/static/pc_profile/images/marker_red.png";
  }
}

function getPartyStateText(partySize, markerInfo) {
  if(partySize < markerInfo.largest_empty_seats) {
    return "붙은 자리";
  } else if(partySize < markerInfo.two_empty_seats) {
    return "최소 둘둘";
  } else if(partySize < markerInfo.empty_seats) {
    return "한명은 혼자";
  } else {
    return "자리 부족";
  }
}

function getPartyStateColor(partySize, markerInfo) {
  if(partySize < markerInfo.largest_empty_seats) {
    return "#3EC8AC";
  } else if(partySize < markerInfo.two_empty_seats) {
    return "#4472C4";
  } else if(partySize < markerInfo.empty_seats) {
    return "#F79F24";
  } else {
    return "#E20049";
  }
}

function addMyLocationMarker(location, map, clickCalled) {
  let marker;
  // check in pageObject for locationMarker
  if(pageObject.locationSet && !clickCalled) {
    console.log("Location already set!");
    marker = pageObject.locationSet;
  } else if(pageObject.locationSet && clickCalled) {
    marker = pageObject.locationSet;
    marker.setPosition(location);
    if(pageObject.storageAvailable) {
      localStorage["lat"] = marker.getPosition().lat();
      localStorage["lng"] = marker.getPosition().lng();
    }

  } else {
    marker = new google.maps.Marker({
      position: location,
      map: map,
      icon: myLocationClear,
      draggable: true
    });
    pageObject.locationSet = marker;
  }

  if(clickCalled) {
    map.panTo(marker.getPosition());
  }

  google.maps.event.addListener(marker, 'dragend', function() {
    if(pageObject.storageAvailable) {
      localStorage["lat"] = this.getPosition().lat();
      localStorage["lng"] = this.getPosition().lng();
    }

  }.bind(marker));

  google.maps.event.addListener(marker, 'click', function() {
    map.panTo(marker.getPosition());
  });
}

function addActualMarker(object, map, small) {
  const markerInfo = markerInfoDict[object.profile_name];

  let marker;
  if(!small) {
    marker = new google.maps.Marker({
      position: markerInfo,
      map: map,
      icon: blueMarkerImage
    });
  } else {
    marker = new google.maps.Marker({
      position: markerInfo,
      map: map,
      icon: blueMarkerImageSmall
    });
  }

  marker.setMap(map);

  google.maps.event.addListener(marker, 'click', function(marker) {
    handleInfoBoxAnimation(this);
    const map = marker.getMap();
    map.panTo(marker.getPosition());
    if(pageObject.selectedMarker == null) {
      pageObject.selectedMarker = new google.maps.Marker({
        position: marker.getPosition(),
        map: map,
        icon: selectedMarker
      });
    } else {
      pageObject.selectedMarker.setPosition(marker.getPosition());
      pageObject.selectedMarker.setMap(map);
    }
    marker.getPosition();
  }.bind(markerInfo, marker));

  return marker;

}

function removeSelectedMarker() {
  pageObject.selectedMarker.setMap(null);
}

// retrieve geolocation
function getLocation(map, clickCalled) {
  console.log("Retrieving location!");

  let location = {lat: 0, lng: 0};

  // if click Called GPS location is being asked for
  if(clickCalled) {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        showPosition.bind(map, position, clickCalled)();
      }, (error) => {
        showError.bind(map, error, clickCalled)();

      }
      );
      return;
    } else {
      console.log("Failed to retrieve geolocation!");
    }
  }

  if(pageObject.storageAvailable) {
    if(localStorage["lat"]) {
      location["lat"] = parseFloat(localStorage["lat"]);
      location["lng"] = parseFloat(localStorage["lng"]);
      addMyLocationMarker(location, map, clickCalled);
      return;
    }
  }

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition.bind(map), showError.bind(map));
    return;
  } else {
    console.log("Failed to retrieve geolocation!");
  }

  location["lat"] = map.getCenter().lat();
  location["lng"] = map.getCenter().lng();
  addMyLocationMarker(location, map, clickCalled);

}

function showPosition(position, clickCalled) {
  const location = {lat: position.coords.latitude,
    lng: position.coords.longitude};

  addMyLocationMarker(location, this, clickCalled);
}

function showError(error, clickCalled) {
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
    default:
      break;
  }
  const currentCenter = this.getCenter();
  const location = {lat: currentCenter.lat(), lng: currentCenter.lng()};
  addMyLocationMarker(location, this, clickCalled);
}
