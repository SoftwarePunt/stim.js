export default class ElementUtils {
  static removeAllAttributes(targetElement) {
    while (targetElement.attributes.length > 0) {
      targetElement.removeAttribute(targetElement.attributes[0].name);
    }
  }

  static copyAttributes(fromElement, targetElement, resetAttributesOnTarget = false, attributeBlacklist = []) {
    if (resetAttributesOnTarget) {
      ElementUtils.removeAllAttributes(targetElement);
    }

    for (let i = 0; i < fromElement.length; i++) {
      const attribute = fromElement[i];

      if (attributeBlacklist && attributeBlacklist.indexOf(attribute.name) >= 0) {
        continue;
      }

      targetElement.setAttribute(attribute.name, attribute.value);
    }
  }

  static injectLocalScriptElement(scriptText) {
    Stim.debug('injectLocalScriptElement', scriptText);
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.textContent = scriptText;
    this.injectHeadElement(script);
    return script;
  }

  static injectRemoteScriptElement(src) {
    Stim.debug('injectLocalScriptElement', src);
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = src;
    this.injectHeadElement(script);
    return script;
  }

  static injectHeadElement(element) {
    document.getElementsByTagName('head')[0].appendChild(element);
  }
}