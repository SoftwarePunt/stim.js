import Stim from "../core/Stim";
import EventBag from "../utils/EventBag";

export default class Tabs {
  static update() {
    let tabs = document.querySelectorAll('a[stim-tab]');
    for (let i = 0; i < tabs.length; i++) {
      Tabs.configureTab(tabs[i]);
    }
  }

  static configureTab(linkElement) {
    const href = linkElement.getAttribute('href');

    if (!href || !href.startsWith('#')) {
      Stim.warn('Invalid stim-tab: expected a valid href with #anchor link', linkElement, href);
      return;
    }

    const targetId = href.substr(1);
    const targetElement = document.getElementById(targetId);

    if (!targetElement) {
      Stim.warn('Invalid stim-tab: could not find element with target id', targetId);
      return;
    }

    if (!linkElement.eventBag) {
      linkElement.eventBag = new EventBag(linkElement);
    } else {
      linkElement.eventBag.removeEventListener("click.stim");
    }

    linkElement.eventBag.addEventListener("click.stim", (e) => {
      e.preventDefault();

      // Update content visibility and active state
      const contentParentElement = targetElement.parentElement;
      const otherContentElements = contentParentElement.children;
      for (let i = 0; i < otherContentElements.length; i++) {
        otherContentElements[i].removeAttribute("stim-active");
        otherContentElements[i].style.display = 'none';
      }
      targetElement.style.display = 'block';
      targetElement.setAttribute("stim-active", true);

      // Update tab active state
      const linkParentElement = linkElement.parentElement;
      const otherTabLinks = linkParentElement.querySelectorAll("a[stim-tab]");
      for (let i = 0; i < otherTabLinks.length; i++) {
        otherTabLinks[i].removeAttribute("stim-active");
      }
      linkElement.setAttribute("stim-active", true);

      return false;
    });

    linkElement.setAttribute("stim-bound", true);

    if (linkElement.getAttribute("stim-active") != null) {
      linkElement.click();
    }
  }
}
