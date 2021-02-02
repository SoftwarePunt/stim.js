# Links and preloading
Stim.js accelerates internal page loads by preloading them over XHR when the user begins clicking on the link (on mousedown / touchstart). This avoids having to preform a full page reload, and makes your app frontend feel significantly faster - like an SPA!

## Binding
When Stim.js [is first loaded](installation.md), and whenever it (pre)loads another page, all `<a>` tags in the DOM will be checked and bound for preloading, if they are compatible.

For a link to qualify, its `href` property must be a relative URL, and not an `#anchor`.

Certain links are always ignored by Stim.js:
- If `download` or `stim-ignore` properties are set.
- If `rel` is set to `external`.
- If `target` is set to any value other than `_self`.

## Preload behavior

### Flow
1. Preloading begins when a user begins clicking down (`mousedown`) on a bound link. For touch devices, this is on `touchstart`.
2. Stim.js will send an XHR `GET` request to the server and keep its response in memory until the user finishes the "click" action.
3. In most cases, when the user releases the link press, that small window of time (~100ms) is enough to fully or partially load the page, at which point it will be applied to the DOM - this will feel almost instantaneous.

### Exceptions
- If the link-click is aborted by the user, the preload will also be aborted if possible, and the DOM won't change and no redirects will happen under any circumstance.
- If the link-click is finalized, but the XHR request failed, the browser will hard-navigate to the URL without XHR.
