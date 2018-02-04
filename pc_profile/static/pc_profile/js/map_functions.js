// 9:14 marker image ratio
const blueMarkerImage = {
  url: '/static/pc_profile/images/marker_blue.png',
  size: new google.maps.Size(90, 140),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(14, 42),
  scaledSize: new google.maps.Size(27, 42)
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


  // addMarker({lat: 37.561225, lng: 127.035503}, map, "normal");
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

function addMarker(location, map, type) {
  const marker = new google.maps.Marker({
    position: location,
    map: map,
    icon: blueMarkerImage,
  });
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
