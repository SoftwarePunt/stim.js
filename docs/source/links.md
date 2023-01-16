# Links and inline loading
Stim.js accelerates internal page loads by (pre)loading them over XHR. This avoids a full page reload, which makes your app frontend feel significantly faster - like an SPA!

For links, preloading begins when the user *begins* clicking on the link (on mouse down or touch start). By the time the user releases their mouse button, the page is usually done loading, so it can be shown immediately.

Inline loading is also used by [Forms](./forms.md).

Most of the Stim.js components will be registered or updated whenever a page loads, both on a hard reload an on an inline reload. 

## Binding links
When Stim.js [is first loaded](installation.md), and whenever it (pre)loads another page, all `<a>` tags in the DOM will be checked and bound for preloading, if they are compatible.

For a link to qualify, it must be a relative URL that opens in the current tab.

If `download` or `stim-ignore` attributes are set on the link, the link will always be ignored.

## Preloading behavior
Preloading begins when a user begins clicking down (`mousedown`) on a bound link. For touch devices, this is on `touchstart`.

Stim.js will send an XHR `GET` request to the server and keep its response in memory. When the user releases the mouse button or otherwise finishes the "click", the page will be presented whenever it's ready - usually instantly.


If the link-click is aborted by the user, the preload will also be aborted if possible, and the DOM won't change and no redirects will happen under any circumstance.

If the link-click is finalized, but the XHR request failed, the browser will hard-navigate to the URL without XHR.

## LoadingBar
Between release of the link click and the final page load, a loading bar appears on the top of the page by default. This helps the page feel responsive while the background load completes. 

See [LoadingBar](./loadingbar.md) for customization and options.

## Integration

### Manual navigation (`Stim.navigate()`)
You can use `Stim.navigate(url)` to manually perform an inline load from a script. Note that the URL will not be validated.

### Opening links externally (`stim-ignore`)
If this attribute is set on a link, it will be ignored by Stim.js.

### Breaking out of inline loads (`stim-kill` and `stim-zone`)
These attributes can be set on the `<body>` element to form a blacklist or whitelist for which pages can be loaded inline by Stim.js.

Whitelist mode: Once `stim-zone` is found on a body, a hard reload will be performed if a page is loaded that does *not* have the `stim-zone` attribute on its body.

Blacklist mode: If `stim-kill` is found on a body, a hard reload will be performed.

This is useful to prevent your page layout from breaking when Stim.js inadvertently loads an error page or external page that should not be loaded inline.     

### Updating actual URLs (`rel=canonical`)
The server can optionally send the canonical URL as a meta tag. If this is encountered on an inline load, it will be used for the address bar and browser history. This may be useful because Stim.js may not be able to detect URL redirects properly.

### Executing scripts (`stim-run`)
By adding a `stim-run` attribute to `<script>` tag, that script will run whenever a page is loaded inline.

### Event: Before DOM change (`stim-before-change`)
The `stim-before-change` event will be emitted right before the DOM is changed.

### Event: Inline load complete (`stim-load`)
The `stim-load` event will be emitted on the `document` as soon as an inline load is fully complete and the DOM has been changed. This event is not emitted on the initial page load.

