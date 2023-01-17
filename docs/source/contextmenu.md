# ContextMenu
Pop-out menus that can be opened to reveal additional context options. They are bound to links or programmatically opened.

## Usage

### Creating menus
To set up a context menu, first define a [Template](./templates.md) for it:

```html
<div stim-template="my-menu-template" class="my-menu-class">
    <a href="#">Some link</a>
    <a href="#">Another link</a>
    <div class="my-separator"></div>
    <a href="#">One more link</a>
</div>
```

### Binding to links
You can bind a link to a context menu by setting the `stim-menu` property on it, with a value referring to the menu template:

```html
<a href="#" stim-menu="my-menu-template">
    <img src="open_context_menu.png"/>
</a>
```

When the user clicks the link, a context menu will open, its location anchored to the link clicked.

### Scripting menus
You can also manually open and close context menus.

To open a context menu at an element's position:
```javascript
Stim.ContextMenu.openOnElement(element, 'my-menu-template');
```

To close all menus:
```javascript
Stim.ContextMenu.closeAll();
```

### Binding data
You can bind data to the trigger element by setting `data-` properties on it. These will become available in the template for injection. This makes it easier to re-use the same menu template for multiple items.

For example:

```html
<div stim-template="my-ctx-template">
    <a href="/goto/entity/[%%id%%]">Go to the entity</a>
</div>

<a href="#" stim-menu="my-ctx-template" data-id="123">Open the menu</a>
<a href="#" stim-menu="my-ctx-template" data-id="456">Open another menu</a>

<!-- The above will render in the DOM as follows when the first link is clicked: -->
<div stim-mounted="true" stim-instance-id="0">
    <a href="/goto/entity/123">Go to the entity</a>
</div>
```