import Stim from "../core/Stim";
import EventBag from "../utils/EventBag";

export default class Tooltips {
  static update() {
    let tooltips = document.querySelectorAll('*[stim-tooltip]');
    for (let i = 0; i < tooltips.length; i++) {
      Tooltips.configureTooltip(tooltips[i]);
    }
  }

  static configureTooltip(element) {
    const templateId = element.getAttribute('stim-tooltip');
    const template = Stim.Templates.getTemplate(templateId);

    if (!template) {
      Stim.warn('Template not found for tooltip:', templateId, element);
      return;
    }

    let _templateInstance = null;
    let _isMouseOver = false;

    if (!element.eventBag) {
      element.eventBag = new EventBag(element);
    } else {
      element.eventBag.removeEventListener("mouseover.tooltips");
      element.eventBag.removeEventListener("mouseleave.tooltips");
    }

    element.eventBag.addEventListener("mouseover.tooltips", () => {
      if (!_isMouseOver) {
        _isMouseOver = true;
        if (_templateInstance == null) {
          _templateInstance = template.instantiate({
            title: element.title
          });
        }
      }
    });

    element.eventBag.addEventListener("mouseleave.tooltips", () => {
      if (_isMouseOver) {
        _isMouseOver = false;
        if (_templateInstance != null) {
          _templateInstance.destroy();
          _templateInstance = null;
        }
      }
    });

    element.setAttribute("stim-tipped", true);
  }
}
