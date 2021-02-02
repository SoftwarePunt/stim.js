# Tooltips
Stim.js can add fancy tooltips to your application, acting as a drop-in replacement for `title` properties on various HTML tags.

## Configuration
To enable this feature, set the `stim-tooltip` property on an existing HTML tag:
 
```html
<a href="#" title="Plain old fallback tooltip" stim-tooltip="left">Example tag</a>
```

The value of `stim-tooltip` should be set to a [**Template ID**](./templates.md). If the template cannot be resolved, a warning will be logged and fancy tooltips won't be enabled for that element.

This approach has some benefits. Fancy tooltips will only appear in the places you want them to, using a specific template. And if scripts are disabled, native tooltips will simply continue to work through the title attribute.

## API
Tooltips will be scanned and configured whenever Stim.js first loads, and whenever it navigates to another page through [preloading](./links.md).

If the contents of your page have dynamically changed, you can force a manual update as well:

```javascript
Stim.Tooltips.update();
```

``` note:: You do not need to call this function if the title has changed, only if new tooltip elements need to be registered.
```

## Template

### Attributes
The following attributes can be set on the template as defaults, or the tooltip source element itself:

#### stim-position
Controls how the tooltip should be positioned. Options:
- `hover` (default): the element will be positioned automatically, like a regular tooltip.

### Data

#### title
The original value of the title attribute.

## Example
```html
<div stim-template="tt-left" stim-position="hover" class="my-tooltip">
    <span stim-data="title">...</span>
</div>
<a href="#" title="Tooltip text" stim-tooltip="tt-left">Hover me!</a>
```