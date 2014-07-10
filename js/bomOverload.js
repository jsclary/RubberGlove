function bomOverload() {
  if(config.local.verbose) console.log("RubberGlove: Creating PluginArray");
  function PluginArray() { // native(PluginArray)
    if(window.navigator.plugins.constructor === PluginArray)
      throw new TypeError("Illegal constructor");

    if(config.local.verbose) console.log("RubberGlove: Creating PluginArray instance");

    Object.defineProperty(this, 'length', {
      enumerable: true,
      get: (function(eventNode) {
        return function() {
          // native()
          console.error('RubberGlove: Iteration of window.navigator.plugins blocked for ' + window.location.href + ' (Informational, not an error.)');
          window.postMessage({
            type: 'RubberGlove',
            text: 'window.navigator.plugins',
            url: window.location.href
          }, '*');
          return 0;
        };
      })(document.currentScript.parentNode)
    });

    // Add hidden named plugins
    var plugins = window.navigator.plugins;
    for(var i = 0; i < plugins.length; i++) {
      var plugin = plugins[i];
      if(typeof plugin != 'undefined' && typeof plugin.name != 'undefined' && plugin.name != null) {
        Object.defineProperty(this, plugin.name, {
          configurable: true,
          value: plugin
        });
      }
    }
  }
  // Don't ask me why the real function has this...  It's not even a prototype.
  PluginArray.toString = function toString() { // native(toString)
    return Function.prototype.toString.apply(this, Array.prototype.slice.apply(arguments));
  };
  if(config.local.verbose) console.log("RubberGlove: Creating PluginArray.prototype.item()");
  PluginArray.prototype.item = function item() { // native(item)
    return this[arguments[0]];
  };
  if(config.local.verbose) console.log("RubberGlove: Creating PluginArray.prototype.namedItem()");
  PluginArray.prototype.namedItem = function namedItem() { // native(namedItem)
    return this[arguments[0]];
  };
  if(config.local.verbose) console.log("RubberGlove: Creating PluginArray.prototype.refresh()");
  PluginArray.prototype.refresh = (function(plugins) {
    if(config.local.verbose) console.log("RubberGlove: Returning our custom PluginArray.refresh()");
    return function refresh() { // native(refresh)
      // Refresh the real plugins list
      plugins.refresh.apply(plugins, Array.prototype.slice.apply(arguments));

      // Delete our existing set of plugins
      var propertyNames = Object.getOwnPropertyNames(this);
      for(var i = 0; i < propertyNames.length; i++) {
        var property = propertyNames[i];
        if(property != 'length') delete this[property];
      }

      // Add hidden named plugins
      for(var i = 0; i < plugins.length; i++) {
        var plugin = plugins[i];
        if(typeof plugin.name != 'undefined' && plugin.name != null) {
          Object.defineProperty(this, plugin.name, {
            configurable: true,
            value: plugin
          });
        }
      }
    }
  })(window.navigator.plugins);
  if(config.local.verbose) console.log("RubberGlove: Replacing window.PluginArray");
  Object.defineProperty(window, 'PluginArray', {
    enumerable: false,
    configurable: false,
    writable: true,
    value: PluginArray
  });

  // TODO: This should refresh as well when PluginArray.refresh() is called.
  if(config.local.verbose) console.log("RubberGlove: Creating MimeTypeArray");
  function MimeTypeArray() { // native(MimeTypeArray)
    if(window.navigator.mimeTypes.constructor === MimeTypeArray)
      throw new TypeError("Illegal constructor");

    if(config.local.verbose) console.log("RubberGlove: Creating MimeTypeArray instance");

    Object.defineProperty(this, 'length', {
      enumerable: true,
      get: (function(eventNode) {
        return function() {
          // native()
          console.error('RubberGlove: Iteration of window.navigator.mimeTypes blocked for ' + window.location.href + ' (Informational, not an error.)');
          window.postMessage({
            type: 'RubberGlove',
            text: 'window.navigator.mimeTypes',
            url: window.location.href
          }, '*');
          return 0;
        };
      })(document.currentScript.parentNode)
    });

    // Add hidden named mimeTypes
    var mimeTypes = window.navigator.mimeTypes;
    for(var i = 0; i < mimeTypes.length; i++) {
      var mimeType = mimeTypes[i];
      if(typeof mimeType != 'undefined' && typeof mimeType.type != 'undefined' && mimeType.type != null) {
        Object.defineProperty(this, mimeType.type, {
          configurable: true,
          value: mimeType
        });
      }
    }
  }
  // Don't ask me why the real function has this...  It's not even a prototype.
  MimeTypeArray.toString = function toString() { // native(toString)
    return Function.prototype.toString.apply(this, Array.prototype.slice.apply(arguments));
  };
  // Yes, these duplicate the ones for PluginArray.  No, they should
  // not use the same functions as they shouldn't test as equal.
  if(config.local.verbose) console.log("RubberGlove: Creating MimeTypeArray.prototype.item()");
  MimeTypeArray.prototype.item = function item(index) { // native(item)
    return this[arguments[0]];
  };
  if(config.local.verbose) console.log("RubberGlove: Creating MimeTypeArray.prototype.namedItem()");
  MimeTypeArray.prototype.namedItem = function namedItem(name) { // native(namedItem)
    return this[arguments[0]];
  };
  if(config.local.verbose) console.log("RubberGlove: Replacing window.MimeTypeArray");
  Object.defineProperty(window, 'MimeTypeArray', {
    enumerable: false,
    configurable: false,
    writable: true,
    value: MimeTypeArray
  });

  if(config.local.verbose) console.log("RubberGlove: Creating Navigator");
  function Navigator() { // native(Navigator)
    if(window.navigator.constructor === Navigator)
      throw new TypeError("Illegal constructor");

    if(config.local.verbose) console.log("RubberGlove: Creating Navigator instance");

    var propertyNames = Object.getOwnPropertyNames(window.navigator);
    for(var propertyIndex = 0; propertyIndex < propertyNames.length; propertyIndex++) {
      var propertyName = propertyNames[propertyIndex];
      var descriptor = Object.getOwnPropertyDescriptor(window.navigator, propertyName);
      var writable = descriptor.writable == true || typeof descriptor.set == 'function';

      delete descriptor.value;
      delete descriptor.get;
      delete descriptor.set;
      delete descriptor.writable;

      switch(propertyName) {
        case 'plugins':
          console.log('RubberGlove: Cloaking plugins for ' + window.location.href);
          descriptor.value = new PluginArray();
          break;
        case 'mimeTypes':
          console.log('RubberGlove: Cloaking mimeTypes for ' + window.location.href);
          descriptor.value = new MimeTypeArray();
          break;
        default:
          //console.log("RubberGlove: wrapping " + propertyName);
          descriptor.get = (function(propertyName, navigator) {
            return function() { /* native() */ return navigator[propertyName] };
          })(propertyName, window.navigator);
          if(writable) {
            descriptor.set = (function(propertyName, navigator) {
              return function(value) { /* native(item) */ navigator[propertyName] = value; };
            })(propertyName, window.navigator);
          }
          break;
      }
      Object.defineProperty(this, propertyName, descriptor);
    }
  }
  // Don't ask me why the real function has this...  It's not even a prototype.
  Navigator.toString = function toString() { // native(toString)
    return Function.prototype.toString.apply(this, Array.prototype.slice.apply(arguments));
  };
  if(config.local.verbose) console.log("RubberGlove: Replacing Navigator.prototype");
  for(var property in window.Navigator.prototype) {
    Navigator.prototype[property] = window.Navigator.prototype[property];
  }
  if(config.local.verbose) console.log("RubberGlove: Replacing window.Navigator");
  Object.defineProperty(window, 'Navigator', {
    enumerable: false,
    configurable: false,
    writable: true,
    value: Navigator
  });

  if(config.local.verbose) console.log("RubberGlove: Constructing Navigator");
  var navigatorProxy = new Navigator();
  if(config.local.verbose) console.log("RubberGlove: Replacing window.navigator");
  Object.defineProperty(window, 'navigator', {
    enumerable: true,
    configurable: false,
    writable: true,
    value: navigatorProxy
  });
  if(config.local.verbose) console.log("RubberGlove: Replacing window.clientInformation");
  Object.defineProperty(window, 'clientInformation', {
    enumerable: true,
    configurable: false,
    writable: true,
    value: navigatorProxy
  });

  // Hides source code when it contains "// native(functionName)" or
  // "/* native(functionName)" at the beginning of the function body.
  if(config.local.verbose) console.log("RubberGlove: Replacing Function.prototype.toString()");
  Function.prototype.toString = (function(oldToString) {
    return function toString() { // native(toString) <-- yes, it handles itself
      var result = oldToString.apply(this, Array.prototype.slice.apply(arguments));
      var match = result.match(/^\s*?function.*?\(.*?\)\s*?{\s*?\/[\*\/]\s*?native\((.*?)\)/);
      if(match != null && match.length > 1)
        return 'function ' + match[1] + '() { [native code] }';
      return result;
    };
  })(Function.prototype.toString);

  // Hides named plugins and mimeTypes
  if(config.local.verbose) console.log("RubberGlove: Replacing Object.getOwnPropertyNames()");
  Object.getOwnPropertyNames = (function(oldGetOwnPropertyNames) {
    return function getOwnPropertyNames() { // native(getOwnPropertyNames)
      var propertyNames = oldGetOwnPropertyNames.apply(this, Array.prototype.slice.apply(arguments));
      if(arguments[0] === window.navigator.plugins || arguments[0] === window.navigator.mimeTypes) {
        var filteredNames = [];
        for(var i=0; i < propertyNames.length; i++) {
          var propertyName = propertyNames[i];
          if(propertyName == 'item' || propertyName == 'namedItem' || propertyName == 'length') {
            filteredNames.push(propertyName);
          }
        }
        return filteredNames;
      }
      return propertyNames;
    }
  })(Object.getOwnPropertyNames);

  // Makes our objects look like first class objects
  if(config.local.verbose) console.log("RubberGlove: Replacing Object.prototype.toString()");
  Object.prototype.toString = (function(oldToString) {
    return function toString() { // native(toString)
      if(this === window.navigator) return "[object Navigator]";
      if(this === window.navigator.plugins) return "[object PluginArray]";
      if(this === window.navigator.mimeTypes) return "[object MimeTypeArray]";
      return oldToString.apply(this, Array.prototype.slice.apply(arguments));
    };
  })(Object.prototype.toString);
}
