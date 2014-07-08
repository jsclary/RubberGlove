//console.log("RubberGlove: Content Script for " + window.location.href);

// Create the script to be injected
var pageScript = document.createElement('script');
pageScript.type = 'text/javascript';
pageScript.async = false;
pageScript.text = "(" + bomOverloadFunction.toString() + ")();"
                + "(" + scriptCleanupFunction.toString() + ")();";

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

// Insert our script into the page
head.insertBefore(pageScript, head.firstChild);
