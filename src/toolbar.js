let Selector = require('./selector.js');
let Vec2 = require('./vector.js');

let RectangleTool = {
  setup: function(container){
    let button = document.createElement('div');
    button.className += "tool";
    button.style.backgroundImage = 'url("/images/paint-rectangle.jpg")';
    button.addEventListener("click", function(){ Toolbar.setTool(RectangleTool, this) });
    container.appendChild(button);
  },
  use: function(world, action, cameraPosition, scale){
    let {up, down} = action;
    let startingPosition = Selector.eventToTileCoord(down, cameraPosition, scale);
    let endPosition = Selector.eventToTileCoord(up, cameraPosition, scale);

    let pos = Vec2.min(startingPosition, endPosition);
    let size = startingPosition.subtract(endPosition).abs().addScalar(1);
    for (let y = pos.y; y < pos.y + size.y; y += 1){
      for (let x = pos.x; x < pos.x + size.x; x += 1){

        if ((x - pos.x) % (size.x - 1) == 0 ||
          (y - pos.y) % (size.y - 1) == 0 || size.x == 1 || size.y == 1){
          world[x + y * 32].filled = true;
          world[x + y * 32].block = Toolbar.activeTile;
        }
      }
    }
    return world;
  }
};

let EraserTool = {
  setup: function(container){
    let button = document.createElement('div');
    button.className += "tool";
    button.style.backgroundImage = 'url("/images/paint-eraser.jpg")';
    button.addEventListener("click", function(){ Toolbar.setTool(EraserTool, this) });
    container.appendChild(button);
  },
  use: function(world, action, cameraPosition, scale){
    let {up, down} = action;
    let startingPosition = Selector.eventToTileCoord(down, cameraPosition, scale);
    let endPosition = Selector.eventToTileCoord(up, cameraPosition, scale);

    let pos = Vec2.min(startingPosition, endPosition);
    let size = startingPosition.subtract(endPosition).abs().addScalar(1);
    for (let y = pos.y; y < pos.y + size.y; y += 1){
      for (let x = pos.x; x < pos.x + size.x; x += 1){
        world[x + y * 32].filled = false;
      }
    }
    return world;
  }
};



let Toolbar = {
  activeTool: RectangleTool,
  activeTile: 0,
  setTool: function(tool, element){
    Toolbar.activeTool = tool;
    for(let i = 0; i < this.container.children.length; i += 1){
      let tool = this.container.children[i];
      if (tool.className.indexOf("active") > -1)
        tool.className = tool.className.substring(0, tool.className.indexOf("active"));
    }

    element.className += " active"; 
  },
  setup: function(img, aspects){
    this.container = document.getElementById('toolbar');
    EraserTool.setup(this.container);
    RectangleTool.setup(this.container);

    //for (let y = 0; y < aspects.y; y += 1){
    //  for (let x = 0; x < aspects.x; x += 1){
    //    let button = document.createElement('div');
    //    button.className += "tool";
    //    let position = new Vec2(-32, -32).multiply(new Vec2(x, y));
    //    button.style.backgroundPosition = "" + position.x + "px " + position.y + "px";
    //    button.addEventListener("click", function(){ Toolbar.setTool(x + y * aspects.x) });
    //    container.appendChild(button);
    //  }
    //}
  }
}
module.exports = Toolbar;
