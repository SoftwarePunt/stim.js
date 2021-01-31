import Navi from './Navi';

/**
 * Core class with bootstrapping logic and shared utilities.
 */
export default class Stim {
  static bootstrap() {
    console.log('💉 Stim.js - hello world!');

    Navi.bindEvents();
    Stim.handlePageReloaded();
  }

  static log(...args) {
    console.log('%c💉 Stim:', 'color:red', ...args);
  }

  static debug(...args) {
    console.debug('%c💉 Stim:', 'color:gray', ...args);
  }

  static handlePageReloaded() {
    Stim.locationInfo = {
      host: location.hostname,
      path: location.pathname,
    };
    Stim.log('Page (re)loaded', Stim.locationInfo);
    Navi.processLinks();
  }
}