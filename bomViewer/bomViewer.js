$(function() {
  $("#bomTree").fancytree({
    source: [
      {title: "<b>window</b>", key: "window", folder: true, lazy: true, data: { obj: window }, icon: "images/ClassIcon.png"}
    ],
    checkbox: false,
    lazyLoad: function(event, data) {
      var node = data.node;
      var object = node.data.obj;
      var result = [];
      if(object != null) {

        if(typeof object.constructor != 'undefined' && object.constructor !== object) {
          var func = "constructor: " + object.constructor.toString();
          result.push({title: func, key: node.key + ".constructor", folder: true, lazy: true, data: {obj: object.constructor}, icon: "images/Function_8941.png"});
        }

        var propertyNames = Object.getOwnPropertyNames(object);
        for(var propertyIndex = 0; propertyIndex < propertyNames.length; propertyIndex++) {
          var propertyName = propertyNames[propertyIndex];
          if(propertyName == "constructor") continue;
          var propertyType = typeof object[propertyName];
          var propertyDescriptor = Object.getOwnPropertyDescriptor(object, propertyName);
          var enumerable = (typeof propertyDescriptor.enumerable != 'undefined' && propertyDescriptor.enumerable == true);
          var child = {
            title: enumerable ? "<b>" + propertyName + "</b>" : "<b style=\"color: lightgray;\">" + propertyName + "</b>",
            key: node.key + "." + propertyName,
            data: {obj: object[propertyName]},
          }
          switch(propertyType) {
            case "object":
              child.title += ": " + object[propertyName];
              child.icon = "images/ClassIcon.png";
              child.folder = object[propertyName] != null;
              child.lazy = object[propertyName] != null;
              break;
            case "function":
              child.title += ": " + object[propertyName].toString();
              child.folder = true;
              child.lazy = true;
              child.icon = "images/Function_8941.png";
              break;
            case "string":
              child.title += ": '" + object[propertyName] + "'";
              break;
            default:
              child.title += ": " + object[propertyName];
              child.icon = "images/PropertyIcon.png";
              break;
          }
          result.push(child);
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