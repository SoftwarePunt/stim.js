import Stim from "../core/Stim";
import {TemplateDefinition} from "./TemplateDefinition";

export default class Templates {
  static init() {
    this._templates = {};
  }

  static scan() {
    let templates = document.querySelectorAll('*[stim-template]');
    for (let i = 0; i < templates.length; i++) {
      let templateElement = templates[i];
      let templateId = templateElement.getAttribute('stim-template');

      if (typeof this._templates[templateId] === "undefined") {
        Stim.debug('Discovered new template:', templateId);
        this._templates[templateId] = new TemplateDefinition(templateId, templateElement);
      } else {
        Stim.debug('Discovered updated template:', templateId);
        this._templates[templateId].setElementData(templateElement);
      }
    }
  }

  /**
   * @param {string} templateId
   * @returns {TemplateDefinition|null}
   */
  static getTemplate(templateId) {
    return typeof this._templates[templateId] !== "undefined" ?
      this._templates[templateId] : null;
  }
}