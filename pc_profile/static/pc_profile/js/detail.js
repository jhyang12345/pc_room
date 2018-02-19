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

  $("#main-view-holder").on("touchstart", function(evt) {
    // evt.preventDefault();
    var touches = evt.touches;
    if(touches.length < 2) {
      const touch = touches[0];
      pageObject.curTouch = {x: touch.clientX, y: touch.clientY, identifier: touch.identifier};
    }
    if(touches.length == 2) {
      pageObject.fingerOne = {x: touches[0].clientX, y: touches[0].clientY};
      pageObject.fingerTwo = {x: touches[1].clientX, y: touches[1].clientY};
    }
  });

  // Handle touch end event
  $("#main-view-holder").on("touchend", function(evt) {
    var touches = evt.touches;

  });

  // Handle drag event
  $("#main-view-holder").on("touchmove", function(evt) {
    evt.preventDefault();
    var touches = evt.touches;

    // one finger drag
    if(evt.touches.length < 2) {
      const touch = touches[0];
      const deltaX = touch.clientX - pageObject.curTouch.x;
      const deltaY = touch.clientY - pageObject.curTouch.y;

      if(touch.identifier != pageObject.curTouch.identifier) return;

      let marginLeft, marginTop;
      if(this.style.marginLeft && this.style.marginTop) {
        marginLeft = parseInt(this.style.marginLeft.substring(0, this.style.marginLeft.length - 2));
        marginTop = parseInt(this.style.marginTop.substring(0, this.style.marginTop.length - 2));
      } else {
        marginLeft = 0;
        marginTop = 0;
      }

      $(this).css({
        "margin-left": (marginLeft + deltaX) + "px",
        "margin-top": (marginTop + deltaY) + "px",
      });

      pageObject.curTouch.x = touch.clientX;
      pageObject.curTouch.y = touch.clientY;
    } else if(evt.touches.length == 2) {
      const fingerOne = {x: touches[0].clientX, y: touches[0].clientY};
      const fingerTwo = {x: touches[1].clientX, y: touches[1].clientY};
      const curCenter = {x: (fingerOne.x + fingerTwo.x) / 2, y: (fingerOne.y + fingerTwo.y) / 2};
      const fingerOneOrigin = pageObject.fingerOne;
      const fingerTwoOrigin = pageObject.fingerTwo;
      const originalCenter = {x: (fingerOneOrigin.x + fingerTwoOrigin.x) / 2, y: (fingerOneOrigin.y + fingerTwoOrigin.y) / 2};
      const deltaX = curCenter.x - originalCenter.x;
      const deltaY = curCenter.y - originalCenter.y;

      let marginLeft, marginTop;
      if(this.style.marginLeft && this.style.marginTop) {
        marginLeft = parseInt(this.style.marginLeft.substring(0, this.style.marginLeft.length - 2));
        marginTop = parseInt(this.style.marginTop.substring(0, this.style.marginTop.length - 2));
      } else {
        marginLeft = 0;
        marginTop = 0;
      }

      const curDistance = Math.sqrt((fingerOne.x - fingerTwo.x) * (fingerOne.x - fingerTwo.x) + (fingerOne.y - fingerTwo.y) * (fingerOne.y - fingerTwo.y));
      const prevDistance = Math.sqrt((fingerOneOrigin.x - fingerTwoOrigin.x) * (fingerOneOrigin.x - fingerTwoOrigin.x) +
        (fingerOneOrigin.y - fingerTwoOrigin.y) * (fingerOneOrigin.y - fingerTwoOrigin.y));

      const ratio = curDistance / prevDistance;
      // alert(ratio);
      // let scaleRatio;

      const canvas = this;
      // const scaleX = canvas.getBoundingClientRect().width / canvas.offsetWidth;

      const canvasWidth = parseFloat(canvas.style.width.substring(0, canvas.style.width.length - 2));
      const canvasHeight = parseFloat(canvas.style.height.substring(0, canvas.style.height.length - 2));

      canvas.style.width = (canvasWidth * ratio) + 'px';
      canvas.style.height = (canvasHeight * ratio) + 'px';

      const xGrowth = ((canvasWidth * ratio) - canvasWidth);
      const yGrowth = ((canvasHeight * ratio) - canvasHeight);

      // applying margins at end
      $(this).css({
        "margin-left": (marginLeft + deltaX - (xGrowth / 2)) + "px",
        "margin-top": (marginTop + deltaY - (yGrowth / 2)) + "px",
      });

      // refreshing pageObject finger coordinates
      pageObject.fingerOne = fingerOne;
      pageObject.fingerTwo = fingerTwo;

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

// function to open Gallery in detail view for magnified view of images
function openGallery() {

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
