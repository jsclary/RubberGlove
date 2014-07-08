var bomOverloadFunction = function() {
  var navWrapper = (function() {
    var oldNavigator = navigator;
    var altNav = {};
    var propertyNames = Object.getOwnPropertyNames(oldNavigator);
    for(var propertyIndex = 0; propertyIndex < propertyNames.length; propertyIndex++) {
      propertyName = propertyNames[propertyIndex];
      var descriptor = Object.getOwnPropertyDescriptor(navigator, propertyName);
      if(typeof descriptor.value != 'undefined') delete descriptor['value'];
      if(typeof descriptor.get != 'undefined') delete descriptor['get'];
      var writable = false;
      if(typeof descriptor.set != 'undefined') {
        delete descriptor['set'];
        writable = true;
      }
      if(typeof descriptor.writable != 'undefined') {
        if(descriptor.writable == 'true') writable = true;
        delete descriptor['writable'];
      }
      if(propertyName == 'plugins') {
        console.log('RubberGlove: Cloaking plugins for ' + window.location.href);
        var plugins = { };
        Object.defineProperty(plugins, 'length', { 'get': function() {
          var eventNode = document.currentScript.parentNode;
          return function() {
            console.error('RubberGlove: Iteration of navigator.plugins blocked for ' + window.location.href);
            window.postMessage({ type: 'RubberGlove', text: 'navigator.plugins' }, '*');
            return 0;
          };
        }(), enumerable: true});
        if(typeof descriptor.get == 'function') delete descriptor['get'];
        plugins.item = function() {
          var item = function(index) { return; };
          item.toString = function() { return "function item() { [native code] }"; };
          return item; // function(index) { return item(index); };
        }();
        plugins.namedItem = function() {
          var fakePlugins = plugins;
          var namedItem = function(name) { return fakePlugins[name]; };
          namedItem.toString = function() { return "function namedItem() { [native code] }"; };
          return namedItem; //function(name) { return namedItem(name); };
        }();
        plugins.refresh = function() {
          var fakePlugins = plugins;
          var realPlugins = oldNavigator.plugins;
          var refresh = function() {
            realPlugins.refresh();
            for(var property in fakePlugins) {
              if(property != 'refresh' && property != 'item' && property != 'namedItem' && property != 'length')
                delete fakePlugins[property];
            }
            for(var n = 0; n < realPlugins.length; n++) {
              var plugin = realPlugins[n];
              //console.log('RubberGlove: Cloaking \'' + plugin.name + '\'');
              if(typeof plugin.name != 'undefined' && plugin.name != null && plugin.name != '' && plugin.name != ' ')
                Object.defineProperty(fakePlugins, plugin.name, { 'value': plugin });
            }
          };
          refresh.toString = function() { return "function refresh() { [native code] }"; };
          return refresh; //function() { return refresh(name); };
        }();
        plugins.refresh();
        descriptor.value = plugins;
      } else if(propertyName == 'mimeTypes') {
        console.log('RubberGlove: Cloaking mimeTypes for ' + window.location.href);
        var mimeTypes = { };
        Object.defineProperty(mimeTypes, 'length', { 'get': function() {
          var eventNode = document.currentScript.parentNode;
          return function() {
            console.error('RubberGlove: Iteration of navigator.mimeTypes blocked for ' + window.location.href);
            window.postMessage({ type: 'RubberGlove', text: 'navigator.mimeTypes' }, '*');
            return 0;
          };
        }(), enumerable: true});
        if(typeof descriptor.get == 'function') delete descriptor['get'];
        mimeTypes.item = function() {
          var item = function(index) { return; };
          item.toString = function() { return "function item() { [native code] }"; };
          return item; // function(index) { return item(index); };
        }();
        for(var n = 0; n < oldNavigator.mimeTypes.length; n++) {
          var mimeType = oldNavigator.mimeTypes[n];
          //console.log('RubberGlove: Cloaking \'' + mimeType.type + '\'');
          if(typeof mimeType.type != 'undefined' && mimeType.type != null && mimeType.type != '' && mimeType.type != ' ')
            Object.defineProperty(mimeTypes, mimeType.type, { 'value': mimeType });
        }
        descriptor.value = mimeTypes;
      } else {
        //console.log("RubberGlove: wrapping " + propertyName);
        descriptor.get = function() {
          var prop = propertyName;
          var nav = oldNavigator;
          return function() { return nav[prop] };
        }();
        if(writable) {
          descriptor.set = function(value) {
            var prop = propertyName;
            var nav = oldNavigator;
            return function() { nav[prop] = value; };
          }();
        }
      }
      Object.defineProperty(altNav, propertyName, descriptor);
    }
    for(propertyName in oldNavigator) {
      if(typeof(oldNavigator[propertyName]) == "function") {
        //console.log("RubberGlove: Wrapping function " + propertyName + "()");
        altNav[propertyName] = oldNavigator[propertyName];
      }
    }
    return altNav;
  })();

  Object.defineProperty(window, 'navigator', {
    enumerable: true,
    configurable: false,
    writable: true,
    value: navWrapper
  });

  Object.defineProperty(window, 'clientInformation', {
    enumerable: true,
    configurable: false,
    writable: true,
    value: navWrapper
  });
}
