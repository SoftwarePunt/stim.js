# Templates
Templates are a core part of Stim.js. They are used for re-usable and dynamic components like [Tooltips](./tooltips.md) and [ContextMenu](./contextmenu.md).

## Structure
A template is defined in HTML and must be rendered by the server at least once before it can be used.

``` note:: Stim.js will cache a template once it encounters one, so the server can optimize its renders by only sending static templates on the initial full-page load.
```

Here's what a template might look like, as an example for a tooltip:

```html
<div stim-template="my-tooltip-template" class="custom-tooltip">
    <span stim-data="title">Placeholder text</span>
</div>

<a href="#" title="My tooltip text" stim-tooltip="my-tooltip-template">Hover me!</a>
```

All templates follow this same general format with `stim-` attributes.

The component you use affects the available data and options on a template. In this example, with a [Tooltip component](./tooltips.md), we'll have `title` data available to us and `stim-position` becomes a possible option.  

## Attributes
Here's an explanation of the `stim-` attributes that can be used with templates:

|Attribute|Components|Description|
|---------|----------|-----------|
|`stim-template`|All (required)|This defines the globally unique **Template ID** on its root element. This is used as a key when referring to the template elsewhere, and acts a a cache key.|
|`stim-data`|All|This instructs Stim.js to fill the node's text value with a piece of template data. If the data is not available, the placeholder text is kept.|
|`stim-position`|[Tooltips](./tooltips.md)|Controls how the element should be positioned, see [Tooltips](./tooltips.md) for details.|

## Variables
Variables can be injected into templates so it's easier to reuse them.

Which variables are available depends on the component you're using templates with. In most cases this is a set of predefined variables, plus any `data-` properties you have set on the bound element.

These variables can be injected in the template in one of two ways:

 - The **`stim-data` attribute** can be used to set the text content of a specific element to the value of the variable.
 - The **variable syntax** can be used to replace the value in the raw template HTML before it is instantiated on the DOM.

The variable syntax looks like this: ``[%%varname%%]``.

Here is what that might look like when combined with a context menu:

```html
<div stim-template="my-ctx-template">
    <a href="/goto/entity/[%%id%%]">Go to the entity</a>
</div>

<a href="#" stim-menu="my-ctx-template" data-id="123">Open the menu</a>

<!-- The above will render in the DOM as follows when instantiated: -->
<div stim-mounted="true" stim-instance-id="0">
    <a href="/goto/entity/123">Go to the entity</a>
</div>
```


## Styling
The server is responsible for rendering HTML and applying styles itself.

It's good practice to make template elements invisible by default:

```css
*[stim-template] {
    display: none !important;
}
```

You can approach it the other way around as well - when a template is instantiated, the `stim-mounted` attribute will be set on that instance. This allows you to add specific visibility styles:

```css
.my-template[stim-mounted] {
    display: flex;
}
```