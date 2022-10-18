export default class Modals {
  static update() {
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.dragModal = null;

    if (!this.docEventsBound) {
      document.addEventListener("mouseup", this.handleDragEnd.bind(this));
      document.addEventListener("mousemove", this.handleDragMove.bind(this));

      window.addEventListener("resize", this.handleDragEnd.bind(this));
      window.addEventListener("onfocus", this.handleDragEnd.bind(this));
      window.addEventListener("blur", this.handleDragEnd.bind(this));

      this.docEventsBound = true;
    }

    let modals = document.querySelectorAll('*[stim-modal]');
    for (let i = 0; i < modals.length; i++) {
      const modal = modals[i];
      Modals.configureModal(modal.getAttribute('stim-modal'), modal);
    }
  }

  static handleDragEnd(e) {
    if (!this.isDragging)
      return;

    this.isDragging = false;

    if (!this.dragModal)
      return;

    this.finalizeModalPosition(this.dragModal);
  }

  static handleDragMove(e) {
    if (!this.isDragging || !this.dragModal)
      return;

    const rect = this.dragModal.getBoundingClientRect();

    const x = rect.left + (e.clientX - this.dragStartX);
    const y = rect.top + (e.clientY - this.dragStartY);

    this.dragModal.style.left = `${x}px`;
    this.dragModal.style.top = `${y}px`;

    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
  }

  static finalizeModalPosition(modal) {
    const rect = modal.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0)
      return;

    const marginPx = 5;

    const minX = marginPx;
    const maxX = (window.innerWidth - rect.width - marginPx);
    if (rect.x <= minX)
      modal.style.left = `${minX}px`;
    else if (rect.x >= maxX)
      modal.style.left = `${maxX}px`;

    const minY = marginPx;
    const maxY = (window.innerHeight - rect.height - marginPx);
    if (rect.y <= minY)
      modal.style.top = `${minY}px`;
    else if (rect.y >= maxY)
      modal.style.top = `${maxY}px`;

    if (modal.getAttribute("stim-modal") === "persist") {
      const windowId = modal.getAttribute("stim-id");
      localStorage.setItem(windowId, JSON.stringify(modal.getBoundingClientRect()));
    }
  }

  static configureModal(mode, element) {
    const windowId = "modal:" + (element.id || "") + "#" + element.className;

    const handles = element.querySelectorAll('*[stim-handle]');
    for (let i = 0; i < handles.length; i++) {
      const handle = handles[i];
      handle.style.cursor = 'move';
      handle.addEventListener("mousedown", (e) => {
        this.isDragging = true;
        this.dragModal = element;
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
      });
    }

    element.style.position = 'fixed';

    if (mode === "persist") {
      try {
        const storedRect = JSON.parse(localStorage.getItem(windowId));
        if (storedRect && storedRect.x && storedRect.y) {
          element.style.left = `${storedRect.x}px`;
          element.style.top = `${storedRect.y}px`;
        }
      } catch (e) {
        // JSON parse error
      }
    }

    element.setAttribute("stim-bound", true);
    element.setAttribute("stim-id", windowId);

    setTimeout(() => {
      this.finalizeModalPosition(element);
    }, 100);
  }
}
