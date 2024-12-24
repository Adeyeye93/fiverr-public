

// Extract the full page's HTML source from the document
(function() {
  const pageSource = document.documentElement.outerHTML;
  const url = window.location.href;

  // Send the page source and the URL to the background script
  browser.runtime.sendMessage({
    type: "PAGE_SOURCE",
    pageSource,
    url
  });
})();
