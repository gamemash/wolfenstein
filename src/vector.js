let Vector = function(x, y){
  this.x = x || 0;
  this.y = y || 0;
}
Vector.min = function(a, b){
  return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y));
}

Object.assign(Vector.prototype, {
  floor: function(){
    return new Vector(Math.floor(this.x), Math.floor(this.y));
  },
  subtract: function(a){
    return new Vector(this.x - a.x, this.y - a.y);
  },
  abs: function(){
    return new Vector(Math.abs(this.x), Math.abs(this.y));
  },
  addScalar: function(scalar){
    return new Vector(this.x + scalar, this.y + scalar);
  },
  divide: function(a){
    return new Vector(this.x / a.x, this.y / a.y);
  },
  divideScalar: function(scalar){
    return new Vector(this.x / scalar, this.y / scalar);
  },
  multiply: function(a){
    return new Vector(this.x * a.x, this.y * a.y);
  },
  multiplyScalar: function(scalar){
    return new Vector(this.x * scalar, this.y * scalar);
  },
  toArray: function(){
    return [this.x, this.y];
  }
});

console.log(new Vector(1.5, 1).floor());
module.exports = Vector;




//module.exports = {
//  create: function(x, y){
//    return { x: x, y: y};
//  },
//  divide: function(a, b){
//    return this.create(a.x / b.x, a.y / b.y);
//  },
//  divideScalar: function(a, scalar){
//    return this.create(a.x / scalar, a.y / scalar);
//  },
//  multiply: function(a, b){
//    return this.create(a.x * b.x, a.y * b.y);
//  },
//  multiplyScalar: function(a, scalar){
//    return this.create(a.x * scalar, a.y * scalar);
//  },
//  subtract: function(a, b){
//    return this.create(a.x - b.x, a.y - b.y);
//  },
//  add: function(a, b){
//    return this.create(a.x + b.x, a.y + b.y);
//  },
//  addScalar: function(a, scalar){
//    return this.create(a.x + scalar, a.y + scalar);
//  },
//  floor: function(a){
//    return this.create(Math.floor(a.x), Math.floor(a.y));
//  },
//  abs: function(a){
//    return this.create(Math.abs(a.x), Math.abs(a.y));
//  },
//  min: function(a, b){
//    return this.create(Math.min(a.x, b.x), Math.min(a.y, b.y));
//  },
//  toArray: function(a){
//    return [a.x, a.y];
//  }
//
//}
