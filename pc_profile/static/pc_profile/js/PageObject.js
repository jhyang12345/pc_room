class PageObject {
  constructor() {
    this.touchStart = {};
    this.curTouch = {};
    this.curPosition = {};
    this.fingerOne = {};
    this.fingerTwo = {};
    this.map = null;
    this.locationSet = null;
    this.selectedMarker = null;
    this.focusedMarkerInfo = null;
    this.mapMarkerDict = {};
    this.imagesList = [];
    this.thumbnailList = [];
    this.imageListIndex = 0;

    this.init();

  }

  init() {
    if(storageAvailable('localStorage')) {
      this.storageAvailable = true;
    } else {
      this.storageAvailable = false;
    }

    $(".navbar-open-cover").on("click tap", function(evt) {
      $('.navbar-toggler').click();
      $(this).css("display", "none");
      Android.handleBackButton();
    });

    $(".navbar-toggler").on("click tap", function(evt) {
      if($(".navbar-open-cover").css("display") == "block") {
        $(".navbar-open-cover").css("display", "none");
      } else {
        $(".navbar-open-cover").css("display", "block");
        Android.setHandleBackButton();
      }

    });

  }

  setPartySize(partySize) {
    if(!this.storageAvailable) return;
    localStorage["party-size"] = partySize;
  }

  getPartySize() {
    if(!this.storageAvailable || !localStorage["party-size"]) return 1;
    if(localStorage["party-size"] > 10) return 10;
    if(localStorage["party-size"] < 1) return 1;
    return localStorage["party-size"];
  }

  closeOpenView() {
    if($(".gallery-closer-holder").length) {
      $(".gallery-closer-holder").click();
    }

    if($(".explanation-overlay").length) {
      $(".explanation-overlay").click();
    }

    if($(".navbar-open-cover").css("display") == "block") {
      $(".navbar-open-cover").click();
    }
  }

  addMyLocationFromAndroid(lat, lng) {
    const location = {"lat": parseFloat(lat), "lng": parseFloat(lng)};
    addMyLocationMarker(location, this.map, true);
  }

}

function storageAvailable(type) {
  try {
    var storage = window[type],
    x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch(e) {
    return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage.length !== 0;
  }
}





// Things that need to be on localStorage
// 1. Current Location
// 2. Current Party Size
