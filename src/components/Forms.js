import Stim from "../core/Stim";
import EventBag from "../utils/EventBag";
import Applicator from "../core/Applicator";

export default class Forms {
  static update() {
    let forms = document.querySelectorAll('form[stim-post]');
    for (let i = 0; i < forms.length; i++) {
      Forms.configureForm(forms[i]);
    }
  }

  static configureForm(element) {
    const formAction = element.getAttribute('action');
    const formMethod = element.getAttribute('method');
    const stimPost = element.getAttribute('stim-post');

    const postUrl = stimPost || formAction || document.location;

    if (!element.eventBag) {
      element.eventBag = new EventBag(element);
    } else {
      element.eventBag.removeEventListener("submit.stim");
    }

    let _xhr = null;

    element.eventBag.addEventListener("submit.stim", (e) => {
       e.preventDefault();

       if (_xhr === null) {
         const formData = new FormData(element);

         element.setAttribute('stim-loading', true);

         _xhr = new XMLHttpRequest();
         _xhr.addEventListener('load', () => {
           Applicator.handleXhrResult(postUrl, _xhr, false);
         });
         _xhr.open('POST', postUrl);
         _xhr.send(formData);
       }

       return false;
    });

    element.setAttribute("stim-bound", true);
  }
}
