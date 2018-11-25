'use strict';

module.exports = (Box, { pagedown, pageup } = {}) => class extends Box {
  constructor(options) {
    super({ ...options, scrollable: true });
    if (pagedown) this.key(pagedown, this.pageDown);
    if (pageup) this.key(pageup, this.pageUp);
  }

  get pageHeight() {
    return this.height - this.iheight;
  }

  get pageCount() {
    return Math.ceil(this.getScrollHeight() / this.pageHeight);
  }

  get currentPage() {
    const top = this.childBase;
    const bottom = Math.min(this.childBase + this.pageHeight, this.getScrollHeight());
    const page = Math.floor(bottom / this.pageHeight);
    const visibleAmount = (bottom % this.pageHeight) / (bottom - top);
    return visibleAmount > 0.5 ? page : page - 1;
  }

  pageUp() {
    const prev = Math.max(this.currentPage - 1, 0);
    this.setScroll(prev * this.pageHeight);
    if (this.select) this.select(prev * this.pageHeight);
    this.screen.render();
  }

  pageDown() {
    const next = Math.min(this.currentPage + 1, this.pageCount - 1);
    this.setScroll((next + 1) * this.pageHeight - 1);
    if (this.select) this.select(next * this.pageHeight);
    this.screen.render();
  }
};
