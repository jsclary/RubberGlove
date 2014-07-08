var bomOverloadFunction = function() {
  function fakeNativeCode(name, func) {
    Object.defineProperty(func, 'toString', { configurable: false, value: function() {
      return 'function ' + name + '() { [native code] }';
    }});
    return func;
  }
  var navWrapper = (function() {
    var oldNavigator = navigator;
    var altNav = {};
    var propertyNames = Object.getOwnPropertyNames(oldNavigator);
    for(var propertyIndex = 0; propertyIndex < propertyNames.length; propertyIndex++) {
      propertyName = propertyNames[propertyIndex];

      // Get the Property Descriptor
      var descriptor = Object.getOwnPropertyDescriptor(navigator, propertyName);

      // Delete any values we'll be replacing
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

      switch(propertyName) {

        // Wrap the navigator.plugins object
        case 'plugins':
          console.log('RubberGlove: Cloaking plugins for ' + window.location.href);
          var plugins = { };
          Object.defineProperty(plugins, 'length', { 'get': fakeNativeCode("", (function() {
            var eventNode = document.currentScript.parentNode;
            return function() {
              console.error('RubberGlove: Iteration of navigator.plugins blocked for ' + window.location.href + ' (Informational, not an error.)');
              window.postMessage({ type: 'RubberGlove', text: 'navigator.plugins', url: window.location.href }, '*');
              return 0;
            };
          })()), enumerable: true});
          if(typeof descriptor.get == 'function') delete descriptor['get'];
          plugins.item = fakeNativeCode('item', (function() {
            var fakePlugins = plugins;
            return function(index) { return fakePlugins[index]; };
          })());
          plugins.namedItem = fakeNativeCode('namedItem', (function() {
            var fakePlugins = plugins;
            return function(name) { return fakePlugins[name]; };
          })());
          plugins.refresh = fakeNativeCode('refresh', (function() {
            var fakePlugins = plugins;
            var realPlugins = oldNavigator.plugins;
            return function() {
              // Refresh the real plugins list
              // TODO: We probably shouldn't call this the first time if possible
              realPlugins.refresh();
              // Remove any plugins we already have
              var propNames = Object.getOwnPropertyNames(oldNavigator);
              for(var i = 0; i < propNames.length; i++) {
                var property = propNames[propertyIndex];
                if(property != 'length') delete fakePlugins[property];
              }
              // Add plugins so they are accessible by key but not index
              for(var n = 0; n < realPlugins.length; n++) {
                var plugin = realPlugins[n];
                //console.log('RubberGlove: Cloaking \'' + plugin.name + '\'');
                if(typeof plugin.name != 'undefined' && plugin.name != null && plugin.name != '')
                  Object.defineProperty(fakePlugins, plugin.name, { 'value': plugin, configurable: true });
              }
            };
          })());
          // Refresh to initially populate the plugins
          plugins.refresh();
          descriptor.value = plugins;
          break;

        // Wrap the navigator.mimeTypes object
        case 'mimeTypes':
          console.log('RubberGlove: Cloaking mimeTypes for ' + window.location.href);
          var mimeTypes = { };
          Object.defineProperty(mimeTypes, 'length', { 'get': fakeNativeCode("", (function() {
            var eventNode = document.currentScript.parentNode;
            return function() {
              console.error('RubberGlove: Iteration of navigator.mimeTypes blocked for ' + window.location.href + ' (Informational, not an error.)');
              window.postMessage({ type: 'RubberGlove', text: 'navigator.mimeTypes', url: window.location.href }, '*');
              return 0;
            };
          })()), enumerable: true});
          if(typeof descriptor.get == 'function') delete descriptor['get'];
          mimeTypes.item = fakeNativeCode('item', (function() {
            var fakeMimeTypes = mimeTypes;
            return function(index) { return fakeMimeTypes[index]; };
          })());
          // Add mimeTypes so they are accessible by key but not index
          for(var n = 0; n < oldNavigator.mimeTypes.length; n++) {
            var mimeType = oldNavigator.mimeTypes[n];
            //console.log('RubberGlove: Cloaking \'' + mimeType.type + '\'');
            if(typeof mimeType.type != 'undefined' && mimeType.type != null && mimeType.type != '')
              Object.defineProperty(mimeTypes, mimeType.type, { 'value': mimeType, configurable: true });
          }
          descriptor.value = mimeTypes;
          break;

        // wrap any non-object properties of navigator
        default:
          //console.log("RubberGlove: wrapping " + propertyName);
          descriptor.get = fakeNativeCode("", (function() {
            var prop = propertyName;
            var nav = oldNavigator;
            return function() { return nav[prop] };
          })());
          if(writable) {
            descriptor.set = fakeNativeCode("", (function(value) {
              var prop = propertyName;
              var nav = oldNavigator;
              return function() { nav[prop] = value; };
            })());
          }
          break;
      }
      Object.defineProperty(altNav, propertyName, descriptor);
    }

    // Add any functions
    for(propertyName in oldNavigator) {
      if(typeof(oldNavigator[propertyName]) == "function") {
        switch(propertyName) {
          default:
            //console.log("RubberGlove: Wrapping function " + propertyName + "()");
            altNav[propertyName] = oldNavigator[propertyName];
            break;
        }
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
