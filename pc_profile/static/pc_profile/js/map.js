document.addEventListener("DOMContentLoaded", function(evt) {
  const map = initializeMap(document.querySelector("#actual-map"));

  resizeMap($(".main-map-holder"));

  $(window).resize(function(evt) {
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

  detailsPageLink = "/detail/" + object["id"].trim();

   $(hidden).css({'transform': 'translate(0px, 0px)',
   'transition-duration': '0.5s'});

   $(hidden).fadeTo(300, 1.0);

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

  console.log("tansformed!");
}

function goToDetailsPage() {
  window.location.href = detailsPageLink;
}

var detailsPageLink = "/detail";
