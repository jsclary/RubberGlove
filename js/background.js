function resetBadgeCounter(tabId) {
  localStorage['RubberGlove_BlockCount_' + tabId] = 0;
  chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
  chrome.browserAction.setBadgeText({text: '', tabId: tabId});
}

function incrementBadgeCounter(tabId) {
    var count = localStorage['RubberGlove_BlockCount_' + tabId] || 0;
    localStorage['RubberGlove_BlockCount_' + tabId] = ++count;
    chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
    chrome.browserAction.setBadgeText({text: count.toString(), tabId: tabId});
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var response = {};
  switch(request.type)
  {
    case "increment-counter":
      if(sender && sender.tab && sender.tab.id)
        incrementBadgeCounter(sender.tab.id);
      else console.error("RubberGlove: onMessage called without sender.tab.id");
      break;
  }
  if(sendResponse) sendResponse(response);
});

chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab) {
  if(changeInfo.status == "loading") {
    resetBadgeCounter(tabId);
  }
});