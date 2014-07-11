function getConfig(filename) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'filesystem:' + chrome.extension.getURL('temporary/' + filename), false);
  xhr.send(null);
  if(xhr.status == 200) return xhr.responseText;
  return;
}

var settingsText = getConfig("persistedSettings.js");
var settings = JSON.parse(settingsText);

if(settings.verbose) {
  console.log("RubberGlove: Content Script for " + window.location.href);
  console.log("RubberGlove: settings = " + settingsText);
}

// Listen for callbacks from the page script
window.addEventListener("message", function(event) {
  if(event.source != window) return;
  if(event.data.type) {
    switch(event.data.type) {
      case "RubberGlove":
        // Tell background.js to increment the badge counter
        chrome.runtime.sendMessage({
          type: "increment-counter",
          url: window.location.href,
          message: event.data.text
        });
        break;
      case "RubberGlove_DebugInfoRequest":
        console.log("RubberGlove: DebugInfoRequest from " + event.source.location.href);
        if(event.source.location.href.indexOf("file:///") == 0) {
          var debugInfo = {
            settings: settings,
            plugins: [],
            mimeTypes: []
          };
          for(var i = 0; i < navigator.plugins.length; i++) {
            var plugin = navigator.plugins[i];
            if(typeof plugin.name != 'undefined')
              debugInfo.plugins.push(plugin.name);
          }
          for(var i = 0; i < navigator.mimeTypes.length; i++) {
            var mimeType = navigator.mimeTypes[i];
            if(typeof mimeType.type != 'undefined')
              debugInfo.mimeTypes.push(mimeType.type);
          }
          console.log("RubberGlove: Sending debug info to " + event.source.location.href);
          window.postMessage({
            type: 'RubberGlove_DebugInfo',
            debugInfo: debugInfo
          }, '*');
        }
        break;
    }
  }
});
  
if(settings.enabled) {
  // Create the script to be injected
  var pageScript = document.createElement('script');
  pageScript.type = 'text/javascript';
  pageScript.async = false;
  pageScript.text = "(function() {\n" +
                      "var settings = " + settingsText + ";\n" +
                      "(" + bomOverload.toString() + ")();\n" +
                      "(" + scriptCleanupFunction.toString() + ")();\n" +
                    "})();";

  // Locate the <head> or create a new one if there isn't one or it isn't
  // at the top of the page.
  var html = document.documentElement
  var headTags = document.getElementsByTagName("head");
  var head = headTags.length > 0 ? head = headTags[0] : null;
  if(!head || head !== html.firstChild) {
    head = document.createElement('head');
    html.insertBefore(head, html.firstChild);
    pageScript.id = "_RubberGlove_removeHead";
  }

  // Insert our script into the page.  Note: This absolutely cannot under
  // any circumstances happen in an async callback otherwise scripts on
  // the page may run first and have access to the unwrapped objects.
  // Synchronous XHR requests before this seem to work fine, however.
  head.insertBefore(pageScript, head.firstChild);
}
