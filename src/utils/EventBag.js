export default class EventBag {
  constructor(element) {
    this.element = element;
    this.functionMap = { };
  }

  addEventListener(event, func) {
    this.functionMap[event] = func;
    this.element.addEventListener(event.split('.')[0], this.functionMap[event]);
  }

  removeEventListener(event) {
    this.element.removeEventListener(event.split('.')[0], this.functionMap[event]);
    delete this.functionMap[event];
  }
}