
/*
   Circle Rigid Body based in matter
*/
se.CircleRigidBodyMatter = function (options){
    this.options = options;
};


se.CircleRigidBodyMatter.prototype.createBody = function (){
    var obj = this.parent;
    var pos = obj.transform.position;
    options = this.options || {};
    var x = options.x || pos.x;
    var y = options.y || pos.y;
    var r = options.radius || radius;

	this.body = Matter.Bodies.circle(x, y, r, {isStatic: obj.isStatic, canRotate: obj.canRotate});
};


se.CircleRigidBodyMatter.prototype.update = function (deltaTime){
    var pos = this.parent.transform.position;   
    pos.x = this.body.position.x;
    pos.y = this.body.position.y;
    this.parent.angle = this.body.angle;
};

se.CircleRigidBodyMatter.prototype.setParent = function (parent){
    this.parent = parent;
    this.createBody();
};


se.CircleRigidBodyMatter.prototype.setVelocity = function (velocity){
    Matter.Body.setVelocity(this.body, velocity);
};

se.CircleRigidBodyMatter.prototype.applyForce = function (position, force){
    Matter.Body.applyForce(this.body, position, force);
};



