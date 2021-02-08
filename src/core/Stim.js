import Navi from './Navi';
import Templates from "../templates/Templates";
import Forms from "../components/Forms";
import Tooltips from "../components/Tooltips";
import Autoscroll from "../components/Autoscroll";

const pkgVersion = require('../../package.json').version;

/**
 * Core class with bootstrapping logic and shared utilities.
 */
export default class Stim {
  // -------------------------------------------------------------------------------------------------------------------
  // Init

  static bootstrap() {
    if (Stim._didInit) {
      return false;
    }
    Stim._didInit = true;

    console.log(`💉 Stim.js [${pkgVersion}] - Hello world!`);

    Navi.bindEvents();
    Templates.init();

    Stim.handlePageReloaded();

    if (typeof window != "undefined") {
      window.Stim = Stim;
    }

    return true;
  }

  // -------------------------------------------------------------------------------------------------------------------
  // Loading changes

  static handlePageReloaded() {
    // Data
    Stim.locationInfo = {
      host: location.host,
      path: location.pathname,
      title: document.title
    };
    Stim.log('Page (re)loaded', Stim.locationInfo);
    // Core
    Navi.processLinks();
    Templates.scan();
    // Components
    Stim.Forms.update();
    Stim.Tooltips.update();
    Stim.Autoscroll.update();
  }

  // -------------------------------------------------------------------------------------------------------------------
  // Logging

  static log(...args) {
    console.log('%c💉 Stim:', 'color:red', ...args);
  }

  static debug(...args) {
    console.debug('%c💉 Stim:', 'color:gray', ...args);
  }

  static warn(...args) {
    console.warn('%c💉 Stim:', 'color:red', ...args);
  }

  // -------------------------------------------------------------------------------------------------------------------
  // Component APIs

  static get Templates() {
    return Templates;
  }

  static get Forms() {
    return Forms;
  }

  static get Tooltips() {
    return Tooltips;
  }

  static get Autoscroll() {
    return Autoscroll;
  }
}