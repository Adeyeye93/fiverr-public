let downloadedTabs = {};

// Listen for messages from content scripts
browser.runtime.onMessage.addListener(async (message, sender) => {
  const tabId = sender.tab.id;

  // Make sure the message is of the correct type and for the main frame
  if (message.type === "PAGE_SOURCE" && sender.frameId === 0) {
    const { pageSource, url } = message;

    // Check if this tab has already been processed
    if (!downloadedTabs[tabId]) {
      try {
        const fileName = getFileNameFromUrl(url);

        // Create a Blob with the page source
        const blob = new Blob([pageSource], { type: "text/html" });

        // Create an object URL from the Blob
        const objectUrl = URL.createObjectURL(blob);

        // Save the file using the object URL
        await browser.downloads.download({
          url: objectUrl,
          filename: fileName,
          saveAs: false,
        });

        // Revoke the object URL after the download to free up memory
        URL.revokeObjectURL(objectUrl);

        // Mark the tab as processed to avoid multiple downloads
        downloadedTabs[tabId] = true;
      } catch (error) {
        console.error("Failed to download page source:", error);
      }
    }
  }
});

// Listen for tab updates (to detect when the tab changes or a new page is loaded)
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading") {
    // Reset the flag when the tab is loading a new page
    downloadedTabs[tabId] = false;
  }
});

// Listen for tab switching (to reset download flag when switching tabs)
browser.tabs.onActivated.addListener((activeInfo) => {
  // Reset the flag when switching to a different tab
  downloadedTabs[activeInfo.tabId] = false;
});

// Utility function to generate a valid filename from a URL
function getFileNameFromUrl(url) {
  try {
    const urlObject = new URL(url);

    // Get the hostname (domain)
    const domain = urlObject.hostname;

    // Get the path and query string, replacing special characters with underscores
    const path = (urlObject.pathname + urlObject.search).replace(
      /[\/?&=:#]/g,
      "_"
    );

    // Ensure the file has an extension (assume .html if no extension found)
    const fileName = path ? `${domain}${path}` : `${domain}_index.html`;
    const extension =
      fileName.endsWith(".html") || fileName.endsWith(".php") ? "" : ".html";

    return `${fileName}${extension}`;
  } catch (error) {
    console.error("Error generating file name from URL:", error);
    return "downloaded_page.html";
  }
}
