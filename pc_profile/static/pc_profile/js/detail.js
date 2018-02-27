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
    getCurrentSeating.call(mainCanvas, pcProfileID, updatePartyState);
    $("#main-canvas").css({
      "margin-left": (0) + "px",
      "margin-top": (0) + "px",
    });
  });

  $(".pc-phone-holder a").on("click tap", function(evt) {
    evt.preventDefault();
    const tel = $(evt.target).attr("href");
    console.log(tel);
    console.log(evt.target);
    // window.open(tel.substr(4, tel.length));
    Android.invokeCall(tel);

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
    updatePartyState(getPartyStateText(pageObject.getPartySize(), profileInfo),
        getPartyStateColor(pageObject.getPartySize(), profileInfo));
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
  updatePartyState(getPartyStateText(pageObject.getPartySize(), profileInfo),
      getPartyStateColor(pageObject.getPartySize(), profileInfo));


  $("#party-info-label").on("click tap", function(evt) {
    evt.stopPropagation();
    const curElem = evt.currentTarget;
    const infoText = curElem.querySelector("#party-info-label-text").innerHTML.trim();
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

  // will be replaced
  initializeImageList(imageList);

  console.log(profileInfo);

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

function updatePartyState(text, color) {
  $("#party-info-label-text").text(text);
  $("#party-info-label-color").css("background-color", color);
}

function getCurrentSeating(profileID, updatePartyState) {
  $.ajax({
    url: '/current-grid/' + profileID,
    type: 'GET',
    success: function(data) {
      console.log(data);
      profileInfo.largest_empty_seats = data.largest_empty_seats;
      profileInfo.two_empty_seats = data.two_empty_seats;
      profileInfo.empty_seats = data.empty_seats;
      updatePartyState(getPartyStateText(pageObject.getPartySize(), data),
          getPartyStateColor(pageObject.getPartySize(), data));
    }.bind(this)
  });
}

function resizeThumbnails() {
  $(".thumbnails-holder td").each(function(index, elem) {
		var thumbnailHolder = elem.parentElement;
		var td = thumbnailHolder.querySelector("td");
    var bufferWidth = td.offsetWidth;
    elem.style.height = bufferWidth + "px";
    elem.querySelector("div").style.height = bufferWidth + "px";
		var thumbnail_cover = elem.querySelector(".thumbnail_cover");
  });
}

// function to open Gallery in detail view for magnified view of images
function openGallery(index) {
  if(index > pageObject.imagesList.length - 1 || !pageObject.imagesList[index]) {
    return;
  }
  const imageSource = pageObject.imagesList[index];
  pageObject.imageListIndex = index;

  $(".gallery-holder img").attr("src", imageSource);
  $(".gallery-holder").css("display", "block");
  $(".gallery-background").css("display", "block");

  Android.setHandleBackButton();
}

// imageList is a list of image sources
function initializeImageList(imageList) {
  pageObject.imagesList = imageList;

  $(".gallery-holder").on("click tap", function(evt) {
    $(".gallery-holder").css("display", "none");
    $(".gallery-background").css("display", "none");
    Android.handleBackButton();
  });

  $(".gallery-closer-holder").on("click tap", function(evt) {
    evt.stopPropagation();
    $(".gallery-holder").css("display", "none");
    $(".gallery-background").css("display", "none");
    Android.handleBackButton();
  });

  $(".gallery-image-holder img").on("click tap", function(evt) {
    evt.stopPropagation();
    const screenWidth = $(window).width();
    let index = pageObject.imageListIndex;
    if(evt.clientX < screenWidth / 2) {
      if(index == 0) index = pageObject.imagesList.length;
      openGallery(index - 1);
    } else {
      if(index == imageList.length - 1) index = -1;
      openGallery(index + 1);
    }
  });

  // hard codedly assign image sources to each element
  $(".main-picture-holder img").attr("src", imageList[0]);
  $(".main-picture-holder img").on("click tap", function(evt) {
    openGallery(0);
  });
  $(".single_thumbnail img").each((i, element) => {
    const index = parseInt(i);
    $(element).attr("src", pageObject.imagesList[index + 1]);
    $(element).on("click tap", (evt) => {
      openGallery(index + 1)
    });
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
