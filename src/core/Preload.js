import Stim from "./Stim";
import Applicator from "./Applicator";

export default class Preload {
  constructor(href) {
    this.href = href;
    this.done = false;
    this.committed = false;
    this.stopped = false;
    this.historyMode = false;

    this.xhr = new XMLHttpRequest();
    this.xhr.addEventListener('load', this.handleLoad.bind(this));
  }

  start() {
    Stim.debug('[Preload]', '(Starting)', this.href);

    this.xhr.open('GET', this.href);
    this.xhr.send();
  }

  commit() {
    Stim.debug('[Preload]', '(Committing)', this.href);

    this.committed = true;

    if (this.done) {
      this.apply();
    }
  }

  apply() {
    if (this.done) {
      Stim.debug('[Preload]', '(Applying)', this.href);
      Applicator.handleXhrResult(this.href, this.xhr, !this.historyMode);
    } else {
      Stim.debug('[Preload]', '(Can\'t apply preload that isn\'t done!)', this.href);
    }
  }

  abort(reason) {
    this.stopped = true;

    try {
      this.xhr.abort();
      Stim.debug('[Preload]', '(Aborted)', this.href, reason);
    } catch (e) {
      Stim.debug('[Preload]', '(Abort failed)', this.href, e, reason);
    }
  }

  handleLoad() {
    Stim.debug('[Preload]', '(Load complete)', this);

    this.done = true;

    if (this.committed) {
      this.apply();
    }
  }
}