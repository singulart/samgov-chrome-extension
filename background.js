var onBeforeRequestListener = function (options) {
  if (options.method === "GET" && options.url.startsWith("https://sam.gov/api/prod/sgs/v1/search")) {
    // Save the URL to local storage, overriding any previous value
    chrome.storage.local.set({ samApiUrl: options.url }, () => {
      console.log("SAM Rest URL saved:", options.url);
    });
  }
}

chrome.webRequest.onBeforeRequest.addListener(onBeforeRequestListener, {
  urls: ["https://sam.gov/*"]
}, []);

