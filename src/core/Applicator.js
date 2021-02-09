import Stim from "./Stim";

/**
 * Utility for applying loaded XHR responses to the DOM and state.
 */
export default class Applicator {
  static handleInitialLoad() {
    if (document.body.getAttribute('stim-zone') != null) {
      // stim-zone found, we are now in "whitelist" mode and expect this to be on all body elements we load
      if (!Applicator.stimZoneMode) {
        Stim.log(`Whitelist mode enabled for inline loading (stim-zone)`);
        Applicator.stimZoneMode = true;
      }
    }
  }

  static handleXhrResult(href, xhr, writeHistory = false) {
    if (xhr.status >= 400) {
      // 4XX or 5XX server error, XHR load failed
      // redirect the browser for real to handle the situation (e.g. show error page)
      Stim.log(`Hard redirecting user, got bad response code (${xhr.status})`);
      document.location = href;
      return;
    }

    let holderElement = document.createElement('html');
    holderElement.innerHTML = xhr.response;

    // Apply <title> tag if we have one
    const titleElement = holderElement.getElementsByTagName('title')[0];
    const prevTitle = document.title.toString();
    let nextTitle = prevTitle;
    if (titleElement) {
      nextTitle = titleElement.text
    }

    // Apply <body> tag if we have one
    const bodyElement = holderElement.getElementsByTagName('body')[0];
    if (bodyElement) {
      if (bodyElement.getAttribute('stim-zone') != null) {
        // stim-zone found, we are now in "whitelist" mode and expect this to be on all body elements we load
        if (!Applicator.stimZoneMode) {
          Stim.log(`Whitelist mode enabled for inline loading (stim-zone)`);
          Applicator.stimZoneMode = true;
        }
      } else if (Applicator.stimZoneMode) {
        // stim-zone not found, but we expected it - this load violates the whitelist
        Stim.log(`Hard redirecting user, broke out of stim-zone`);
        document.location = href;
        return;
      }

      if (bodyElement.getAttribute('stim-kill') != null) {
        // stim-kill found, force hard reload
        Stim.log(`Hard redirecting user, got stim-kill`);
        document.location = href;
        return;
      }

      document.body.innerHTML = bodyElement.innerHTML;
    }

    // Read canonical URL from header or meta tag


    // Push history state
    if (writeHistory) {
      history.pushState(null, nextTitle, href);
    }
    document.title = nextTitle;

    // Fire change event asynchronously
    setTimeout(() => {
      Stim.handlePageReloaded();
    }, 0);
  }
}

Applicator.stimZoneMode = false;