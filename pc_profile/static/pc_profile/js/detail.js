$(document).ready(function(evt) {
  // Always initialize pageObject at the end of document ready
  pageObject  = new PageObject();

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
    $("#main-canvas").css({
      "margin-left": (0) + "px",
      "margin-top": (0) + "px",
    });
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
    // evt.preventDefault();
    var touches = evt.touches;
    const touch = touches[0];
    pageObject.curTouch = {x: touch.clientX, y: touch.clientY};
  });

  // Handle drag event
  $("#main-view-holder").on("touchmove", function(evt) {
    evt.preventDefault();
    var touches = evt.touches;

    const touch = touches[0];
    const deltaX = touch.clientX - pageObject.curTouch.x;
    const deltaY = touch.clientY - pageObject.curTouch.y;
    console.log(this.style.marginLeft, this.style.marginTop);
    let marginLeft, marginTop;
    if(this.style.marginLeft && this.style.marginTop) {
      marginLeft = parseInt(this.style.marginLeft.substring(0, this.style.marginLeft.length - 2));
      marginTop = parseInt(this.style.marginTop.substring(0, this.style.marginTop.length - 2));
    } else {
      marginLeft = 0;
      marginTop = 0;
    }

    console.log(marginLeft, marginTop);
    $(this).css({
      "margin-left": (marginLeft + deltaX) + "px",
      "margin-top": (marginTop + deltaY) + "px",
    });

    pageObject.curTouch.x = touch.clientX;
    pageObject.curTouch.y = touch.clientY;
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

var pageObject;
