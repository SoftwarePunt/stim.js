import Stim from "./Stim";
import ElementUtils from "./ElementUtils";

/**
 * Utility for applying loaded XHR responses to the DOM and state.
 */
export default class Applicator {
  static handleInitialLoad() {
    this.checkStimZone(document.body, null, true);
  }

  static handleXhrResult(href, xhr, writeHistory = false, isFormPost = false) {
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

    // Read canonical URL from header or meta tag
    const canonicalUrl = this.tryGetCanonicalUrl(holderElement.getElementsByTagName('head')[0]);
    if (canonicalUrl) {
      if (canonicalUrl !== href) {
        Stim.log('Detected canonical URL change:', href, '->', canonicalUrl);
        href = canonicalUrl;
        if (!writeHistory && isFormPost) {
          writeHistory = true;
        }
      }
    }

    // Apply <body> tag if we have one
    const bodyElement = holderElement.getElementsByTagName('body')[0];
    if (bodyElement) {
      if (!this.checkStimZone(bodyElement, href, false)) {
        return;
      }
      // Apply HTML
      document.body.innerHTML = bodyElement.innerHTML;
      // Copy attributes
      ElementUtils.copyAttributes(bodyElement, document.body, true);
    }

    // Remove stale injected scriptsscripts
    const staleScripts = document.querySelectorAll('head > script[stim-injected]');
    for (let i = 0; i < staleScripts.length; i++) {
      staleScripts[i].remove();
    }

    // Push history state
    if (writeHistory) {
      history.pushState(null, nextTitle, canonicalUrl);
    }
    document.title = nextTitle;

    // Fire change events asynchronously
    setTimeout(() => {
      Stim.handlePageReloaded();

      // Run scripts (async)
      const scriptElements = document.querySelectorAll('script[stim-run]');
      for (let i = 0; i < scriptElements.length; i++) {
        let scriptElement = scriptElements[i];
        let injectedScriptElement;
        if (scriptElement.src) {
          injectedScriptElement = ElementUtils.injectRemoteScriptElement(scriptElement.src);
        } else {
          injectedScriptElement = ElementUtils.injectLocalScriptElement(scriptElement.textContent);
        }
        injectedScriptElement.setAttribute("stim-injected", true);
      }
    }, 0);
  }

  static checkStimZone(bodyElement, href, isInitialLoad = false) {
    if (bodyElement.getAttribute('stim-zone') != null) {
      // stim-zone found, we are now in "whitelist" mode and expect this to be on all body elements we load
      if (!Applicator.stimZoneMode) {
        Stim.log(`Whitelist mode enabled for inline loading (stim-zone)`);
        Applicator.stimZoneMode = true;
        return false;
      }
    } else if (!isInitialLoad && Applicator.stimZoneMode) {
      // stim-zone not found, but we expected it - this load violates the whitelist
      Stim.log(`Hard redirecting user, broke out of stim-zone`);
      document.location = href;
      return false;
    }

    if (!isInitialLoad && bodyElement.getAttribute('stim-kill') != null) {
      // stim-kill found, force hard reload
      Stim.log(`Hard redirecting user, got stim-kill`);
      document.location = href;
      return false;
    }

    return true;
  }

  static tryGetCanonicalUrl(rootElement) {
    const linkElement = rootElement.querySelector('link[rel="canonical"]');
    if (linkElement) {
      const href = linkElement.href;
      if (href) {
        const hrefUrl = new URL(href);
        if (hrefUrl.origin !== document.location.origin) {
          Stim.warn('Invalid canonical URL detected, origin mismatch!',
            `Expected ${document.location.origin}, but got ${hrefUrl.origin}`)
        } else {
          return hrefUrl.href;
        }
      }
      return null;
    }
  }
}

Applicator.stimZoneMode = false;