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
   * @param {object|null} data
   * @returns {TemplateInstance}
   */
  instantiate(data) {
    const instanceId = this.idGenerator++;

    let element = document.createElement(this.tagName);
    element.innerHTML = this.html;
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
    Stim.log('Instantiate template:', this.id, instance);
    return instance;
  }
}
