class PageObject {
  constructor() {
    this.touchStart = {};
    this.curTouch = {};
    this.init();

  }

  init() {
    if(storageAvailable('localStorage')) {
      this.storageAvailable = true;
      console.log("localStorage available!");
    } else {
      this.storageAvailable = false;
      console.log("unavailable");
    }
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
