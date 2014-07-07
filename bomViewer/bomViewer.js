$(function() {
  $("#bomTree").fancytree({
    source: [
      {title: "window", key: "window", folder: true, lazy: true, data: { obj: window }}
    ],
    checkbox: false,
    lazyLoad: function(event, data) {
      var node = data.node;
      var object = node.data.obj;
      var result = [];
      for(property in object) {
        var propertyType = typeof object[property];
        switch(propertyType) {
          case "object":
            result.push({title: property, key: node.key + "." + property, folder: true, lazy: true, data: { obj : object[property]}});
            break;
          case "function":
            var func = object[property].toString();
            if(func.indexOf("function (") == 0)
              func = func.substring(0, 9) + property + func.substring(9);
            result.push({title: func, key: node.key + "." + property, folder: false, lazy: false});
            break;
          default:
            result.push({title: property + " = '" + object[property] + "'", key: node.key + "." + property, folder: false, lazy: false});
            break;
        }
      }
      console.log("Adding " + result.length + " children to " + node.key);
      data.result = result;
    }
  });
  var bomTree = $("#bomTree").fancytree("getTree");
  var root = bomTree.getFirstChild();
  root.setExpanded(true);
});