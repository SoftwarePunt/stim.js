# 💉 Stim.js
**An ultra-lightweight JavaScript frontend framework that complements server-side rendering.**

*🚧 This library is still being prototyped and developed.*

## Features
- 🏎 **Accelerate applications that use server-side rendering**:
  Preload pages on links at touch start or mouse down via XHR, like Turbolinks. This avoids full page reloads and makes navigation feel almost instant.
  
- 🧩 **An optional drop-in**:
  Stim.js is designed to complement plain-old HTML rendering by adding interactivity, where possible. Its API and templates are designed to support full noscript fallbacks.

## Documentation

### Getting started
Build `stim.js` and include it on your HTML page.

### Turbo-boosted links
When Stim.js is loaded, or whenever it loads (part of) another page, all links (`<a>` tags) in the DOM will be checked and bound for preloading, if they are compatible.

#### Compatible `<a>` links
For a link to qualify, it must meet all the following requirements:
 - Refer to a target of `_self`, or don't have a target;
 - Have a relative URL (not absolute, and not an `#anchor`)

#### Preload behavior
Preloading begins when a user begins clicking the link (on touch start or mouse down) by sending an XHR GET request to the server.

In most cases, when the user releases the link press, that small window of time (~100ms) is enough to fully or partially load the page, at which point it will be applied to the DOM - this will feel almost instantaneous. 

If the XHR request fails for whatever reason, the browser will hard-navigate to the URL without XHR. If the link-click is aborted by the user, the preload will also be aborted if possible, and the DOM won't change.

#### Server-side integration
