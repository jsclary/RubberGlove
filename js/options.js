window.addEventListener('load', function() {
  var extensionVersion = document.getElementById('extensionVersion');
  extensionVersion.appendChild(document.createTextNode(chrome.app.getDetails().version));
  
  var bomViewer = document.getElementById("bomViewer");
  bomViewer.href = chrome.runtime.getURL("/html/bomViewer.html");
});
