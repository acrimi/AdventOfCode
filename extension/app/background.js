chrome.commands.onCommand.addListener(function(command) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { name: command });
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.name === "saveTestInput") {
    writeTestInput(request.text);
  } else if (request.name === "saveExpectedResult") {
    writeExpectation(request.text);
  }
});

function writeTestInput(text) {
  chrome.runtime.sendNativeMessage('com.crimi.adventofcode',
    { text: text },
    function(response) {
      console.log("Received " + response);
    });
}

function writeExpectation(text) {

}