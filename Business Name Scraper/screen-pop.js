if (!document.getElementById("languagePopupScript")) {
  const scriptTag = document.createElement("div");
  scriptTag.id = "languagePopupScript";
  document.body.appendChild(scriptTag);

  const languages = [
    "af",
    "az",
    "id",
    "ms",
    "bs",
    "ca",
    "cs",
    "da",
    "de",
    "et",
    "en",
    "es",
    "es-419",
    "eu",
    "fil",
    "fr",
    "gl",
    "hr",
    "zu",
    "is",
    "it",
    "sw",
    "lv",
    "lt",
    "hu",
    "nl",
    "no",
    "uz",
    "pl",
    "pt-BR",
    "pt-PT",
    "ro",
    "sq",
    "sk",
    "sl",
    "fi",
    "sv",
    "vi",
    "tr",
    "el",
    "bg",
    "ky",
    "kk",
    "mk",
    "mn",
    "ru",
    "sr",
    "uk",
    "ka",
    "hy",
    "he",
    "ur",
    "ar",
    "fa",
    "am",
    "ne",
    "hi",
    "mr",
    "bn",
    "pa",
    "gu",
    "ta",
    "te",
    "kn",
    "ml",
    "si",
    "th",
    "lo",
    "my",
    "km",
    "ko",
    "ja",
    "zh-CN",
    "zh-TW",
  ];

  const languageLabels = {
    af: "Afrikaans",
    az: "Azerbaijani",
    id: "Indonesian",
    ms: "Malay",
    bs: "Bosnian",
    ca: "Catalan",
    cs: "Czech",
    da: "Danish",
    de: "German",
    et: "Estonian",
    en: "English",
    es: "Spanish",
    "es-419": "Spanish (Latin America)",
    eu: "Basque",
    fil: "Filipino",
    fr: "French",
    gl: "Galician",
    hr: "Croatian",
    zu: "Zulu",
    is: "Icelandic",
    it: "Italian",
    sw: "Swahili",
    lv: "Latvian",
    lt: "Lithuanian",
    hu: "Hungarian",
    nl: "Dutch",
    no: "Norwegian",
    uz: "Uzbek",
    pl: "Polish",
    "pt-BR": "Portuguese (Brazil)",
    "pt-PT": "Portuguese (Portugal)",
    ro: "Romanian",
    sq: "Albanian",
    sk: "Slovak",
    sl: "Slovenian",
    fi: "Finnish",
    sv: "Swedish",
    vi: "Vietnamese",
    tr: "Turkish",
    el: "Greek",
    bg: "Bulgarian",
    ky: "Kyrgyz",
    kk: "Kazakh",
    mk: "Macedonian",
    mn: "Mongolian",
    ru: "Russian",
    sr: "Serbian",
    uk: "Ukrainian",
    ka: "Georgian",
    hy: "Armenian",
    he: "Hebrew",
    ur: "Urdu",
    ar: "Arabic",
    fa: "Persian",
    am: "Amharic",
    ne: "Nepali",
    hi: "Hindi",
    mr: "Marathi",
    bn: "Bengali",
    pa: "Punjabi",
    gu: "Gujarati",
    ta: "Tamil",
    te: "Telugu",
    kn: "Kannada",
    ml: "Malayalam",
    si: "Sinhala",
    th: "Thai",
    lo: "Lao",
    my: "Burmese",
    km: "Khmer",
    ko: "Korean",
    ja: "Japanese",
    "zh-CN": "Chinese (Simplified)",
    "zh-TW": "Chinese (Traditional)",
  };

  const createPopup = (business, langs) => {
    if (document.getElementById("languagePopupContainer")) return;

    const style = document.createElement("style");
    style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');`;
    document.head.appendChild(style);
    // Fullscreen container
    const container = document.createElement("div");
    container.id = "languagePopupContainer";
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";
    container.style.zIndex = "9999";
    container.style.fontFamily = "'Outfit', serif";

    // Centered popup
    const popup = document.createElement("div");
    popup.id = "languagePopup";
    popup.style.width = "60%";
    popup.style.backgroundColor = "white";
    popup.style.border = "1px solid #ccc";
    popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
    popup.style.padding = "20px";
    popup.style.borderRadius = "8px";
    popup.style.fontFamily = "'Outfit', serif";
    popup.style.textAlign = "left";

    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.style.marginBottom = "10px";
    closeButton.style.backgroundColor = "#ff4d4d";
    closeButton.style.color = "white";
    closeButton.style.border = "none";
    closeButton.style.padding = "5px 10px";
    closeButton.style.cursor = "pointer";
    closeButton.style.borderRadius = "4px";

    closeButton.addEventListener("click", () => {
      container.remove();
    });

    popup.appendChild(closeButton);

    const list = document.createElement("ul");
    list.style.listStyle = "none";
    list.style.padding = "0";
    list.style.display = "flex";
    list.style.justifyContent = "start";
    list.style.alignItems = "start";
    list.style.flexWrap = "wrap";

    languages.forEach((lang) => {
      const item = document.createElement("li");
      item.style.margin = "5px";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = lang;
      checkbox.value = lang;
      checkbox.id = lang;

      // Pre-check the checkbox if the language is in the provided langs array
      if (langs.includes(lang)) {
        checkbox.checked = true;
      }

      const label = document.createElement("label");
      label.htmlFor = lang;
      label.innerText = languageLabels[lang] || lang;

      item.appendChild(checkbox);
      item.appendChild(label);
      list.appendChild(item);
    });

    const continueButton = document.createElement("button");
    continueButton.innerText = "Save language for this business ";
    continueButton.style.marginTop = "20px";
    continueButton.style.display = "block";
    continueButton.style.width = "100%";
    continueButton.style.backgroundColor = "#4CAF50";
    continueButton.style.color = "white";
    continueButton.style.border = "none";
    continueButton.style.padding = "10px";
    continueButton.style.cursor = "pointer";
    continueButton.style.borderRadius = "4px";
    continueButton.style.fontSize = "16px";

    continueButton.addEventListener("click", () => {
      const selectedLanguages = Array.from(
        document.querySelectorAll(
          "#languagePopup input[type='checkbox']:checked"
        )
      ).map((input) => input.value);

      fetch(`${BASE_URL}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business_name: business,
          languages: selectedLanguages,
        }),
      })
        .then((response) => {
          if (response.ok) {
            // Show confirmation modal
            showConfirmationModal(business);

            // Close the main popup
            container.remove();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });

    popup.appendChild(list);
    popup.appendChild(continueButton);
    container.appendChild(popup);
    document.body.appendChild(container);
  };

  const showConfirmationModal = (business) => {
    // Create confirmation modal
    const confirmationModal = document.createElement("div");
    confirmationModal.id = "confirmationModal";
    confirmationModal.style.position = "fixed";
    confirmationModal.style.top = "50%";
    confirmationModal.style.left = "50%";
    confirmationModal.style.transform = "translate(-50%, -50%)";
    confirmationModal.style.backgroundColor = "white";
    confirmationModal.style.border = "1px solid #ccc";
    confirmationModal.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
    confirmationModal.style.padding = "20px";
    confirmationModal.style.borderRadius = "8px";
    confirmationModal.style.fontFamily = "Arial, sans-serif";
    confirmationModal.style.textAlign = "center";
    confirmationModal.style.zIndex = "10000";

    confirmationModal.innerText = `${business} languages have been saved!`;

    document.body.appendChild(confirmationModal);

    // Auto-close the modal after 1 second
    setTimeout(() => {
      confirmationModal.remove();
    }, 3000);
  };

  // Listen for messages to toggle the popup
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "togglePopup") {
      const existingContainer = document.getElementById(
        "languagePopupContainer"
      );
      if (existingContainer) {
        existingContainer.remove();
      } else {
        const bus_name = message.business_name;
        const lang_name = message.lang;
        console.log({
          bus_name,
          lang_name,
        });
        createPopup(bus_name, lang_name);
      }
    }
  });

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
    message.textContent =
      "Continue to extract business name with the selected languages";
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
      chrome.runtime.sendMessage({ action: "startFetchNext" });
      modal.remove();
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
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');`;
    document.head.appendChild(style);
  }
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "showConfirmation") {
      displayPop();
      console.log("confirm modal called");
    }
  });
}
