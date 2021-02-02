import Stim from "./Stim";

export class TemplateInstance {
  constructor(instanceId, element) {
    this.instanceId = instanceId;
    this.element = element;
    this.isDestroyed = false;
  }

  applyData(templateData) {
    const dataReceivers = this.element.querySelectorAll('*[stim-data]');
    for (let i = 0; i < dataReceivers.length; i++) {
      const dataReceiver = dataReceivers[i];
      const dataKey = dataReceiver.getAttribute('stim-data');

      if (typeof templateData[dataKey] !== "undefined") {
        dataReceiver.textContent = templateData[dataKey];
      }
    }
  }

  destroy() {
    if (!this.isDestroyed) {
      this.element.remove();
      this.isDestroyed = true;
    }
  }
}

export class Template {
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
    Stim.log('instantiate tpl', this.id, instance);
    return instance;
  }
}

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
        Stim.log('Discovered new template:', templateId);
        this._templates[templateId] = new Template(templateId, templateElement);
      } else {
        Stim.log('Discovered updated template:', templateId);
        this._templates[templateId].setElementData(templateElement);
      }
    }
  }

  /**
   * @param {string} templateId
   * @returns {Template|null}
   */
  static getTemplate(templateId) {
    return typeof this._templates[templateId] !== "undefined" ?
      this._templates[templateId] : null;
  }
}