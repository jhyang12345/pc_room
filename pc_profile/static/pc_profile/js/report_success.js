document.addEventListener("DOMContentLoaded", function(evt) {
  $(".home-button").on("click tap", function(evt) {
    console.log("Home Button Clicked!");

  });
  console.log("Form handed in!");
  Android.clearHistory();
});
