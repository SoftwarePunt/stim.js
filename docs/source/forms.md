# Forms
Stim.js can accelerate form submissions, similar to [link preloading](./links.md).

If configured, forms will load inline and the POST request will be sent over XHR to avoid a full page reload.

## Configuration
To enable this feature, set the `stim-post` property on a `<form>` tag:

```html
<form method="post" action="/target" stim-post>
```

The value of `stim-post` can be set to a custom target URL. If set without a value, the `action` will be used instead.

Only `post` (default) and `get` methods are supported:

### POST forms
A request is sent to the target URL with `FormData`. This mimics a regular browser form submission.

### GET forms
The target URL will be loaded with its query string. This is an internal page load via [`Stim.navigate()`](./links.md#manual-navigation-stim-navigate).

## API
Forms will be scanned and configured whenever Stim.js first loads, and whenever it navigates to another page through [preloading](./links.md).

If the contents of your page have dynamically changed, you can force a manual update as well:

```javascript
Stim.Forms.update();
```

## stim-before-submit
Before a form is submitted, Stim.js will emit the `stim-before-submit` event on the document. This event is cancelable to prevent the submission from going ahead.

- `event.detail.form` - references the form element
- `event.detail.url` - the URL Stim.js will submit the form to via POST