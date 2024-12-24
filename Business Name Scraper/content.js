const BASE_URL = "http://127.0.0.1:8000";

function getClickBusiness() {
  const anchors = document.getElementsByTagName("a");

  for (let i = 0; i < anchors.length; i++) {
    const anchor = anchors[i];

    // Check if the listener is already attached
    if (!anchor.getAttribute("data-listener")) {
      anchor.addEventListener("click", function (event) {
        event.preventDefault();

        // Get the clicked anchor tag
        const clickedAnchor = event.currentTarget;

        // Find the "aria-label" content
        const labelContent = clickedAnchor.getAttribute("aria-label");
        if (labelContent) {
          saveData(labelContent, []);
          showToast(
            labelContent +
              " has been added to open extension to scrap and download"
          );
        } else {
          console.log("Business name element not found");
        }

        // Here, you can open your modal and use the content as needed
      });

      // Mark this anchor as having an event listener
      anchor.setAttribute("data-listener", "true");
    }
  }
}

// Use MutationObserver to detect changes in the DOM
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    // Call getClickBusiness to re-attach event listeners if necessary
    getClickBusiness();
  });
});

// Start observing the document for changes
observer.observe(document.body, {
  childList: true, // Monitor direct children
  subtree: true, // Monitor the entire subtree
});

// Initial call to set up event listeners
getClickBusiness();

// Listen for the message from the popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startScraping" && message.businessName) {
    // Step 1: Find the search box element using the ID
    const searchBox = document.getElementById("searchboxinput");

    if (searchBox) {
      // Step 2: Set the value of the search box to the business name
      searchBox.value = message.businessName;

      // Step 3: Simulate the "input" event to make sure Google Maps recognizes the input change
      const inputEvent = new Event("input", { bubbles: true });
      searchBox.dispatchEvent(inputEvent);

      // Step 4: Simulate pressing the "Enter" key to perform the search
      const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        keyCode: 13,
        code: "Enter",
        which: 13,
        bubbles: true,
        cancelable: true,
      });
      searchBox.dispatchEvent(enterEvent);
      // Optional: Add a delay to wait for the page to load search results
      setTimeout(() => {
        console.log("Search initiated for:", message.businessName);
      }, 5000); // Adjust the delay as necessary
    } else {
      console.error("Search box element not found on the page.");
    }
  }
});

// Function to create and show a toast
function showToast(message) {
  // Check if a toast container already exists, if not, create one
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.style.position = "fixed";
    toastContainer.style.bottom = "20px";
    toastContainer.style.right = "20px";
    toastContainer.style.zIndex = "1000";
    document.body.appendChild(toastContainer);
  }

  // Create a new toast element
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.style.backgroundColor = "#333";
  toast.style.color = "#fff";
  toast.style.padding = "10px 20px";
  toast.style.marginTop = "10px";
  toast.style.fontSize = "12px";
  toast.style.borderRadius = "5px";
  toast.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
  toast.style.opacity = "0.9";
  toast.textContent = message;

  // Append the toast to the container
  toastContainer.appendChild(toast);

  // Remove the toast after 5 seconds
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

async function saveData(businessName, languages) {
  const url = `${BASE_URL}/save`;
  const payload = {
    business_name: businessName,
    languages: languages,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Business saved successfully:", result);
  } catch (error) {
    console.error("Error saving business:", error);
  }
}

function searchBusiness(businessName) {
  const searchBox = document.getElementById("searchboxinput");

  if (searchBox) {
    searchBox.value = businessName;

    const inputEvent = new Event("input", { bubbles: true });
    searchBox.dispatchEvent(inputEvent);

    const enterEvent = new KeyboardEvent("keydown", {
      key: "Enter",
      keyCode: 13,
      code: "Enter",
      which: 13,
      bubbles: true,
      cancelable: true,
    });
    searchBox.dispatchEvent(enterEvent);
  } else {
    console.error("Search box element not found on the page.");
  }
}
function changeLanguage(languageCode) {
  const url = new URL(window.location.href);
  url.searchParams.set("hl", languageCode); // 'hl' is the parameter for language
  window.location.href = url.href;
}

function waitForPageLoad() {
  return new Promise((resolve) => {
    if (document.readyState === "complete") {
      resolve();
    } else {
      window.addEventListener("load", resolve, { once: true });
    }
  });
}

function extractName() {
  return new Promise((resolve, reject) => {
    try {
      // Use a MutationObserver to detect changes in the DOM
      const observerH1 = new MutationObserver((mutations, observerInstance) => {
        const nameElement = document.querySelector("h1");
        if (nameElement) {
          observerInstance.disconnect(); // Stop observing once the element is found
          resolve(nameElement.textContent);
        }
      });

      observerH1.observe(document.body, { childList: true, subtree: true });

      // Set a timeout in case the element doesn't load (optional, for safety)
      setTimeout(() => {
        observerH1.disconnect();
        resolve(null); // Resolve with null if the element isn't found
      }, 10000); // Adjust timeout as necessary
    } catch (error) {
      reject(error);
    }
  });
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "processLanguage") {
    const { languageCode, businessName } = message;

    // Check if the current URL already contains the business name
    const currentUrl = window.location.href.toLowerCase();
    const formattedBusinessName = businessName.toLowerCase().replace(/ /g, "+");

    if (!currentUrl.includes(`/place/${formattedBusinessName}/`)) {
      // Call searchBusiness if the business is not in the URL
      searchBusiness(businessName);
      setTimeout(() => {
        changeLanguage(languageCode);
      }, 5000);
    } else {
      changeLanguage(languageCode);
    }

    // Change the language after ensuring the search is finished
  } else if (message.action === "pageLoaded") {
    // Handle the page reloaded event
    const displayedName = await extractName();
    const languageCode = new URLSearchParams(window.location.search).get("hl");

    console.log(`
      processed data {
      name: ${displayedName},
      lang: ${languageCode}
      }
      `);

    chrome.runtime.sendMessage({
      action: "languageProcessed",
      displayedName,
      languageCode,
    });
  }
});

const observerLoad = new MutationObserver((mutations) => {
  mutations.forEach(() => {
    const ele = document.querySelector("h1");
    if (ele) {
      observerLoad.disconnect();
      console.log(`Found Element: ${ele}`);
      chrome.runtime.sendMessage({ action: "pageLoadedFinish" });
    } else {
      console.log("element not found");
    }
  });
});
observerLoad.observe(document.body, { childList: true, subtree: true });
