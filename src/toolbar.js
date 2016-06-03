let Vec2 = require('./vector.js');
let Toolbar = {
  activeTool: 0,
  setTool: function(id){
    Toolbar.activeTool = id;
  },
  setup: function(img, aspects){
    let container = document.getElementById('toolbar');
    for (let y = 0; y < aspects.y; y += 1){
      for (let x = 0; x < aspects.x; x += 1){
        let button = document.createElement('div');
        button.className += "tool";
        let position = new Vec2(-32, -32).multiply(new Vec2(x, y));
        button.style.backgroundPosition = "" + position.x + "px " + position.y + "px";
        button.addEventListener("click", function(){ Toolbar.setTool(x + y * aspects.x) });
        container.appendChild(button);
      }
    }
    //var canvas = document.createElement('canvas');
    //var context = canvas.getContext('2d');
    //context.drawImage(img, 0, 0 );
    //var myData = context.getImageData(0, 0, img.width, img.height);
    //console.log(myData);
  }
}
module.exports = Toolbar;
