$(document).ready(function(evt) {
  initializeDetail();

  initializeCanvas(document.querySelector("#main-canvas"));

  resizeThumbnails();
});

function initializeDetail() {
  const windowHeight = $(window).height();
  $("#main-view-holder").height(windowHeight * (4.5 / 10));
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
