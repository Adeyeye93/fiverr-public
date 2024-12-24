function displayPop() {
  // Check if the modal already exists, if so, remove it
  const existingModal = document.getElementById("injectable-confirm-modal");
  if (existingModal) {
    existingModal.remove();
  }

  // Create the modal container
  const modal = document.createElement("div");
  modal.id = "injectable-confirm-modal";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = "9999";
  modal.style.fontFamily = "'Outfit', serif";

  // Create the modal content
  const modalContent = document.createElement("div");
  modalContent.style.backgroundColor = "#fff";
  modalContent.style.padding = "30px";
  modalContent.style.borderRadius = "8px";
  modalContent.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
  modalContent.style.textAlign = "center";

  // Add text message to the modal
  const message = document.createElement("p");
  message.textContent = "Continue to load your account analytics";
  message.style.marginBottom = "20px";
  modalContent.appendChild(message);

  // Add Confirm button
  const confirmButton = document.createElement("button");
  confirmButton.textContent = "Continue";
  confirmButton.style.marginRight = "10px";
  confirmButton.style.padding = "10px 20px";
  confirmButton.style.backgroundColor = "#28a745";
  confirmButton.style.color = "#fff";
  confirmButton.style.border = "none";
  confirmButton.style.borderRadius = "4px";
  confirmButton.style.cursor = "pointer";

  confirmButton.addEventListener("click", () => {
    // Remove the current modal content
    modalContent.innerHTML = `
    <svg viewBox="25 25 50 50" class="dots-container">
    <circle r="20" cy="50" cx="50" class="dot"></circle>
    </svg>
    <p>Almost done, We are getting your data</p>
    `;

    setTimeout(() => {
      chrome.tabs.create({
        url: chrome.runtime.getURL("analytics.html"),
      });
    }, 5000);
  });

  modalContent.appendChild(confirmButton);

  // Add Cancel button
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.style.padding = "10px 20px";
  cancelButton.style.backgroundColor = "#dc3545";
  cancelButton.style.color = "#fff";
  cancelButton.style.border = "none";
  cancelButton.style.borderRadius = "4px";
  cancelButton.style.cursor = "pointer";

  cancelButton.addEventListener("click", () => {
    console.log("Action canceled");
    modal.remove(); // Remove the modal
  });

  modalContent.appendChild(cancelButton);

  // Append modal content to the modal container
  modal.appendChild(modalContent);

  // Append the modal to the body
  document.body.appendChild(modal);

  // Add the CSS for the loader animation
  const style = document.createElement("style");
  style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

.dots-container {
 width: 3.25em;
 transform-origin: center;
 animation: rotate4 2s linear infinite;
}

.dot {
 fill: none;
 stroke: hsl(214, 97%, 59%);
 stroke-width: 2;
 stroke-dasharray: 1, 200;
 stroke-dashoffset: 0;
 stroke-linecap: round;
 animation: dash4 1.5s ease-in-out infinite;
}

@keyframes rotate4 {
 100% {
  transform: rotate(360deg);
 }
}

@keyframes dash4 {
 0% {
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
 }

 50% {
  stroke-dasharray: 90, 200;
  stroke-dashoffset: -35px;
 }

 100% {
  stroke-dashoffset: -125px;
 }
}

    `;
  document.head.appendChild(style);
}
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "iconClicked") {
    displayPop();
  }
});
