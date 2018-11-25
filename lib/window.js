'use strict';

const { Box } = require('neo-blessed').widget;

module.exports = class Window extends Box {
  constructor(listView, contentView, options) {
    super(options);
    this._listView = listView;
    this._contentView = contentView;
    this.init();
  }

  init() {
    this.append(this.listView);
    this.append(this.contentView);
    this.listView.on('select', (item, index) => this.onItemSelected(item, index));
    this.listView.on('keypress', (_, key) => {
      if (key.name === 'space') this.listView.enterSelected();
    });
  }

  setContentCallback(cb) {
    this._getContent = cb;
  }

  onItemSelected(_, index) {
    this.contentView.setContent(this._getContent(index));
    this.contentView.resetScroll();
    this.contentView.show();
    this.listView.hide();
    this.screen.render();
    this.contentView.focus();
  }

  closeContentView() {
    this.listView.show();
    this.contentView.hide();
    this.screen.render();
    this.listView.focus();
  }

  get listView() {
    return this._listView;
  }

  get contentView() {
    return this._contentView;
  }
};
