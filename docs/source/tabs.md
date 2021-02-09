# Tabs
Tabs can be used to switch the content of an element on click.

```html
<ul class="my-tab-links">
    <a class="my-tab-link" href="#tc3" stim-tab>Contact</a>
    <a class="my-tab-link" href="#tc3" stim-tab>Contact</a>
</ul>
<div class="my-tab-contents">
    <div class="my-tab-pane" id="tc1">Tab content 1</div>
    <div class="my-tab-pane" id="tc2">Tab content 2</div>
    <div class="my-tab-pane" id="tc3">Tab content 3</div>
</div>
```

All switchable elements should have a common parent, and an `id` attribute that is unique on the page.

The clickable links should have the `stim-tab` attribute, and their `href` should point to the id-anchor of the content element.

When a tab link is clicked, all other elements under the common parent will be hidden, and only the corresponding content element will be made visible.

## Styling
When switching between tabs, the content style will be toggled between `display: block` and `display: none` by Stim.js automatically.

Active tabs and active content elements will get the `stim-active` attribute, which allows you to apply custom styles as desired:

```css
.my-tab-link[stim-active] {
    font-weight: bold;
    color: blue;
}

.my-tab-pane[stim-active] {
    display: flex !important;
}
```

## API

### Update all components
```javascript
Stim.Tabs.update();
```
This normally happens on page (re)load; all elements on the page with `stim-tab` are evaluated and bound as needed.
