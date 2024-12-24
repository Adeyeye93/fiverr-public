const DATA = new Map([
  ["fullName", ""],
  ["username", ""],
  ["following", 0],
  ["yourLoc", ""],
  ["bio", ""],
  ["follower", 0],
  ["LikedPost", 0],
  ["totalPost", 0],
  ["lastPosted", ""],
  ["DateJoined", ""],
  ["Media", ""],
  ["accountType", ""],
  ["yourLastLike", ""],
  ["yourTotalPostLike", 0],
  ["yourTotalPostView", 0],
  ["yourPosts", new Map()],
]);

const script = document.createElement("script");
script.src =
  "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
script.onload = () => {
  console.log("html2canvas loaded");
};

const observerLoad = new MutationObserver((mutations) => {
  mutations.forEach(() => {
    // Start from the <main> element
    const mainElement = document.querySelector("main");

    if (mainElement) {
      // Extract relevant data
      const fullName = document.querySelector(
        'div[data-testid="UserName"] span'
      )?.textContent;
      DATA.set("fullName", fullName);
      const post = getElementByXpath(
        "/html/body/div[1]/div/div/div[2]/main/div/div/div/div/div/div[1]/div[1]/div/div/div/div/div/div[2]/div/div"
      )?.textContent;
      DATA.set("totalPost", post);
      const following = document.querySelector(
        "#react-root > div > div > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz > main > div > div > div > div.css-175oi2r.r-14lw9ot.r-jxzhtn.r-1ua6aaf.r-th6na.r-1phboty.r-16y2uox.r-184en5c.r-1abdc3e.r-1lg4w6u.r-f8sm7e.r-13qz1uu.r-1ye8kvj > div > div:nth-child(3) > div > div > div:nth-child(2) > div > div > div > div.css-175oi2r.r-3pj75a.r-ttdzmv.r-1ifxtd0 > div.css-175oi2r.r-13awgt0.r-18u37iz.r-1w6e6rj > div.css-175oi2r.r-1rtiivn > a > span.css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3.r-1b43r93.r-1cwl3u0.r-b88u0q > span"
      )?.textContent;
      const joinedDate = document.querySelector(
        '[data-testid="UserJoinDate"]'
      )?.textContent;
      DATA.set("DateJoined", joinedDate);
      const location = document.querySelector(
        '[data-testid="UserLocation"]'
      )?.textContent;
      DATA.set("yourLoc", location);
      const Bio = document.querySelector(
        '[data-testid="UserDescription"]'
      )?.textContent;
      DATA.set("bio", Bio);
      const accountType = document.querySelector(
        '[data-testid="accountType"]'
      )?.textContent;
      // Find all <span> elements
      const allSpans = document.querySelectorAll("span");

      // Filter to find the first <span> that contains "@"
      const targetElement = Array.from(allSpans).find((span) =>
        span.textContent.includes("@")
      );

      const username = targetElement.textContent;
      function getElementByXpath(path) {
        const element = document.evaluate(
          path,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;

        return element ? element.textContent.trim() : null; // Return text content or null if element is not found
      }
      DATA.set("username", username);
      console.log(DATA);
    } else {
      console.error("<main> element not found on the page");
    }
  });
});
observerLoad.observe(document.body, { childList: true, subtree: true });

// Select the element with aria-label="Profile"
const profileElement = document.querySelector('[aria-label="Profile"]');

// Check if the element exists
if (profileElement) {
  // Click the element
  profileElement.click();
  console.log("Clicked on the profile element");
} else {
  console.log('Element with aria-label="Profile" not found');
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "ExtractData") {
  }
});

// Scroll to the bottom of the page
function scrollToBottom() {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth", // Smooth scrolling
  });
}

// console.log(DATA.get("username")); // Output: "new_user"

// // Example: Adding values to `yourPosts` (nested Map)
// const yourPosts = DATA.get("yourPosts");
// yourPosts.set("postId1", { title: "First Post", likes: 10 });
// yourPosts.set("postId2", { title: "Second Post", likes: 20 });

// console.log(yourPosts);
// Output: Map(2) { 'postId1' => { title: 'First Post', likes: 10 }, 'postId2' => { title: 'Second Post', likes: 20 } }

// Example: Iterating through the outer Map
// DATA.forEach((value, key) => {
//   console.log(`${key}: ${value instanceof Map ? "Map content" : value}`);
// });
// Output:
// fullName:
// username: new_user
// noOfLikes: 0
// lastPosted:
// Media:
// accountType:
// lastLike:
// yourPosts: Map content

function extractor() {
  const elements = document.querySelectorAll('div[data-testid="cellInnerDiv"]');

  elements.forEach((element, index) => {
    // Scroll to the element
    element.scrollIntoView({ behavior: "smooth", block: "center" });

    // Wait for scrolling to complete
    setTimeout(() => {
      html2canvas(element).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `screenshot-${index + 1}.png`;
        link.click();
      });
    }, 1000); // Adjust delay as needed
  });
}
