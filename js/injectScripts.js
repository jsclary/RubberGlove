//console.log("RubberGlove: Content Script for " + window.location.href);

function loadScript(name) {
  var request = new XMLHttpRequest();
  request.open('GET', chrome.runtime.getURL(name), false);
  request.send(null);
  if (request.status === 200) {
    return request.responseText;
  }
  console.error("RubberGlove: Failed to load " + name);
  return;
}

var pageScripts = document.createElement('script');
pageScripts.type = 'text/javascript';
pageScripts.async = false;
pageScripts.text = loadScript("js/bomOverride.js");

var html = document.documentElement
var headTags = document.getElementsByTagName("head");
var head = headTags.length > 0 ? head = headTags[0] : null;
if(!head || head != html.firstChild) {
  head = document.createElement('head');
  html.insertBefore(head, html.firstChild);
  pageScripts.id = "_RubberGlove_removeHead";
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
head.insertBefore(pageScripts, head.firstChild);
