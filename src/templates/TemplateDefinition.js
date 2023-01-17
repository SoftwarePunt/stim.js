import Stim from "../core/Stim";
import {TemplateInstance} from "./TemplateInstance";

/**
 * Cached template definition that can be instantiated.
 */
export class TemplateDefinition {
  constructor(id, originalElement) {
    this.id = id;
    this.setElementData(originalElement);
    this.instances = [];
    this.idGenerator = 0;
  }

  setElementData(originalElement) {
    this.html = originalElement.innerHTML;
    this.tagName = originalElement.tagName;
    this.attributes = originalElement.attributes;
  }

  /**
   * @param {Element} element Trigger element from the binding context.
   * @param {object|null} baseData Predefined / priority template data.
   * @returns {TemplateInstance}
   */
  instantiateFromElement(element, baseData = null) {
    let dataCombined = { };
    for (const key in element.dataset) {
      dataCombined[key] = element.dataset[key];
    }
    if (baseData) {
      for (const [key, value] of Object.entries(baseData)) {
        dataCombined[key] = value;
      }
    }
    return this.instantiate(dataCombined);
  }

  /**
   * @param {object|null} data
   * @returns {TemplateInstance}
   */
  instantiate(data) {
    const instanceId = this.idGenerator++;

    let element = document.createElement(this.tagName);
    element.innerHTML = TemplateDefinition.prepareInnerHtml(this.html, data);
    element.setAttribute("stim-mounted", true);
    element.setAttribute("stim-instance-id", instanceId);
    for (let i = 0; i < this.attributes.length; i++) {
      const attribute = this.attributes[i];
      if (attribute.name !== "stim-template") {
        element.setAttribute(attribute.name, attribute.value);
      }
    }
    document.body.appendChild(element);

    let instance = new TemplateInstance(instanceId, element);
    instance.applyData(data);

    this.instances[instanceId] = instance;
    Stim.debug('Instantiate template:', this.id, instance);
    return instance;
  }

  static prepareInnerHtml(html, data) {
    for (const [key, value] of Object.entries(data)) {
      html = html.replaceAll(`[%%${key}%%]`, this.stripHtml(value));
    }
    return html;
  }

  static stripHtml(text) {
    return text
      .replaceAll(/&/g, "&amp;")
      .replaceAll(/</g, "&lt;")
      .replaceAll(/>/g, "&gt;")
      .replaceAll(/"/g, "&quot;")
      .replaceAll(/'/g, "&#039;");
  }
}
