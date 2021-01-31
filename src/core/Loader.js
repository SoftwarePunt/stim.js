import Stim from "./Stim";
import Preload from "./Preload";

/**
 * Utility for (pre)loading content via XHR.
 */
export default class Loader {
  static __init() {
    Loader._preloads = { };
  }

  /**
   * Tries to abort any and all ongoing preloads.
   */
  static stopAllPreloads() {
    Object.keys(Loader._preloads).forEach((href) => {
      Loader.stopPreload(href, "stop all");
    });
    Loader._preloads = { };
  }

  /**
   * Tries to abort an ongoing preload by its href.
   *
   * @param {string} href
   */
  static stopPreload(href, reason) {
    if (typeof Loader._preloads[href] !== "undefined") {
      Loader._preloads[href].abort(reason);
      delete Loader._preloads[href];
    }
  }

  /**
   * Will begin preloading an href in the background and returns a Preload instance.
   * If a preload for the href already exists and wasn't aborted, that instance is returned instead.
   *
   * @param {string} href
   * @returns {Preload}
   */
  static startOrContinuePreload(href) {
    if (typeof Loader._preloads[href] !== "undefined") {
      const existingPreload = Loader._preloads[href];
      if (!existingPreload.stopped) {
        return existingPreload;
      }
    }

    const preload = new Preload(href);
    Loader._preloads[href] = preload;

    preload.start();

    return preload;
  }

  static commitPreload(href) {
    Loader.startOrContinuePreload(href).commit();
  }
}

Loader.__init();