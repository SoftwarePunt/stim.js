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
    const stimPost = element.getAttribute('stim-post');

    let formMethod = element.getAttribute('method');
    if (!formMethod) {
      // Default to POST behavior
      formMethod = "post";
    } else {
      formMethod = formMethod.toLowerCase();
    }
    if (formMethod !== "post" && formMethod !== "get") {
      // Unsupported form type
      return;
    }

    const targetUrl = stimPost || formAction || document.location.href;

    if (!element.eventBag) {
      element.eventBag = new EventBag(element);
    } else {
      element.eventBag.removeEventListener("submit.stim");
    }

    let _xhr = null;

    element.eventBag.addEventListener("submit.stim", (e) => {
       e.preventDefault();

       if (_xhr === null) {
         const beforeSubmitEvent = new CustomEvent('stim-before-submit', {
           detail: {
             form: element,
             url: targetUrl
           },
           cancelable: true
         });

         if (document.dispatchEvent(beforeSubmitEvent)) {
           const formData = new FormData(element);
           element.setAttribute('stim-loading', true);

           switch (formMethod) {
             case "post": {
               _xhr = new XMLHttpRequest();
               _xhr.addEventListener('load', () => {
                 Applicator.handleXhrResult(targetUrl, _xhr, false, true);
               });
               _xhr.open('POST', targetUrl);
               _xhr.send(formData);
               Stim.LoadingBar.handlePageLoadCommit();
               break;
             }
             case "get": {
               const queryString = new URLSearchParams(formData).toString();

               const targetUrlQueryIndex = targetUrl.indexOf('?');
               let targetUrlNoQuery;
               if (targetUrlQueryIndex > 0) {
                 targetUrlNoQuery = targetUrl.substring(0, targetUrlQueryIndex);
               } else {
                 targetUrlNoQuery = targetUrl;
               }

               Stim.navigate(`${targetUrlNoQuery}?${queryString}`);
               break;
             }
           }
         }
       }

       return false;
    });

    element.setAttribute("stim-bound", true);
  }
}
