# Forms
Stim.js can accelerate form submissions, similar to [link preloading](./links.md).

If configured, forms will load inline and the POST request will be sent over XHR to avoid a full page reload.

## Configuration
To enable this feature, set the `stim-post` property on a `<form>` tag:
 
```html
<form method="post" action="/target" stim-post>
```

The value of `stim-post` can be set to a custom target URL. If set without a value, the `action` will be used instead.

By default, the request will send FormData mimic a regular form submission.

## API
Forms will be scanned and configured whenever Stim.js first loads, and whenever it navigates to another page through [preloading](./links.md).

If the contents of your page have dynamically changed, you can force a manual update as well:

```javascript
Stim.Forms.update();
```