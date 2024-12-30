const BUTTON_SELECTOR = "msg-overlay-conversation-bubble__content-wrapper";
async function extractContext() {
	const url = window.location.href;
	console.log("URL:", url);

	const nameMatch = url.match(/[?&]keywords=([^&]+)/);
	const name = nameMatch
		? decodeURIComponent(nameMatch[1]).replace(/\+/g, " ")
		: "Unknown Recipient";

	return {
		name,
		platform: "linkedin",
	};
}

// Function to create the "Ask AI" button
function createAIButton() {
	const button = document.createElement("button");
	button.type = "button";
	button.innerHTML = "Ask AI";
	button.className = "ai-message-button";
	button.style.cssText = `
    background-color: #0a66c2;
    color: white;
    padding: 4px 12px;
    border-radius: 16px;
    border: none;
    margin: 0 4px;
    cursor: pointer;
  `;
	button.addEventListener("click", handleAIClick);
	return button;
}

// Function to create the "Use Last Response" button
function createUseLastResponseButton() {
	const button = document.createElement("button");
	button.innerHTML = "Last Response";
	button.className = "use-last-response-button";
	button.style.cssText = `
    background-color: #0a66c2;
    color: white;
    padding: 4px 12px;
    border-radius: 16px;
    border: none;
    margin: 0 4px;
    cursor: pointer;
  `;
	button.addEventListener("click", handleUseLastResponseClick);
	return button;
}

// Function to get the resume summary via chrome.runtime.sendMessage
async function getResumeSummary() {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage(
			{ action: "getResumeSummary" },
			(response) => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				} else if (response && response.success) {
					resolve(response.data);
				} else {
					reject(new Error("Failed to get resume summary"));
				}
			}
		);
	});
}

// Function to save the generated response
async function saveGeneratedResponse(message) {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage(
			{ action: "saveLinkedinGeneratedResponse", data: { message } },
			(response) => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				} else if (response && response.success) {
					// show a success message
					alert("Response saved successfully!");
					resolve();
				} else {
					reject(new Error("Failed to save the generated response"));
				}
			}
		);
	});
}

// Function to retrieve the last saved response
async function getLastGeneratedResponse() {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage(
			{ action: "getLastLinkedinGeneratedResponse" },
			(response) => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				} else if (response && response.success) {
					resolve(response.data);
				} else {
					reject(new Error("No saved response found"));
				}
			}
		);
	});
}

// Function that handles the "Ask AI" button click
async function handleAIClick(event) {
	event.preventDefault();
	const button = event.target;

	// If the button is already "Save Response", we save the response
	if (button.innerHTML === "Save") {
		const composeBox = document.querySelector(
			".msg-form__contenteditable p"
		);
		const lastMessage = composeBox?.innerHTML.replace(/<br>/g, "\n");

		if (lastMessage) {
			await saveGeneratedResponse(lastMessage);
			button.innerHTML = "Saved!";
		}
		return;
	}

	try {
		const context = await extractContext();
		const resumeSummary = await getResumeSummary();
		if (!resumeSummary) {
			alert("Please upload your resume first in the extension popup.");
			return;
		}

		// Fetch the AI-generated message
		const response = await fetch(
			"http://localhost:5000/api/messages/generate",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ context, resumeSummary }),
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const { message } = await response.json();

		// Find the message box and insert the generated message
		const messageBox = document.querySelector(
			".msg-form__contenteditable p"
		);
		if (messageBox) {
			messageBox.innerHTML = message.replace(/\n/g, "<br>");

			// Change the button to "Save Response"
			button.innerHTML = "Save";
		} else {
			console.warn("Message box not found.");
		}
	} catch (error) {
		console.error("Error generating message:", error);
		alert("Error generating message. Please try again.");
	}
}

// Function to handle the "Use Last Response" button click
async function handleUseLastResponseClick() {
	try {
		const lastResponse = await getLastGeneratedResponse();
		if (!lastResponse) {
			alert("No saved response found.");
			return;
		}

		const messageBox = document.querySelector(
			".msg-form__contenteditable p"
		);
		if (messageBox) {
			messageBox.innerHTML = lastResponse.replace(/\n/g, "<br>");
			alert("Last response inserted successfully!");
		} else {
			console.warn("Message box not found.");
		}
	} catch (error) {
		console.error("Error retrieving last response:", error);
		alert("Failed to retrieve the last saved response. Please try again.");
	}
}

// Function to initialize and inject the buttons on LinkedIn
function init() {
	const observer = new MutationObserver(async () => {
		const toolbar = document.querySelector(".msg-form__footer");
		if (toolbar) {
			if (!document.querySelector(".ai-message-button")) {
				toolbar.appendChild(createAIButton());
			}

			const savedResponse = await getLastGeneratedResponse().catch(
				() => null
			);
			if (
				savedResponse &&
				!document.querySelector(".use-last-response-button")
			) {
				toolbar.appendChild(createUseLastResponseButton());
			}
		}
	});

	observer.observe(document.body, { childList: true, subtree: true });
}

// Initialize the script
init();
