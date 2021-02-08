# Autoscroll
Autoscroll is a small convenience function that will automatically scroll to the bottom of a scrollable container on page (re)load.

This is useful for certain UIs, like when showing a page with a conversation view.

## Configuration
To enable autoscroll on an element, add the `stim-autoscroll` attribute:

```html
<div class="my-scroll-container" stim-autoscroll>
    ...
</div>
```

## API
You can use the API to manually control or apply autoscrolling behavior.

### Update all components
```javascript
Stim.Autoscroll.update();
```
This normally happens on page (re)load; all elements on the page with `stim-autoscroll` are processed and scrolled.
