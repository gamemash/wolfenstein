

let MouseInput = {
  mouseDown: null,
  mouseUp: null,
  mouseMove: null,
  handleMouseDown: function(event){
    MouseInput.mouseDown = event;
    MouseInput.mouseMove = event;
  },
  handleMouseUp: function(event){
    MouseInput.mouseUp = event;
    MouseInput.mouseDown = null;
  },
  handleMouseMove: function(event){
    MouseInput.mouseMove = event;
  },
  registerOnCanvas: function(canvas){
    canvas.addEventListener("mousedown", MouseInput.handleMouseDown);
    canvas.addEventListener("mouseup", MouseInput.handleMouseUp);
    canvas.addEventListener("mousemove", MouseInput.handleMouseMove);
  }

};

module.exports = MouseInput;
