# Modals
Modals are internal dialog / pop-up windows.

## Draggable windows
To turn an element into a draggable window, simply add the `stim-modal` attribute.

Then, define regions the user can grab and drag by adding the `stim-handle` attribute to one or more child elements.

### Persisting positions
You can persist modal positions by adding a unique `stim-id` attribute, and setting the `stim-modal` attribute to `persist`. For example:

```html
<div class="my-modal" stim-id="my-unique-modal-id" stim-modal="persist">
    <div stim-handle style="padding: 15px; border: 1px solid red;">
        <h1>Drag me around and remember me!</h1>
    </div>
</div>
```