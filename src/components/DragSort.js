export default class DragSort {
  static update() {
    this.draggingRoot = null;
    this.draggingElement = null;
    this.ghostElement = null;
    this.spacerGhostElement = null;
    this.dragSwapElement = null;

    if (!this.docEventsBound) {
      document.addEventListener("mouseup", this.stopDragging.bind(this));
      document.addEventListener("mousemove", this.moveDragging.bind(this));
      this.docEventsBound = true;
    }

    let dragSorts = document.querySelectorAll('*[stim-dragsort]');
    for (let i = 0; i < dragSorts.length; i++) {
      DragSort.configureDragSort(dragSorts[i]);
    }
  }

  static configureDragSort(dragSort) {
    let draggableChildren = dragSort.querySelectorAll('*[stim-draggable]');
    draggableChildren.forEach((draggable) => {
      // Bind handles
      let handles = draggable.querySelectorAll('*[stim-handle]');
      handles.forEach((handle) => {
        if (!handle.getAttribute('stim-bound')) {
          handle.addEventListener("mousedown", (e) => {
            e.preventDefault();
            this.startDragging(dragSort, draggable, e);
            return false;
          });
          handle.setAttribute('stim-bound', true);
        }
      });
    });
  }

  static startDragging(dragSort, draggable, e) {
    this.draggingRoot = dragSort;
    this.draggingElement = draggable;

    let draggableRect = draggable.getBoundingClientRect();

    this.spacerGhostElement = document.createElement(draggable.nodeName);
    this.spacerGhostElement.className = draggable.className;
    this.spacerGhostElement.classList.add('stim-spacer');
    this.spacerGhostElement.innerHTML = draggable.innerHTML;
    this.spacerGhostElement.style.position = 'absolute';
    this.spacerGhostElement.style.height = `${draggableRect.height}px`;
    this.spacerGhostElement.style.width = `${draggableRect.width}px`;
    this.spacerGhostElement.style.pointerEvents = 'none';
    dragSort.appendChild(this.spacerGhostElement);

    this.ghostElement = document.createElement(draggable.nodeName);
    this.ghostElement.className = draggable.className;
    this.ghostElement.classList.add('stim-ghost');
    this.ghostElement.innerHTML = draggable.innerHTML;
    this.ghostElement.style.position = 'fixed';
    this.ghostElement.style.height = `${draggableRect.height}px`;
    this.ghostElement.style.width = `${draggableRect.width}px`;
    this.ghostElement.style.pointerEvents = 'none';
    this.ghostElement.style.opacity = '.75';
    this.ghostElement.style.zIndex = 999;
    dragSort.appendChild(this.ghostElement);

    if (draggable.nodeName.toLowerCase() === "tr") {
      this.spacerGhostElement.style.position = 'relative';
    }

    dragSort.classList.add('stim-dragging-root');
    dragSort.style.pointerEvents = 'none';
    dragSort.style.cursor = 'grabbing';
    draggable.classList.add('stim-dragging');
    draggable.style.display = 'none';

    this.moveDragging(e);
  }

  static stopDragging() {
    if (this.draggingRoot && this.draggingElement && this.dragSwapElement) {
      // Finish drag success!
      this.draggingRoot.insertBefore(this.draggingElement, this.dragSwapElement);
      this.draggingRoot.dispatchEvent(new CustomEvent('stim-dragsort-finish', {
        detail: {
          dragSort: this.draggingRoot,
          element: this.draggingElement
        },
        cancelable: false,
        bubbles: true
      }));
    }

    if (this.draggingRoot) {
      this.draggingRoot.classList.remove('stim-dragging-root');
      this.draggingRoot.style.pointerEvents = null;
      this.draggingRoot.style.cursor = null;
    }

    if (this.draggingElement) {
      this.draggingElement.classList.remove('stim-dragging');
      this.draggingElement.style.display = null;
      this.draggingElement = null;
    }

    if (this.spacerGhostElement) {
      this.spacerGhostElement.remove();
      this.spacerGhostElement = null;
    }

    if (this.ghostElement) {
      this.ghostElement.remove();
      this.ghostElement = null;
    }

    this.lastClientX = null;
    this.lastClientY = null;
  }

  static moveDragging(e) {
    if (!this.draggingElement)
      return;

    let diffX = e.clientX - this.lastClientX;
    let diffY = e.clientY - this.lastClientY;

    this.ghostElement.style.left = `${e.clientX}px`;
    this.ghostElement.style.top = `${e.clientY}px`;

    let childIndex = 0;
    let childMax = this.draggingRoot.firstChild;

    let draggableChildren = this.draggingRoot.querySelectorAll('*[stim-draggable]');
    draggableChildren.forEach((child) => {
      if (child.classList.contains('stim-ghost') || child.classList.contains('stim-dragging'))
        return;

      let childBox = child.getBoundingClientRect();

      if (e.clientY >= (childBox.y + (childBox.height / 2))) {
        childIndex++;
        childMax = child;
      }
    });

    if (childMax.nextSibling) {
      this.draggingRoot.insertBefore(this.spacerGhostElement, childMax.nextSibling);
      this.dragSwapElement = childMax.nextSibling;
    }
  }
}