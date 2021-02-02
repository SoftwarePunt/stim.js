/**
 * Represents a copy of a template that was mounted on the DOM.
 */
export class TemplateInstance {
  constructor(instanceId, element) {
    this.instanceId = instanceId;
    this.element = element;
    this.isDestroyed = false;
  }

  /**
   * Applies template data to the element, modifying its child elements as needed.
   *
   * @param {object|null} templateData
   */
  applyData(templateData) {
    if (!templateData) {
      return;
    }
    const dataReceivers = this.element.querySelectorAll('*[stim-data]');
    for (let i = 0; i < dataReceivers.length; i++) {
      const dataReceiver = dataReceivers[i];
      const dataKey = dataReceiver.getAttribute('stim-data');

      if (typeof templateData[dataKey] !== "undefined") {
        dataReceiver.textContent = templateData[dataKey];
      }
    }
  }

  /**
   * Removes the element from the DOM.
   *
   * @return {boolean} True if removed, false if element was already removed.
   */
  destroy() {
    if (!this.isDestroyed) {
      this.element.remove();
      this.isDestroyed = true;
      return true;
    }
    return false;
  }
}
