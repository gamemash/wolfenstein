function ShaderLoader(){
  this.shaders = {};
  this.shaderPromises = {};

  this.load = function(filename){
    var me = this;
    if (this.shaderPromises[filename]){
      return this.shaderPromises[filename];
    }

    var promise = new Promise(function(resolve, reject) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
          if (xhttp.readyState == 4 && xhttp.status == 200){
            me.save(filename, xhttp.responseText);
            resolve(xhttp.responseText);
          }
        }
      xhttp.open("GET", "shaders/" + filename, true);
      xhttp.send();
    });

    this.shaderPromises[filename] = promise;

    return promise;
  }

  this.save = function(filename, content){
    this.shaders[filename] = content;
  }

  this.get = function(filename){
    return this.shaders[filename];
  }

}

module.exports = new ShaderLoader;

