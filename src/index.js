import Stim from './core/Stim';
function __stimReadyHook(fnAfter) {
  if (document.readyState !== 'loading'){
    fnAfter();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      fnAfter();
    });
  }
}
__stimReadyHook(Stim.bootstrap);