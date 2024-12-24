let currentBusinessIndex = 0;
let currentLanguageIndex = 0;
let results = [];
let automatonStarted = 0;
const BASE_URL = "http://127.0.0.1:8000";

// Store the fetched business and language data
let businessData = {};
let businessNames = [];

async function fetchBusinessData() {
  try {
    const response = await fetch(`${BASE_URL}/retrieve`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching business data:", error);
    return {};
  }
}

async function processNextStep(tabId) {
  if (
    currentBusinessIndex === 0 &&
    currentLanguageIndex === 0 &&
    !Object.keys(businessData).length
  ) {
    businessData = await fetchBusinessData();
    businessNames = Object.keys(businessData);

    console.log({ businessData, businessNames });
  }

  if (currentBusinessIndex < businessNames.length) {
    const businessName = businessNames[currentBusinessIndex];
    const languages = businessData[businessName];

    if (currentLanguageIndex < languages.length) {
      const languageCode = languages[currentLanguageIndex];

      console.log(
        `Processing... Business: ${businessName}, Language: ${languageCode}`
      );

      chrome.tabs.sendMessage(tabId, {
        action: "processLanguage",
        languageCode,
        businessName,
      });
    } else {
      const fileName = `${businessName.replace(/ /g, "_")}.csv`;

      // Add current timestamp to each row and convert to JSON
      const currentTimestamp = new Date().toISOString();
      const updatedResults = results.map((row) => ({
        business_name: row[0],
        language: row[1],
        timestamp: currentTimestamp,
      }));

      console.log(fileName);
      console.log(updatedResults);
      // Send data to the backend
      fetch("http://localhost:8000/process_csv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: fileName,
          data: updatedResults,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("File updated successfully:", data);
          currentBusinessIndex++;
          currentLanguageIndex = 0;
          results = [];
          processNextStep(tabId);
        })
        .catch((error) => console.error("Error:", error));
    }
  } else {
    console.log("Processing complete!");
    automatonStarted = 0;
  }
}

automatonStarted = false;
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "pageLoadedFinish") {
    const tabId = sender.tab.id;
    console.log(`automatonStarted value: ${automatonStarted}`);
    if (automatonStarted >= 1) {
      chrome.tabs.sendMessage(tabId, { action: "pageLoaded" });
    } else {
      console.log("Automation not started");
    }
  }
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "languageProcessed") {
    const { displayedName, languageCode } = message;
    if (displayedName) {
      results.push([displayedName, languageCode]);
    }

    console.log("Move to the next language");
    currentLanguageIndex++;
    processNextStep(sender.tab.id);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startFetchNext") {
    currentBusinessIndex = 0;
    currentLanguageIndex = 0;
    results = [];
    if (sender.tab && sender.tab.id !== undefined) {
      automatonStarted++;
      processNextStep(sender.tab.id);
    } else {
      console.error("Tab ID not found. Ensure the message is sent from a tab.");
    }
  }
});
