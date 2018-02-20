document.addEventListener("DOMContentLoaded", function(event) {
  // Always initialize pageObject at the end of document ready
  pageObject = new PageObject();

  $("#map-holder").on("click tap", function(evt) {
    evt.preventDefault();
    window.location.href = "./map"
  });

  $(".up-button-holder").on("click tap", function(evt) {
    evt.preventDefault();
    const curVal = parseInt($("#party-size-number").val());
    if(curVal < 10) {
      $("#party-size-number").val(curVal + 1);
    } else {
      $("#party-size-number").val(10);
    }
    $("#party-size-number").trigger('input');
  });

  $(".down-button-holder").on("click tap", function(evt) {
    evt.preventDefault();
    const curVal = parseInt($("#party-size-number").val());
    if(curVal > 1) {
      $("#party-size-number").val(curVal - 1);
    } else {
      $("#party-size-number").val(1);
    }
    $("#party-size-number").trigger('input');
  });

  $("#party-size-number").on('input', function(evt) {
    const inputValue = $(evt.target).val();
    console.log("Changed!")
    if(inputValue.length > 2 || parseInt(inputValue) > 10) {
      $(evt.target).val(10);
      pageObject.setPartySize(10);
    }
    pageObject.setPartySize(inputValue);
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


  handleGridArrowPosition();

  initializeMap(document.querySelector("#map-holder"), true);

  $("#party-size-number").val(pageObject.getPartySize());

});



function handleGridArrowPosition() {
  const height = $(".mini-grid-viewer").outerHeight();
  const itemHeight = $(".grid-left-button").height();
  console.log(height, itemHeight);
  $('.grid-left-button').css("top", height / 2 - itemHeight / 2);
  $('.grid-right-button').css("top", height / 2 - itemHeight / 2);

}

var pageObject;
