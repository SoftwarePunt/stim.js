# LoadingBar
The loading bar is a horizontal progress bar that appears at the top of the page. It simulates fake progress with a simple animation. This helps the page feel "alive" and responsive while a background request completes.

## Behavior
When loading begins, the bar fades in and will animate from about 20% width towards 100%. 

The animation will slow down the longer the request takes to complete, but will keep animating until it reaches 95%.

If the request completes fairly quickly (~250ms), the loading bar will not appear at all. This is fairly common for Stim.js preloads.

## Stim Loading 
By default, the loading bar appears whenever Stim.js [internally loads a page](./links.md). For link clicks, the loading bar only appears between the click release and final load.

You can completely disable this behavior if you prefer:

```javascript
Stim.LoadingBar.setHandlePageLoads(false); // don't show for internal loads
```

## Manual Use
To start the progress bar:

```javascript
Stim.LoadingBar.start(); // fade in and begin animation (~250ms)
```

To finish the progress bar:

```javascript
Stim.LoadingBar.finish(); // run to 100% and then fade out
```

To immediately cancel/abort the progress bar:

```javascript
Stim.LoadingBar.stop(); // immediately stop and fade out
```

## Styles
You can choose which built-in style to use:

```javascript
Stim.LoadingBar.setStyle(LoadingBarStyle.Blue); // default style
Stim.LoadingBar.setStyle(LoadingBarStyle.None); // remove all styles
```

You can manually define/override CSS styles by targeting the `.stim-progressbar` class. 