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
    let _titleValue = element.title;

    if (!element.eventBag) {
      element.eventBag = new EventBag(element);
    } else {
      element.eventBag.removeEventListener("mouseover.tooltips");
      element.eventBag.removeEventListener("mouseleave.tooltips");
      element.eventBag.removeEventListener("mousemove.tooltips");
    }

    let _jumpTimeout = null;

    element.eventBag.addEventListener("mouseover.tooltips", () => {
      if (!_isMouseOver) {
        _isMouseOver = true;
        if (_templateInstance == null) {
          if (element.title) {
            _titleValue = element.title;
          }
          _templateInstance = template.instantiateFromElement(element, {
            title: _titleValue
          });
          element.removeAttribute("title");
          _templateInstance.element.style.visibility = "hidden";
        }
      }
    });

    let _endEventHandler = () => {
      if (_isMouseOver) {
        _isMouseOver = false;
        if (_jumpTimeout != null) {
          clearTimeout(_jumpTimeout);
          _jumpTimeout = null;
        }
        if (_templateInstance != null) {
          _templateInstance.destroy();
          _templateInstance = null;
        }
        element.setAttribute("title", _titleValue);
      }
    };

    element.eventBag.addEventListener("mouseleave.tooltips", _endEventHandler);
    element.eventBag.addEventListener("mousedown.tooltips", _endEventHandler);

    element.eventBag.addEventListener("mousemove.tooltips", (e) => {
      if (_templateInstance && _isMouseOver) {
        const ttElement = _templateInstance.element;
        ttElement.style.visibility = "hidden";

        if (_jumpTimeout != null) {
          clearTimeout(_jumpTimeout);
          _jumpTimeout = null;
        }

        let _applyPosition = (makeVisible) => {
          const ttRect = ttElement.getBoundingClientRect();
          const ttWidth = ttRect.width;
          const ttHeight = ttRect.height;

          const clientWidth = document.body.clientWidth;
          const clientHeight = document.body.clientHeight;

          let nextX = e.clientX;
          let nextY = e.clientY;
          let jumpMargin = 15;

          if (nextX + ttWidth + jumpMargin >= clientWidth) {
            nextX -= ttWidth;
            ttElement.classList.add('-x-invert');
          } else {
            ttElement.classList.remove('-x-invert');
          }

          if (nextY + ttHeight + jumpMargin >= clientHeight) {
            nextY -= ttHeight * 2;
            ttElement.classList.add('-y-invert');
          } else {
            ttElement.classList.remove('-y-invert');
          }

          ttElement.style.position = 'fixed';
          ttElement.style.left = `${nextX}px`;
          ttElement.style.top = `${nextY}px`;
          ttElement.style.visibility = makeVisible ? "visible" : "hidden";
          ttElement.didSetInitialPosition = true;
        };

        if (!ttElement.didSetInitialPosition) {
          _applyPosition(false);
        }

        _jumpTimeout = setTimeout(() => {
          _applyPosition(true);
        }, 150);
      }
    });

    element.setAttribute("stim-tipped", true);
  }
}
