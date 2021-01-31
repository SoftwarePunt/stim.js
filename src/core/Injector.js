import Stim from "./Stim";

export default class Injector {
  static handleServerResponse(xhr) {
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