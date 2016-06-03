let Selector = require('./selector.js');
let Vec2 = require('./vector.js');

let RectangleTool = {
  setup: function(container){
    let button = document.createElement('div');
    button.className += "tool";
    button.style.backgroundImage = 'url("/images/paint-rectangle.jpg")';
    button.addEventListener("click", function(){ Toolbar.setTool(RectangleTool, this) });
    this.button = button;
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
    this.button = button;
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


let TilePicker = {
  shown: false,
  setup: function(container, aspects){
    this.aspects = aspects;

    let currentTile = this.currentTile = document.createElement('div');
    currentTile.className += "tile activeTile";
    currentTile.addEventListener("mousemove", this.show.bind(this));
    this.updateActiveTile();
    container.appendChild(currentTile);

    let list = this.list = document.createElement('img');
    list.className += 'tileList';
    list.src =  "/images/walls.png";
    list.style.height = aspects.y * 32 + "px";
    list.addEventListener("mouseup", this.select.bind(this));
    list.addEventListener("mouseout", this.hide.bind(this));
    container.appendChild(list);
  },
  updateActiveTile: function(){
    let tileCoord = new Vec2(Toolbar.activeTile % this.aspects.x, Math.floor(Toolbar.activeTile / this.aspects.x));
    let position = new Vec2(-32, -32).multiply(tileCoord);
    this.currentTile.style.backgroundPosition = "" + position.x + "px " + position.y + "px";
  },
  select: function(event){
    let pos = new Vec2(event.offsetX, event.offsetY).divideScalar(32).floor();
    let id = pos.x + pos.y * this.aspects.x;
    Toolbar.activeTile = id;
    this.updateActiveTile();
    this.hide();
  },
  show: function(event){
    if (!this.shown){
      this.list.style.display = 'block';
      this.shown = true;
    }

  },
  hide: function(event){
    this.list.style.display = 'none';
    this.shown = false;
  }
};



let Toolbar = {
  activeTool: RectangleTool,
  activeTile: 0,
  setTool: function(tool, element){
    Toolbar.activeTool = tool;
    for(let i = 0; i < this.container.children.length; i += 1){
      let tool = this.container.children[i];
      if (tool.className.indexOf("tool") > -1 && tool.className.indexOf("active") > -1)
        tool.className = tool.className.substring(0, tool.className.indexOf("active"));
    }

    element.className += " active"; 
  },
  setup: function(img, aspects){
    this.container = document.getElementById('toolbar');
    EraserTool.setup(this.container);
    RectangleTool.setup(this.container);
    this.setTool(RectangleTool, RectangleTool.button);

    TilePicker.setup(this.container, aspects);
  }
}
module.exports = Toolbar;
