import Loader from "./Loader";
import Stim from "./Stim";

/**
 * Utility for handling <a> link binding.
 */
export default class Navi {
  static bindEvents() {
    const initialHost = document.location.host;

    window.addEventListener('popstate', (event) => {
      if (document.location.host !== initialHost) {
        Stim.log('Refusing to handle popstate event for another host:', document.location.host);
        document.location.reload();
      } else {
        const preload = Loader.startOrContinuePreload(document.location.href);
        preload.historyMode = true; // prevents pushstate
        preload.commit();
      }
    });
  }

  static processLinks() {
    const links = document.getElementsByTagName('a');

    let linksBound = 0;
    for (let i = 0; i < links.length; i++) {
      const link = links[i];

      if (Navi.getIsLinkElementBound(link)) {
        // Already bound link
        continue;
      }

      if (!Navi.getIsLinkElementCompatible(link)) {
        // Incompatible link element
        continue;
      }

      Navi.bindLinkElement(link);
      linksBound++;
    }

    if (linksBound)
      Stim.log(`Bound ${linksBound} links`);
  }

  static getIsLinkElementCompatible(link) {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.indexOf('://') >= 0) {
      // Reject - link does not have a valid href, links to an #anchor, or is an external link.
      return false;
    }
    if (link.target && link.target !== "_self") {
      // Reject - link is meant to open in another tab, window or frame
      return false;
    }
    if (link.rel && link.rel === "external") {
      // Reject - hinted to be an external link
      return false;
    }
    if (link.getAttribute('download') !== null || link.getAttribute('stim-ignore') !== null) {
      // Reject - link has "download" or "stim-ignore" attribute
      return false;
    }
    // No objections
    return true;
  }

  static getIsLinkElementBound(link) {
    return !!link.getAttribute('stim-bound');
  }

  static bindLinkElement(link) {
    let _href = link.href;
    let _isClicking = false;

    const _onClickBegin = () => {
      _isClicking = true;
      Loader.startOrContinuePreload(_href);
    };
    link.addEventListener('mousedown', _onClickBegin, {passive: true});
    link.addEventListener('touchstart', _onClickBegin, {passive: true});

    const _onClickCancel = () => {
      if (_isClicking) {
        _isClicking = false;
        Loader.stopPreload(_href, "click canceled (mouseleave/touchcancel)");
      }
    };
    link.addEventListener('mouseleave', _onClickCancel, {passive: true});
    link.addEventListener('touchcancel', _onClickCancel, {passive: true});

    const _onClickFinalize = (e) => {
      if (_isClicking) {
        e.preventDefault();
        _isClicking = false;
        Loader.commitPreload(_href);
        return false;
      } else {
        Loader.stopPreload(_href, "click finalized before it even began");
      }
      return true;
    };
    link.addEventListener('click', _onClickFinalize, {passive: false});

    link.setAttribute('stim-bound', true);
  }
}