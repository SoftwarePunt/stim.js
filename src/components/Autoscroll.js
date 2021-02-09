import Stim from "../core/Stim";
import EventBag from "../utils/EventBag";
import Applicator from "../core/Applicator";

export default class Autoscroll {
  static update() {
    let autoscrolls = document.querySelectorAll('*[stim-autoscroll]');
    for (let i = 0; i < autoscrolls.length; i++) {
      Autoscroll.processAutoscroll(autoscrolls[i]);
      setTimeout(() => {
        // Process the element again after some delay, as scroll height is not always calculated immediately on load
        Autoscroll.processAutoscroll(autoscrolls[i]);
      }, 100);
    }
  }

  static processAutoscroll(element) {
    const stimAutoscroll = element.getAttribute('stim-autoscroll');

    switch (stimAutoscroll) {
      default:
      case "bottom":
        // Default mode: snap to bottom, nothing special
        element.scrollTop = element.scrollHeight - element.clientHeight;
        break;
    }
  }
}
