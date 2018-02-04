$(document).ready(function(evt) {
  initializeDetail();

  const mainCanvas = document.querySelector("#main-canvas");

  // call AJAX function to retrieve current grid_data
  getCurrentGrid.call(mainCanvas, pcProfileID, initializeCanvas);

  resizeThumbnails();

  setTime(document.querySelector("#current-time"));

  const refreshButton = document.querySelector("#time-holder");
  $(refreshButton).on("click tap", function(evt) {
    setTime(document.querySelector("#current-time"));
    console.log("REFRESHED");
    getCurrentGrid.call(mainCanvas, pcProfileID, initializeCanvas);
  });

});

function initializeDetail() {
  const windowHeight = $(window).height();
  $("#main-view-holder").height(windowHeight * (4.5 / 10));

  // document.querySelector("#main-view-holder").addEventListener("touchstart", function(evt) {
  //   evt.preventDefault();
  //   var touches = evt.touches;
  //   console.log(touches);
  // });

  $("#main-view-holder").on("touchstart", function(evt) {
    evt.preventDefault();
    var touches = evt.touches;
    const touch = touches[0];
    pageObject.touchStart = {x: touch.clientX, y: touch.clientY};
  });

  // Handle drag event
  $("#main-view-holder").on("touchmove", function(evt) {
    evt.preventDefault();
    var touches = evt.touches;

    const touch = touches[0];
    const deltaX = touch.clientX - pageObject.touchStart.x;
    const deltaY = touch.clientY - pageObject.touchStart.y;
    $(this).css({
      "transform": "translate(" + deltaX + "px, " + deltaY + "px)",
      "-webkit-transform" : "translate(" + deltaX + "px, " + deltaY + "px)",
      "-ms-transform" : "translate(" + deltaX + "px, " + deltaY + "px)",
    });
    for(var i = 0; i < touches.length; ++i) {

    }
  }.bind(document.querySelector("#main-canvas")));
}

function resizeThumbnails() {
  $(".thumbnails-holder td").each(function(index, elem) {
		var thumbnailHolder = elem.parentElement;
		var td = thumbnailHolder.querySelector("td");
    var bufferWidth = td.offsetWidth;
    elem.style.height = bufferWidth + "px";
    elem.querySelector("div").style.height = bufferWidth + "px";
		var thumbnail_cover = elem.querySelector(".thumbnail_cover");

    // if(thumbnail_cover) {
		// 		var paddingValue = window.getComputedStyle(td, null).getPropertyValue('padding-left');
		// 		paddingValue = parseInt(paddingValue.substring(0, paddingValue.length - 2));
    //     console.log(paddingValue);
		// 		paddingValue *= 2;
    //     thumbnail_cover.style.lineHeight = bufferWidth - paddingValue + "px";
    // }

  });
}

function checkTime(i) {
    return (i < 10) ? "0" + i : i;
}

function amPM(h) {
  if(h > 12) {
    return "PM";
  } else {
    return "AM";
  }
}

function checkHours(i) {
  if(i > 12) {
    return i % 12;
  }
  return i;
}

function setTime(elem) {
    var today = new Date(),
        h = checkTime(checkHours(today.getHours())),
        m = checkTime(today.getMinutes());
    var format = amPM(today.getHours());
    elem.innerHTML = h + ":" + m + " " + format;
}

var pageObject = new PageObject();
