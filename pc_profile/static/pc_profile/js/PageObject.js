class PageObject {
  constructor() {
    this.touchStart = {};
    this.curTouch = {};
    this.curPosition = {};
    this.fingerOne = {};
    this.fingerTwo = {};
    this.map = null;
    this.locationSet = null;
    this.mapMarkerDict = {};
    this.imagesList = [];
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
    });

    $(".navbar-toggler").on("click tap", function(evt) {
      $(".navbar-open-cover").css("display", "block");
    });

  }

  setPartySize(partySize) {
    if(!this.storageAvailable) return;
    localStorage["party-size"] = partySize;
    console.log("Resetting partySize");
  }

  getPartySize() {
    if(!this.storageAvailable || !localStorage["party-size"]) return 1;
    if(localStorage["party-size"] > 10) return 10;
    if(localStorage["party-size"] < 1) return 1;
    return localStorage["party-size"];
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
