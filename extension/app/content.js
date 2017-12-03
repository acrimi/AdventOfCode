chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // TODO parse day/year/part from url and dom
  var selection = window.getSelection().toString();
  if (selection && selection.length) {
    chrome.runtime.sendMessage({
      name: request.name,
      text: selection
    });
  }
});