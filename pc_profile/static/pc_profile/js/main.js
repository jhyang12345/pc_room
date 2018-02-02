document.addEventListener("DOMContentLoaded", function(event) {
// $(document).ready(function(evt) {
  console.log("Document Ready!");

  $("#map-container").on("click tap", function(evt) {
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
  });

  $(".down-button-holder").on("click tap", function(evt) {
    evt.preventDefault();
    const curVal = parseInt($("#party-size-number").val());
    if(curVal > 1) {
      $("#party-size-number").val(curVal - 1);
    } else {
      $("#party-size-number").val(1);
    }
  });

  $("#party-size-number").on('input', function(evt) {
    const inputValue = $(evt.target).val();
    console.log("Changed!")
    if(inputValue.length > 2 || parseInt(inputValue) > 10) {
      $(evt.target).val(10);
    }
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
    }
  });

  $(".mini-grid-viewer").height($(".mini-grid-viewer").width());

  initializeCanvas(document.querySelector(".mini-grid-canvas"));

  console.log($(".mini-grid-viewer").outerHeight());

  handleGridArrowPosition();

  initializeMap(document.querySelector("#map-holder"));

});

function handleGridArrowPosition() {
  const height = $(".mini-grid-viewer").outerHeight();
  const itemHeight = $(".grid-left-button").height();
  console.log(height, itemHeight);
  $('.grid-left-button').css("top", height / 2 - itemHeight / 2);
  $('.grid-right-button').css("top", height / 2 - itemHeight / 2);

}
