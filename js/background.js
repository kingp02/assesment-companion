/*
 * Lockdown the chrome browser
 *
 * Handles the following cases:
 * Case 1: Changing Tab/Window Focus
 * Case 2: Attempting to open new tab or window
 * Case 3: Closing Existing Tab Before Finishing
 * Case 4: Resizing Window
 * Case 5: Updating existing url
 *
 */
var targetTabId;
var targetWindowId;
var targetUrl;
var targetEnabled = false;
var intervalHandle;

chrome.tabs.onActivated.addListener(function(activeInfo) {
  targetEnabled && chrome.tabs.update(targetTabId, {
    active: true,
    highlighted: true,
  });
});

chrome.windows.onFocusChanged.addListener(function(windowId) {
  if (targetEnabled && windowId !== targetWindowId) {
    chrome.windows.update(targetWindowId, {
      focused: true,
      state: "fullscreen",
    });
  }
});

chrome.tabs.onAttached.addListener(function(tabId, attachInfo){
  if (targetEnabled && tabId === targetTabId) {
    targetWindowId = attachInfo.newWindowId;
  }
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
  if (targetEnabled && tabId === targetTabId) {
    targetEnabled = false;
  }
});

// handle case when windowId or tabId changes
chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
  switch (request.method) {
    case "assessment_started":
      targetTabId = sender.tab.id;
      targetWindowId = sender.tab.windowId;
      targetUrl = sender.tab.url;
      targetEnabled = true;
      chrome.windows.update(targetWindowId, {
        focused: true,
        state: "fullscreen",
      });
      chrome.tabs.update(targetTabId, {
        active: true,
        highlighted: true,
      });
      clearInterval(intervalHandle);
      intervalHandle = setInterval(function(){
        targetEnabled && chrome.windows.update(targetWindowId, {
          focused: true,
          state: "fullscreen",
        });
      }, 500);
      break;

    case "assessment_ended":
      targetEnabled = false;
      clearInterval(intervalHandle);
      chrome.windows.update(targetWindowId, {
        state: "maximized",
      });
      break;

    case "assessment_status":
      sendResponse({message: targetEnabled});
      return;

    default:
      // Don't respond to unknown messages
      return;
  }
  sendResponse({message: "success"});
});
