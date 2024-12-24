// Example from popup.js
const BASE_URL = "http://127.0.0.1:8000";

document.getElementById("startButton").addEventListener("click", () => {
  const businessName = document.getElementById("inputs").value;

  // Make sure the active tab is Google Maps before sending the message
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab && activeTab.url.includes("https://www.google.es/maps")) {
      chrome.tabs.sendMessage(activeTab.id, {
        action: "startScraping",
        businessName: businessName,
      });
    } else {
      console.error("Active tab is not Google Maps");
    }
  });
});
document.getElementById("start").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "showConfirmation",
    });
  });
  window.close();
});
function callPop(businessName, lang) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "togglePopup",
      business_name: businessName,
      lang: lang,
    });
  });
  window.close();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "PROCESSING_DONE") {
    document.getElementById("status").textContent = "Processing is complete!";
    document.getElementById("load").style.display = "none";
    document.getElementById("complete").style.display = "block";

    setTimeout(() => {
      document.getElementById("loader").style.display = "none";
    }, 3000);
  }
});

document.getElementById("clear").addEventListener("click", () => {
  fetch(`${BASE_URL}/delete-all`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("div-empty").style.display = "block";
      document.getElementById("div-picker").style.display = "none";
    });
});

async function getData() {
  try {
    // Make the GET request to the FastAPI server
    const response = await fetch(`${BASE_URL}/retrieve`, {
      method: "GET", // HTTP method
      headers: {
        "Content-Type": "application/json", // Content type
      },
    });

    const result = await response.json();
    console.log(result);
    const selectedElement = document.getElementById("selected");
    selectedElement.innerHTML = ``;

    if (Object.keys(result).length === 0) {
      selectedElement.innerHTML = `
      <img src="./empty-folder.png" alt="">
      <small>Oops you have no record</small>`;
    } else {
      // Loop through the keys of the result object
      for (let business in result) {
        if (result.hasOwnProperty(business)) {
          // Get the length of the languages array for the business
          const languagesCount = result[business].length;
          const languagesList =
            typeof result[business] === "string"
              ? JSON.parse(result[business])
              : result[business];

          // Create a new list item
          const listItem = document.createElement("li");
          listItem.style.cursor = "pointer";

          // Add the span and button elements, including the languages count
          listItem.innerHTML = `<span class="holder" data-name="${business}" data-value="${languagesList}"><b>${business}</b> <br> ${languagesCount} languages </span><button class="save" data-name="${business}" data-value="${languagesList}">Save</button>`;

          // Append the list item to the 'selected' element
          selectedElement.appendChild(listItem);

          // Attach the click event listener to the list item
          listItem.addEventListener("click", (event) => {
            // Look for the span with the 'holder' class
            const targetSpan = event.target
              .closest("li")
              .querySelector(".holder");
            if (targetSpan) {
              const businessValue = targetSpan.getAttribute("data-name");
              const langValue = targetSpan.getAttribute("data-value");
              const lang = stringToList(langValue);

              console.log({
                businessValue,
                lang,
              });
              callPop(businessValue, lang);
            }
          });

          // Attach a click event listener to the button (if needed)
          const button = listItem.querySelector(".save");
          button.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent triggering the parent listItem click
            console.log("Save button clicked for:", business);
          });
        }
      }

      const saveButtons = document.querySelectorAll("#selected .save");

      // Add a click event listener to each button
      saveButtons.forEach((button) => {
        button.addEventListener("click", () => {
          // Find the related span content
          const name_for_business = button.getAttribute("data-name");
          const val = button.getAttribute("data-value");

          const value = stringToList(val); // Save the data (you may update the saveData function if needed)
          saveData(name_for_business, value); // Pass business name and languages
        });
      });
    }

    // Do something with the retrieved data
    // For example, update the DOM or store it in Chrome's local storage
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
}
getData();

async function getSavedData() {
  try {
    // Make the GET request to the FastAPI server
    const response = await fetch(`${BASE_URL}/get_saved_data`, {
      method: "GET", // HTTP method
      headers: {
        "Content-Type": "application/json", // Content type
      },
    });

    const result = await response.json();
    const selectedElement = document.getElementById("saved");
    selectedElement.innerHTML = ``;

    if (Object.keys(result).length === 0) {
      selectedElement.innerHTML = `
          <img src="./empty-folder.png" alt="">
          <small>Oops you have no record</small>`;
    } else {
      for (let business in result) {
        if (result.hasOwnProperty(business)) {
          // Get the length of the languages array for the business
          const languagesCount = result[business].length;
          const languagesList =
            typeof result[business] === "string"
              ? JSON.parse(result[business])
              : result[business];

          // Create a new list item
          const listItem = document.createElement("li");
          listItem.style.cursor = "pointer";

          // Add the span and button elements, including the languages count
          listItem.innerHTML = `<span class="holder" data-name="${business}" data-value="${languagesList}"><b>${business}</b> <br> ${languagesCount} languages </span><button data-value="${business}" style="background-color: rgb(255, 63, 63); border: 1px solid rgb(255, 70, 70);">delete</button>`;

          // Append the list item to the 'selected' element
          selectedElement.appendChild(listItem);

          listItem
            .querySelector("button[data-value]")
            .addEventListener("click", async (event) => {
              event.stopPropagation(); // Prevent the click event from bubbling to the parent li
              const key = listItem
                .querySelector("button")
                .getAttribute("data-value");

              try {
                const response = await fetch(
                  `${BASE_URL}/delete-saved?key=${encodeURIComponent(key)}`,
                  {
                    method: "DELETE",
                  }
                );

                if (response.ok) {
                  console.log("Data deleted successfully");
                  listItem.remove(); // Remove the list item from the DOM
                } else {
                  console.error("Error deleting data:", response.statusText);
                  alert("Failed to delete data");
                }
              } catch (error) {
                console.error("Error:", error);
                alert("An error occurred while deleting data");
              }
            });

          // Add event listener for clicking on the list item
          listItem.addEventListener("click", () => {
            const businessName = listItem
              .querySelector("span")
              .getAttribute("data-name");
            const val = listItem
              .querySelector("span")
              .getAttribute("data-value");
            const value = stringToList(val);
            saveDataTem(businessName, value);
          });
        }
      }
    }

    // Do something with the retrieved data
    // For example, update the DOM or store it in Chrome's local storage
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Get references to the radio buttons and divs
  const radio2 = document.getElementById("radio-2");
  const radio3 = document.getElementById("radio-3");
  const divPicker = document.getElementById("div-picker");
  const divSaved = document.getElementById("div-saved");

  // Function to update div visibility based on checked radio button
  function updateDisplay() {
    if (radio2.checked) {
      divPicker.style.display = "block";
      divSaved.style.display = "none";
      getData();
      document.getElementById("div-empty").style.display = "none";
    } else if (radio3.checked) {
      divPicker.style.display = "none";
      divSaved.style.display = "block";
      getSavedData();
      document.getElementById("div-empty").style.display = "none";
    }
  }

  // Add event listeners to the radio buttons
  radio2.addEventListener("change", updateDisplay);
  radio3.addEventListener("change", updateDisplay);

  // Initial display update
  updateDisplay();
});

async function saveData(Key, value) {
  try {
    const response = await fetch(`${BASE_URL}/save_permanent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ business_name: Key, value: value }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Success:", data);
    } else {
      console.error("Failed to save data. Status:", response.status);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
async function saveDataTem(businessName, languages) {
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

function stringToList(input) {
  // Trim any extra whitespace and split by commas
  const result = input.trim() === "" ? [] : input.split(",");

  return result;
}
