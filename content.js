// Create the button element
const button = document.createElement("button");

// Set attributes for the button
button.setAttribute("type", "button");
button.setAttribute("cdkfocusinitial", "");
button.className = "usa-button"; // Add the class

// Set the button text
button.textContent = "Create email alert";

// Add an event listener to show the popup when clicked
button.addEventListener("click", () => {
  // Create the popup container
  const popupContainer = document.createElement("div");
  popupContainer.style.position = "fixed";
  popupContainer.style.top = "50%";
  popupContainer.style.left = "50%";
  popupContainer.style.transform = "translate(-50%, -50%)";
  popupContainer.style.backgroundColor = "#fff";
  popupContainer.style.border = "1px solid #ccc";
  popupContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
  popupContainer.style.padding = "20px";
  popupContainer.style.zIndex = "10000";
  popupContainer.style.borderRadius = "8px";
  popupContainer.style.width = "300px";
  popupContainer.style.textAlign = "center";

  // Create the email input field
  const emailInput = document.createElement("input");
  emailInput.setAttribute("type", "email");
  emailInput.setAttribute("placeholder", "Enter your email");
  emailInput.setAttribute("class", "usa-input display-inline-block");

  // Create the description input field
  const descriptionInput = document.createElement("input");
  descriptionInput.setAttribute("placeholder", "Name your search");
  descriptionInput.setAttribute("class", "usa-input display-inline-block");

  // Create the submit button
  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit";
  submitButton.className = "usa-button";
  submitButton.style.marginTop = "10px";
  submitButton.style.width = "100%";
  submitButton.style.padding = "10px";

  // Create the Privacy Notice link
  const privacyLink = document.createElement("a");
  privacyLink.setAttribute("href", "https://argorand.io/privacy-notice/");
  privacyLink.setAttribute("target", "_blank");
  privacyLink.textContent = "Privacy Notice";
  privacyLink.style.display = "block";
  privacyLink.style.textAlign = "center";
  privacyLink.style.marginTop = "10px";
  privacyLink.style.color = "#0073e6";
  privacyLink.style.textDecoration = "none";
  privacyLink.style.fontSize = "14px";

  // Add hover effect
  privacyLink.addEventListener("mouseover", () => {
    privacyLink.style.textDecoration = "underline";
  });
  privacyLink.addEventListener("mouseout", () => {
    privacyLink.style.textDecoration = "none";
  });



  // Add event listener to submit button
  submitButton.addEventListener("click", () => {
    const email = emailInput.value;
    if (email) {
      chrome.storage.local.get("samApiUrl", (data) => {
        if (data.samApiUrl) {
          console.log("Most recent URL:", data.samApiUrl);
          fetch("https://api.argorand.com/samgov", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              "lastProcessedAt": new Date().getTime() + "",
              "email": emailInput.value,
              "description": descriptionInput.value,
              "query": data.samApiUrl
            })
          }).then(response => {
            console.log("Request sent to backend:", response.status);
          }).catch(error => {
            console.error("Error sending request to backend:", error);
          });
        } else {
          console.log("No URL saved yet.");
        }
      });
      document.body.removeChild(popupContainer); 
    } else {
      alert("Please enter a valid email address.");
    }
  });

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.style.position = "absolute";
  closeButton.style.top = "10px";
  closeButton.style.right = "10px";
  closeButton.style.backgroundColor = "transparent";
  closeButton.style.border = "none";
  closeButton.style.fontSize = "16px";
  closeButton.style.cursor = "pointer";
  closeButton.addEventListener("click", () => {
    document.body.removeChild(popupContainer); 
  });

  popupContainer.appendChild(closeButton);
  popupContainer.appendChild(descriptionInput);
  popupContainer.appendChild(emailInput);
  popupContainer.appendChild(submitButton);
  popupContainer.appendChild(privacyLink);


  document.body.appendChild(popupContainer);
});


let paginationElement = undefined;
const observer = new MutationObserver((mutations) => {
  const sdsPaginationElement = Array.from(document.querySelectorAll('sds-pagination'));
  console.log(`Found ${sdsPaginationElement.length} pagination elements`);
  if (sdsPaginationElement.length > 0) {
    for (let i = 0; i < sdsPaginationElement.length; i++) {
      console.log(sdsPaginationElement[i]);
      const sdsChildren = Array.from(sdsPaginationElement[i].querySelectorAll('*'));
      for (let j = 0; j < sdsChildren.length; j++) {
        if(/^Showing \d+ - \d+ of \d{1,3}(,\d{3})* results$/.test(sdsChildren[j].textContent.trim())) {
          paginationElement = sdsChildren[j];
          observer.disconnect();
          break;
        }
      }
      if (paginationElement != undefined) {
        paginationElement.appendChild(button);
        break;
      } 
    } 
  }
});
observer.observe(document.body, { childList: true, subtree: true });