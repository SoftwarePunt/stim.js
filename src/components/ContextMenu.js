import Stim from "../core/Stim";
import EventBag from "../utils/EventBag";
import Navi from "../core/Navi";

export default class ContextMenu {
  static update() {
    this.closeAll();
    this.bindAll();
    if (!this.boundDocument) {
      document.addEventListener('click', (e) => {
        if (!this.currentInstance)
          return;
        if (this.currentInstance.element !== e.target && !this.currentInstance.element.contains(e.target))
          this.closeAll();
      });
      window.addEventListener('resize', () => {
        this.closeAll();
      });
      this.boundDocument = true;
    }
  }

  static bindAll() {
    document.querySelectorAll('*[stim-menu]').forEach((element) => {
      ContextMenu.configureMenuLink(element);
    });
  }

  static openOnElement(element, templateId) {
    const isAlreadyOpen = element === this.lastElement;
    this.closeAll();
    if (isAlreadyOpen)
      return;

    // Get template
    const template = Stim.Templates.getTemplate(templateId);
    if (!template) {
      Stim.warn('Template not found for context menu:', templateId);
      return null;
    }

    // Instantiate template
    const menuInstance = template.instantiateFromElement(element);
    if (!menuInstance)
      return;
    this.currentInstance = menuInstance;
    this.lastElement = element;

    // Position
    let elementBox = element.getBoundingClientRect();
    let menuBox = menuInstance.element.getBoundingClientRect();

    const menuWidth = menuBox.width;
    const menuHeight = menuWidth.height;

    const clientWidth = document.body.clientWidth;
    const clientHeight = document.body.clientHeight;

    let posX = elementBox.left;
    let posY = elementBox.bottom + 5;

    if (posX + menuWidth >= clientWidth) {
      posX -= (menuWidth - elementBox.width);
    }
    if (posY + menuHeight >= clientHeight) {
      posY -= (menuHeight + elementBox.height);
    }

    menuInstance.element.style.position = "absolute";
    menuInstance.element.style.left = `${posX}px`;
    menuInstance.element.style.top = `${posY}px`;

    // Update components that can be used in menus
    Navi.processLinks();
    Stim.Tooltips.update();
  }

  static closeAll() {
    if (this.currentInstance) {
      this.currentInstance.destroy();
      this.currentInstance = null;
    }
    this.lastElement = null;
  }

  static configureMenuLink(element) {
    const templateId = element.getAttribute('stim-menu');

    if (!element.eventBag) {
      element.eventBag = new EventBag(element);
    } else {
      element.eventBag.removeEventListener("click.contextmenu");
    }

    element.eventBag.addEventListener("click.contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      ContextMenu.openOnElement(element, templateId);
      return false;
    });
  }
}
