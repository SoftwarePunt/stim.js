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
      Modals.configureModal(modals[i]);
    }
  }

  static handleDragEnd(e) {
    if (!this.isDragging)
      return;

    this.isDragging = false;

    if (!this.dragModal)
      return;

    const rect = this.dragModal.getBoundingClientRect();
    const marginPx = 5;

    const minX = marginPx;
    const maxX = (window.innerWidth - rect.width - marginPx);
    if (rect.x <= minX)
      this.dragModal.style.left = `${minX}px`;
    else if (rect.x >= maxX)
      this.dragModal.style.left = `${maxX}px`;

    const minY = marginPx;
    const maxY = (window.innerHeight - rect.height - marginPx);
    if (rect.y <= marginPx)
      this.dragModal.style.top = `${marginPx}px`;
    else if (rect.y >= maxY)
      this.dragModal.style.top = `${maxY}px`;

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

  static configureModal(element) {
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
    element.setAttribute("stim-bound", true);
  }
}
