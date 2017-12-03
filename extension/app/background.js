chrome.commands.onCommand.addListener(function(command) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { name: command });
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.name === 'saveTestInput' || request.name === 'saveExpectedResult') {
    const data = {
      input: request.name == 'saveTestInput' ? request.selection : null,
      expect: request.name == 'saveExpectedResult' ? request.selection : null,
      day: request.day,
      year: request.year,
      part: request.part
    };
    chrome.runtime.sendNativeMessage('com.crimi.adventofcode', data);
  }
});