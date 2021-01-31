import Stim from "./Stim";

export default class Applicator {
  static handleServerResponse(href, xhr) {
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
    if (titleElement) {
      document.title = titleElement.text;
    }

    // Apply <body> tag if we have one
    const bodyElement = holderElement.getElementsByTagName('body')[0];
    if (bodyElement) {
      document.body.innerHTML = bodyElement.innerHTML;
    }

    // Fire change event asynchronously
    setTimeout(() => {
      Stim.handlePageReloaded();
    }, 0);
  }
}