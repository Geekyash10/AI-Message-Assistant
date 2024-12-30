const COMPOSE_SELECTOR = ".Am.Al.editable";

function createAIButton() {
	const button = document.createElement("button");
	button.innerHTML = "Ask AI";
	button.className = "ai-gmail-button";
	button.style.cssText = `
        background-color: #0b57d0;
        color: white;
        padding: 8px 16px;
        border-radius: 16px;
        border: none;
        margin: 0 8px;
        cursor: pointer;
    `;
	button.addEventListener("click", handleAIClick);
	return button;
}

function createUseLastResponseButton() {
	const button = document.createElement("button");
	button.innerHTML = "Last Response";
	button.className = "use-last-response-button";
	button.style.cssText = `
         background-color: #0b57d0;
        color: white;
        padding: 8px 16px;
        border-radius: 16px;
        border: none;
        margin: 0 8px;
        cursor: pointer;
    `;
	button.addEventListener("click", handleUseLastResponseClick);
	return button;
}

async function extractContext() {
	const recipient = document.querySelector('[name="to"]')?.value;
	const subject = document.querySelector('[name="subjectbox"]')?.value;

	return {
		recipient,
		subject,
		platform: "gmail",
	};
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

// Function to get the last generated response via chrome.runtime.sendMessage
async function getLastGeneratedResponse() {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage(
			{ action: "getLastGeneratedResponse" },
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

// Function to save the generated response
async function saveGeneratedResponse(message) {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage(
			{ action: "saveGeneratedResponse", data: { message } },
			(response) => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				} else if (response && response.success) {
					resolve();
				} else {
					reject(new Error("Failed to save the generated response"));
				}
			}
		);
	});
}

// Function to handle the AI button click
async function handleAIClick(event) {
	const button = event.target;
	const isSaveButton = button.innerHTML === "Save";

	if (isSaveButton) {
		const composeBox = document.querySelector(COMPOSE_SELECTOR);
		const lastMessage = composeBox?.innerHTML.replace(/<br>/g, "\n");
		if (lastMessage) {
			try {
				await saveGeneratedResponse(lastMessage);
				alert("Response saved successfully!");
			} catch (error) {
				console.error("Error saving response:", error);
				alert("Failed to save the response. Please try again.");
			}
		}
		return;
	}

	button.disabled = true;
	button.innerHTML = "Generating...";

	try {
		const context = await extractContext();
		const resumeSummary = await getResumeSummary();

		if (!resumeSummary) {
			alert("Please upload your resume first in the extension popup.");
			button.innerHTML = "Ask AI";
			button.disabled = false;
			return;
		}

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

		const composeBox = document.querySelector(COMPOSE_SELECTOR);
		if (composeBox) {
			composeBox.innerHTML = message.replace(/\n/g, "<br>");
			button.innerHTML = "Save Response";
		} else {
			throw new Error("Compose box not found");
		}
	} catch (error) {
		console.error("Error:", error);
		alert("Error generating message. Please try again.");
	} finally {
		button.disabled = false;
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

		const composeBox = document.querySelector(COMPOSE_SELECTOR);
		if (composeBox) {
			composeBox.innerHTML = lastResponse.replace(/\n/g, "<br>");
		} else {
			throw new Error("Compose box not found");
		}
	} catch (error) {
		console.error("Error retrieving last response:", error);
		alert("Failed to retrieve the last saved response. Please try again.");
	}
}

// Function to initialize the content script

function init() {
	const observer = new MutationObserver(async () => {
		const toolbar = document.querySelector(".gU.Up");
		if (toolbar) {
			if (!document.querySelector(".ai-gmail-button")) {
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

init();
