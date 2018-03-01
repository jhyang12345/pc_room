document.addEventListener("DOMContentLoaded", function(evt) {
  // Always initialize pageObject at the beginning of document ready
  pageObject = new PageObject();

  const map = initializeMap(document.querySelector("#actual-map"));

  map.setOptions({'gestureHandling': 'greedy', 'zoom': 16});
  getLocation(map);

  resizeMap($(".main-map-holder"));

  // $(window).resize(function(evt) {
  //   resizeMap($(".main-map-holder"));
  // });

  google.maps.event.addListener(map, 'drag', function() {
    document.querySelector("#party-size-number").blur();
    hideInfoBoxAnimation(document.querySelector(".visible-box"));
    removeSelectedMarker();
  });

  google.maps.event.addListener(map, 'click', function() {
    document.querySelector("#party-size-number").blur();
    hideInfoBoxAnimation(document.querySelector(".visible-box"));
    removeSelectedMarker();
  });

  $(".main-map-holder").resize(function(evt) {
    resizeMap($(".main-map-holder"));
  });

  var hidden = document.querySelector(".hidden-box");
  var visible = document.querySelector(".visible-box");

  $(hidden).on("click tap", function(evt) {
    goToDetailsPage();
  });

  $(visible).on("click tap", function(evt) {
    goToDetailsPage();
  });

  $(".info-state").on("click tap", function(evt) {
    evt.stopPropagation();
    const curElem = evt.currentTarget;
    const infoText = curElem.querySelector(".info-state-text").innerHTML.trim();
    const content = getExplanationText(infoText);

    $(".explanation-box").html(content);

    $(".explanation-overlay").css("display", "block");
    $(".explanation-box").css("display", "block");

    $(".explanation-overlay").on("click tap", function(evt) {
      $(".explanation-overlay").css("display", "none");
      $(".explanation-box").css("display", "none");
      Android.handleBackButton();
    });

    Android.setHandleBackButton();

  });

  // attaching controls for party size number
  $("#up-button-holder").on("click tap", function(evt) {
    evt.preventDefault();
    const curVal = parseInt($("#party-size-number").text());
    if(curVal < 10) {
      $("#party-size-number").text(curVal + 1);
    } else {
      $("#party-size-number").text(10);
    }
    $("#party-size-number").trigger('input');
  });

  $("#down-button-holder").on("click tap", function(evt) {
    evt.preventDefault();
    const curVal = parseInt($("#party-size-number").text());
    if(curVal > 1) {
      $("#party-size-number").text(curVal - 1);
    } else {
      $("#party-size-number").text(1);
    }
    $("#party-size-number").trigger('input');
  });

  // handling input events on party size number
  $("#party-size-number").on('input', function(evt) {
    const inputValue = $(evt.target).text();
    console.log("Changed!")
    if(inputValue.length > 2 || parseInt(inputValue) > 10) {
      $(evt.target).text(10);
      pageObject.setPartySize(10);
    }
    pageObject.setPartySize(inputValue);

    // applying new party size each time to refresh marker images
    applyPartyMarkerImage(pageObject.getPartySize());

    const object = pageObject.focusedMarkerInfo;
    if(object) {
      const partySize = pageObject.getPartySize();
      var visible = document.querySelector(".visible-box");
      visible.querySelector(".info-state-text").innerHTML = getPartyStateText(partySize, object);
      visible.querySelector(".info-state-color").style.backgroundColor = getPartyStateColor(partySize, object);
      $(visible.querySelector(".info-marker")).attr("src", getPartyMarkerImage(partySize, object));
    }
  });

  $("#party-size-number").keypress(function(e) {
    if(e.which == 13){
      $(this).blur();
    }
  });

  $("#party-size-number").on('focusout', function(evt) {
    const inputValue = $(evt.target).text();
    if(inputValue.length < 1 || parseInt(inputValue) < 1) {
      $(evt.target).text(1);
      pageObject.setPartySize(1);
    }
  });

  $("#party-size-number").text(pageObject.getPartySize());

  // applying party size to initial marker images load
  applyPartyMarkerImage(pageObject.getPartySize());

  // clicking current location button from main page
  $("#get-current-location-holder").on("click tap", (evt) => {
    getLocation(map, true);
  });
});

function resizeMap(mapElement) {
  const navbarHeight = $(".navbar").outerHeight();
  console.log(navbarHeight);
  mapElement.height(mapElement.height() - navbarHeight);
}


// Object Keys
// pc_title, pc_subtitle, address, lat, lng
function handleInfoBoxAnimation(object) {
  var hidden = document.querySelector(".hidden-box");
  var visible = document.querySelector(".visible-box");

  hidden.querySelector(".info-title").innerHTML = object["pc_title"].trim() + " - " + object["pc_subtitle"].trim();
  hidden.querySelector(".info-address").innerHTML = object["address"].trim();

  const partySize = pageObject.getPartySize();

  // easier to use jquery to set src for image
  const imageSrc = getPartyMarkerImage(partySize, object);
  $(hidden.querySelector(".info-marker")).attr("src", imageSrc);

  const imageList = imageDict[object["id"]];
  if(imageList.length) {
    $(hidden.querySelector(".info-thumbnail").querySelector("img")).attr("src", imageList[0]);
    $(hidden.querySelector(".info-thumbnail").querySelector("img")).css("opacity", 0);
    $(hidden.querySelector(".info-thumbnail").querySelector("img")).on("load", function(evt) {
      const curImage = evt.target;
      $(curImage).fadeTo(0.3, 1.0);
      console.log("Loaded?");
    });
  } else {
    $(hidden.querySelector(".info-thumbnail").querySelector("img")).attr("src", "");
  }

  hidden.querySelector(".info-state-text").innerHTML = getPartyStateText(partySize, object);
  hidden.querySelector(".info-state-color").style.backgroundColor = getPartyStateColor(partySize, object);
  detailsPageLink = "/detail/" + object["id"].trim();

 $(hidden).css({'transform': 'translate(0px, 0px)',
   'transition-duration': '0s'});

 $(hidden).fadeTo(0, 1.0);

 hidden.classList.toggle("hidden-box");
 hidden.classList.toggle("visible-box");
 visible.classList.toggle("hidden-box");
 visible.classList.toggle("visible-box");

 hideInfoBoxAnimation(visible);

}

function hideInfoBoxAnimation(infobox) {

  $(infobox).fadeTo(0, 0.0, function(){
    $(this).css({'transform': 'translate(0px, 120px)'});
  }.bind(infobox));

}

function goToDetailsPage() {
  window.location.href = detailsPageLink;
}

var detailsPageLink = "/detail";

var pageObject;
