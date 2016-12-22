/* global se:true */
/* global window:true */
/* eslint no-undef: 'error' */

/*
  View Port
*/
se.ViewPort = function (elementID) {
  this.elementID = elementID;
  if (this.elementID) {
    this.element = window.document.getElementById(this.elementID);
  } else {
    this.element = window.document.body;
  }
  if (this.element.nodeName !== 'CANVAS') {
    var parent = this.element;
    this.element = window.document.createElement('canvas');
    parent.appendChild(this.element);
  }
  this.pivot = new se.Transform(this, 0, 0);

  if (this.element.getContext) {
    this.ctx = this.element.getContext('2d');
  }
};

se.ViewPort.prototype.getContext = function () {
  return this.ctx;
};

se.ViewPort.prototype.getWidth = function () {
  return this.element.width;
};

se.ViewPort.prototype.getHeight = function () {
  return this.element.height;
};

se.ViewPort.prototype.updatePivot = function (position) {
  // Reset draw
  this.ctx.setTransform(1, 0, 0, 1, 0, 0);

  var x = position.x - (this.getWidth() / 2);
  var y = position.y - (this.getHeight() / 2);
  this.pivot.change(x, y);
  this.ctx.translate(-x, -y);
};

se.ViewPort.prototype.clearframe = function () {
  this.ctx.clearRect(
    this.pivot.position.x,
    this.pivot.position.y,
    this.getWidth(),
    this.getHeight()
  );
};

se.ViewPort.prototype.render = function (scene) {
  this.updatePivot(scene.getCamera().transform.position);
  this.clearframe();
  this.renderBackground(scene);
  scene.render(this.ctx);
};

se.ViewPort.prototype.resetPivot = function () {
  this.pivot.change(0, 0);
};

se.ViewPort.prototype.renderBackground = function (scene) {
  scene.renderer.render(this.ctx, {
    x: this.pivot.position.x,
    y: this.pivot.position.y,
    width: this.getWidth(),
    height: this.getHeight()
  });
};

