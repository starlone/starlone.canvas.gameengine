/* global se:true */
/* global Matter:true */
/* eslint no-undef: 'error' */

/*
  Scene
*/
se.Scene = function (parent, renderer) {
  this.parent = parent;
  this.camera = new se.GameObject('MainCamera', 0, 0, 0, 0);
  this.objs = [];
  this.colliders = [];
  this.add(this.camera);
  this.collisionsActive = {};

  if (renderer) {
    this.renderer = renderer;
  } else {
    this.renderer = new se.GradientRenderer('#8ED6FF', '#004CB3');
    this.renderer.setParent(this);
  }

  // create a Matter.js engine
  this.matterengine = Matter.Engine.create();
  this.matterengine.enableSleeping = true;
};

se.Scene.prototype.getWidth = function () {
  return this.parent.getWidth();
};

se.Scene.prototype.getHeight = function () {
  return this.parent.getHeight();
};

se.Scene.prototype.getCamera = function () {
  return this.camera;
};

se.Scene.prototype.getObjs = function () {
  return this.objs;
};

se.Scene.prototype.setParent = function (parent) {
  this.parent = parent;
};

se.Scene.prototype.add = function (obj) {
  this.objs.push(obj);
  obj.setParent(this);
  if (obj.rigidbody) {
    this.addBody(obj.rigidbody.body);
  }
  this.addColliders(obj.getColliders());
};

se.Scene.prototype.remove = function (obj) {
  var cs = obj.getColliders();
  for (var i = 0; i < cs.length; i++) {
    var c = cs[i];
    var inx = this.colliders.indexOf(c);
    if (inx !== -1) {
      this.colliders.splice(inx, 1);
    }
  }
  if (obj.rigidbody) {
    this.removeBody(obj.rigidbody.body);
  }

  var j = this.objs.indexOf(obj);
  if (j !== -1) {
    this.objs.splice(j, 1);
  }
};

se.Scene.prototype.addBody = function (body) {
  var engine = this.matterengine;
  Matter.World.add(engine.world, body);
};

se.Scene.prototype.removeBody = function (body) {
  var engine = this.matterengine;
  Matter.Composite.removeBody(engine.world, body);
};

se.Scene.prototype.addColliders = function (colliders) {
  for (var i = 0; i < colliders.length; i++) {
    var col = colliders[i];
    this.addCollider(col);
  }
};

se.Scene.prototype.addCollider = function (collider) {
  this.colliders.push(collider);
  collider.id = this.colliders.length - 1;
};

se.Scene.prototype.update = function (deltaTime, correction) {
  Matter.Engine.update(this.matterengine, deltaTime, correction);
  this.checkColliders();
  for (var i = 0; i < this.objs.length; i++) {
    var obj = this.objs[i];
    obj.update(deltaTime, correction);
  }
};

se.Scene.prototype.checkColliders = function () {
  var old = this.collisionsActive;
  this.collisionsActive = {};
  var news = [];
  for (var i = 0; i < this.colliders.length - 1; i++) {
    var colA = this.colliders[i];
    for (var j = i + 1; j < this.colliders.length; j++) {
      var colB = this.colliders[j];
      if (colA.isStatic && colB.isStatic) {
        continue;
      }
      if (colA.isIntersect(colB)) {
        var id = colA.id + '-' + colB.id;
        var c = {a: colA, b: colB};
        this.collisionsActive[id] = c;
        if (old[id] === undefined) {
          news.push(c);
        }
      }
    }
  }
  for (var k = 0; k < news.length; k++) {
    var co = news[k];
    co.a.resolveCollision(co.b);
    co.b.resolveCollision(co.a);
  }
};

se.Scene.prototype.render = function (ctx) {
  for (var i = 0; i < this.objs.length; i++) {
    this.objs[i].render(ctx);
  }
};

se.Scene.prototype.clone = function (parent) {
  var scene = new se.Scene(parent, this.renderer);
  var objs = this.getObjs();
  for (var i = 0; i < objs.length; i++) {
    var obj = objs[i];
    var newobj = obj.clone();
    scene.add(newobj);
  }
  return scene;
};

