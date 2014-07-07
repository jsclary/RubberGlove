//console.log("RubberGlove: Content Script for " + window.location.href);
var compositeScript = 
  "window.navigator = window.clientInformation = (" + bomOverloadFunction.toString() + "());\n"
  + "(" + scriptCleanupFunction.toString() + "());";

var pageScript = document.createElement('script');
pageScript.type = 'text/javascript';
pageScript.async = false;
pageScript.text = compositeScript;

var html = document.documentElement
var headTags = document.getElementsByTagName("head");
var head = headTags.length > 0 ? head = headTags[0] : null;
if(!head || head != html.firstChild) {
  head = document.createElement('head');
  html.insertBefore(head, html.firstChild);
  pageScript.id = "_RubberGlove_removeHead";
}
window.addEventListener("message", function(event) {
  if(event.source != window) return;
  if(event.data.type && event.data.type == "RubberGlove") {
    chrome.runtime.sendMessage({
      type: "increment-counter",
      url: window.location.href,
      message: event.data.text
    });
  }
});
head.insertBefore(pageScript, head.firstChild);
