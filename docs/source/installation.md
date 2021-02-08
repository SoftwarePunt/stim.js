# Installation
Stim.js ships as a single file with no dependencies. Just require it in a `<script>` tag and you're good to go!

## Download
You can download the latest [**stable version**](https://github.com/SoftwarePunt/stim.js/releases/latest) from the GitHub releases page.

Or, you can download the latest [**bleeding edge build**](https://github.com/SoftwarePunt/stim.js/actions?query=workflow%3A%22Webpack+Build%22+branch%3Amaster+is%3Asuccess) from GitHub actions. Find the latest successful build, and download it from the "Artifacts" section. 

Also, the package is available on npm if that's your kind of thing: [**stim.js**](https://www.npmjs.com/package/stim.js).

## Setup
Simply require the script on your page:

```html
<script src="stim.js" async defer></script>
```

Stim.js does not require any dependencies and will execute on `DOMContentLoaded`. 

It is recommended to use `async` and `defer` so the script does not delay page loading or rendering in any way. 

