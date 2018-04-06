document.addEventListener("DOMContentLoaded", function(evt) {
  pageObject  = new PageObject();
  const templateText = document.querySelector("#result_template").innerHTML;
  const template = Handlebars.compile(templateText);

  const location = {lat: 37.56058516193408, lng: 127.03855991363525};
  if(pageObject.storageAvailable) {
    if(localStorage["lat"]) {
      location["lat"] = parseFloat(localStorage["lat"]);
      location["lng"] = parseFloat(localStorage["lng"]);
    }
  }

  profileResults.sort(function(a, b) {
    var keyA = getDistanceFromLatLonInKm(a["lat"], a["lng"], location["lat"], location["lng"]);
    var keyB = getDistanceFromLatLonInKm(b["lat"], b["lng"], location["lat"], location["lng"]);
    if(keyA > keyB) return 1;
    else return 0;
  })

  for (profile of profileResults) {
    let distance = getDistanceFromLatLonInKm(profile["lat"], profile["lng"], location["lat"], location["lng"]);
    let distanceText = "";
    if(distance < 1) {
      distance = getDistanceFromLatLonInM(profile["lat"], profile["lng"], location["lat"], location["lng"]);
      distanceText = distance + " m";
    } else {
      distanceText = distance + " km";
    }
    console.log(imageDict[profile["id"]]);
    const templateObject = {
      id: profile["id"],
      title: profile["pc_title"] + " - " + profile["pc_subtitle"],
      address: profile["address"],
      distance: distanceText,
    };
    if(imageDict[profile["id"]]) {
      templateObject["thumbnail"] = imageDict[profile["id"]][0];
    }
    document.querySelector(".container-content").innerHTML += template(templateObject);

  }

  $(".info-box").on("click tap", function(evt) {
    console.log($(evt.currentTarget).attr("id"));
    window.location.href = "/detail/" + $(evt.currentTarget).attr("id");
  })

  $(".info-box .info-thumbnail img").on("load", function(evt) {
    const curImage = evt.target;
    $(curImage).fadeTo(300, 1.0);
    console.log("Loaded?");
  });

});

var pageObject;
