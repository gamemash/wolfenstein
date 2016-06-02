

let MouseInput = {

  handleMouseDown: function(event){
    console.log(event);
  },
  registerOnCanvas: function(canvas){
    canvas.addEventListener("mousedown", MouseInput.handleMouseDown);
  }

};

module.exports = MouseInput;
