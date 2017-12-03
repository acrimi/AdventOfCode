chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var selection = window.getSelection().toString();
  
  var dayEl = $(window.getSelection().anchorNode.parentElement).parents('article.day-desc');
  var previousArticles = dayEl.prevAll('article.day-desc');
  
  var urlMatch = location.href.match(/adventofcode.com\/(\d{4})\/day\/(\d+)/);

  if (urlMatch && selection && selection.length) {
    chrome.runtime.sendMessage({
      name: request.name,
      selection: selection,
      year: urlMatch[1],
      day: urlMatch[2],
      part: previousArticles.length == 0 ? 1 : 2
    });
  }
});