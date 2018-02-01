document.addEventListener("DOMContentLoaded", function(evt) {
  const map = initializeMap(document.querySelector("#actual-map"));

  resizeMap($(".main-map-holder"));

  $(window).resize(function(evt) {
    resizeMap($(".main-map-holder"));
  });

  for (object of object_list) {
    addActualMarker(object, map);
    console.log(object);
  }

});

function resizeMap(mapElement) {
  const navbarHeight = $(".navbar").outerHeight();
  console.log(navbarHeight);
  mapElement.height(mapElement.height() - navbarHeight);
}

const object_1 = {
  "name": "사이버리아 PC방 - 수서점",
  "address": "서울특별시 강남구 수서동 725 수서타워 사이버리아PC방 - 수서점 ",
  "state": "자리 부족",
  "coord": {lat: 37.561225, lng: 127.035503}
}

const object_2 = {
  "name": "ON PC방 - 왕십리점",
  "address": "서울특별시 강남구 수서동 725 수서타워 사이버리아PC방 - 수서점 ",
  "state": "붙은 자리",
  "coord": {lat: 37.55981972178119, lng: 127.03714370727539}
}

const object_3 = {
  "name": "ON PC방 - 왕십리점",
  "address": "서울특별시 강남구 수서동 725 수서타워 사이버리아PC방 - 수서점 ",
  "state": "붙은 자리",
  "coord": {lat: 37.56043207453259, lng: 127.03830242156982}
}

const object_list = [object_1, object_2, object_3];

function handleInfoBoxAnimation(object) {
  var hidden = document.querySelector(".hidden-box");
  var visible = document.querySelector(".visible-box");

   $(hidden).css({'transform': 'translate(0px, 0px)',
   'transition-duration': '0.5s'});

   $(hidden).fadeTo(300, 1.0);

   hidden.classList.toggle("hidden-box");
   hidden.classList.toggle("visible-box");
   visible.classList.toggle("hidden-box");
   visible.classList.toggle("visible-box");

   hideInfoBoxAnimation(visible);

   console.log("tansformed!");

}

function hideInfoBoxAnimation(infobox) {

  $(infobox).fadeTo(300, 0.0, function(){
    $(this).css({'transform': 'translate(0px, 120px)'});
  }.bind(infobox));

  console.log("tansformed!");
}
