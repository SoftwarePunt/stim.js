export default class LoadingBar {
  static init() {
    if (!this.div) {
      this.div = document.createElement('div');
      this.div.id = "stim-loadingbar";
      this.div.className = "stim-loadingbar";

      LoadingBar.setStyle(LoadingBarStyle.Blue);
      LoadingBar.setHandlePageLoads(true);
    }
  }

  static stopTimers() {
    if (this.finishTimeout) {
      clearTimeout(this.finishTimeout);
      this.finishTimeout = null;
    }
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  static stop() {
    this.stopTimers();
    this.progress = 0;
    this.running = false;
    this.div.style.opacity = '0';
  }

  static start() {
    this.stop();

    if (!document.body.contains(this.div))
      document.body.appendChild(this.div);

    this.interval = setInterval(() => {
      // Slowly advance fake progress - the longer it takes, the slower we go
      if (this.progress < 0.2) {
        this.progress += 0.01;
      } else if (this.progress < 0.5) {
        this.progress += 0.0005;
      } else if (this.progress < 0.9) {
        this.progress += 0.00025;
      } else if (this.progress < 0.95) {
        this.progress += 0.000001;
      } else {
        // We hold at 95% and wait for completion
        clearInterval(this.interval);
        this.interval = null;
      }
      this.div.style.width = `${(this.progress * 100).toFixed(2)}%`;
      if (this.progress > 0.01) // waiting a tick ensures the initial css width transition (e.g. 100->0) is complete
        this.div.style.opacity = '1';
    }, 101);
    this.running = true;
  }

  static finish() {
    this.stopTimers();

    if (!document.body.contains(this.div))
      document.body.appendChild(this.div);

    // Run to 100%
    this.div.style.width = `100%`;

    // Fade out after the 100% css transition completes
    this.finishTimeout = setTimeout(() => {
      this.stop();
    }, 120);
  }

  // -------------------------------------------------------------------------------------------------------------------
  // Page load integration

  static handlePageLoadCommit() {
    // The page (pre)load has reached the "interactive" stage where the user has committed, i.e. click was released
    //  or form submit button was pressed; if we're handling those, begin the animation
    if (!this.handlePageLoads)
      return;
    if (!this.running)
      this.start();
  }

  static handlePageLoaded() {
    // An internal page load was successfully completed; if we're handling those, run to finish
    if (!this.handlePageLoads)
      return;
    if (this.running)
      this.finish();
  }

  static setHandlePageLoads(shouldHandle) {
    this.handlePageLoads = !!shouldHandle;
  }

  // -------------------------------------------------------------------------------------------------------------------
  // Styling

  static setStyle(loadingBarStyle) {
    switch (loadingBarStyle) {
      default:
      case LoadingBarStyle.None:
        this.div.removeAttribute('style');
        break;
      case LoadingBarStyle.Blue:
        this.div.style.position = 'fixed';
        this.div.style.top = '0';
        this.div.style.right = '0';
        this.div.style.bottom = 'auto';
        this.div.style.left = '0';
        this.div.style.zIndex = '99999';
        this.div.style.height = '4px';
        this.div.style.background = 'linear-gradient(124deg, #3498db, #2980b9)';
        this.div.style.backgroundSize = '1800% 1800%';
        this.div.style.boxShadow = '0 0 1px 1px rgba(0, 0, 0, .1)';
        break;
    }
    this.div.style.transition = 'all .1s ease-in-out';
    this.div.style.pointerEvents = 'none';
    this.div.style.width = '0%';
    this.div.style.opacity = '0';
  }
}

export class LoadingBarStyle {
  static None = 0;
  static Blue = 1;
}