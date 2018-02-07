document.addEventListener("DOMContentLoaded", function(evt) {
  // Always initialize pageObject at the beginning of document ready
  pageObject = new PageObject();

  const map = initializeMap(document.querySelector("#actual-map"));

  resizeMap($(".main-map-holder"));

  // $(window).resize(function(evt) {
  //   resizeMap($(".main-map-holder"));
  // });

  google.maps.event.addListener(map, 'drag', function() {
    document.querySelector("#party-size-number").blur();
    hideInfoBoxAnimation(document.querySelector(".visible-box"));

  });

  google.maps.event.addListener(map, 'click', function() {
    document.querySelector("#party-size-number").blur();
    hideInfoBoxAnimation(document.querySelector(".visible-box"));
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

  // attaching controls for party size number
  $("#up-button-holder").on("click tap", function(evt) {
    evt.preventDefault();
    const curVal = parseInt($("#party-size-number").val());
    if(curVal < 10) {
      $("#party-size-number").val(curVal + 1);
    } else {
      $("#party-size-number").val(10);
    }
    $("#party-size-number").trigger('input');
  });

  $("#down-button-holder").on("click tap", function(evt) {
    evt.preventDefault();
    const curVal = parseInt($("#party-size-number").val());
    if(curVal > 1) {
      $("#party-size-number").val(curVal - 1);
    } else {
      $("#party-size-number").val(1);
    }
    $("#party-size-number").trigger('input');
  });

  // handling input events on party size number
  $("#party-size-number").on('input', function(evt) {
    const inputValue = $(evt.target).val();
    console.log("Changed!")
    if(inputValue.length > 2 || parseInt(inputValue) > 10) {
      $(evt.target).val(10);
      pageObject.setPartySize(10);
    }
    pageObject.setPartySize(inputValue);

    // applying new party size each time to refresh marker images
    applyPartyMarkerImage(pageObject.getPartySize());
  });

  $("#party-size-number").keypress(function(e) {
    if(e.which == 13){
      $(this).blur();
    }
  });

  $("#party-size-number").on('focusout', function(evt) {
    const inputValue = $(evt.target).val();
    if(inputValue.length < 1 || parseInt(inputValue) < 1) {
      $(evt.target).val(1);
      pageObject.setPartySize(1);
    }
  });

  $("#party-size-number").val(pageObject.getPartySize());

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

  hidden.querySelector(".info-state").innerHTML = getPartyStateText(partySize, object);

  detailsPageLink = "/detail/" + object["id"].trim();

 $(hidden).css({'transform': 'translate(0px, 0px)',
   'transition-duration': '0.5s'});

 $(hidden).fadeTo(200, 1.0);

 hidden.classList.toggle("hidden-box");
 hidden.classList.toggle("visible-box");
 visible.classList.toggle("hidden-box");
 visible.classList.toggle("visible-box");

 hideInfoBoxAnimation(visible);

}

function hideInfoBoxAnimation(infobox) {

  $(infobox).fadeTo(300, 0.0, function(){
    $(this).css({'transform': 'translate(0px, 120px)'});
  }.bind(infobox));

}

function goToDetailsPage() {
  window.location.href = detailsPageLink;
}

var detailsPageLink = "/detail";

var pageObject;
