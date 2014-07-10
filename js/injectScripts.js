//console.log("RubberGlove: Content Script for " + window.location.href);
function getConfig(filename) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'filesystem:' + chrome.extension.getURL('temporary/' + filename), false);
  xhr.send(null);
  if(xhr.status == 200) return xhr.responseText;
  return;
}

var configText = getConfig("persistedSettings.js");
console.log("RubberGlove: config = " + configText);
var config = JSON.parse(configText);

if(config.local.enabled) {
  // Create the script to be injected
  var pageScript = document.createElement('script');
  pageScript.type = 'text/javascript';
  pageScript.async = false;
  pageScript.text = "(function() {\n" +
                      "var config = " + configText + ";\n" +
                      "(" + bomOverload.toString() + ")();\n" +
                      "(" + scriptCleanupFunction.toString() + ")();\n" +
                    "})();";

  // Locate the <head> or create a new one if there isn't one or it isn't at
  // the top of the page.
  var html = document.documentElement
  var headTags = document.getElementsByTagName("head");
  var head = headTags.length > 0 ? head = headTags[0] : null;
  if(!head || head !== html.firstChild) {
    head = document.createElement('head');
    html.insertBefore(head, html.firstChild);
    pageScript.id = "_RubberGlove_removeHead";
  }

  // Listen for callbacks from the page script
  window.addEventListener("message", function(event) {
    if(event.source != window) return;
    if(event.data.type && event.data.type == "RubberGlove") {
      // Tell background.js to increment the badge counter
      chrome.runtime.sendMessage({
        type: "increment-counter",
        url: window.location.href,
        message: event.data.text
      });
    }
  });

  // Insert our script into the page.  Note: This absolutely cannot under
  // any circumstances happen in an async callback otherwise scripts on the
  // page may run first and have access to the unwrapped objects.
  // Synchronous XHR requests before this seem to work fine, however.
  head.insertBefore(pageScript, head.firstChild);
}
