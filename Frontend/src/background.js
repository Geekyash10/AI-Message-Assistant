chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "saveResumeSummary") {
		chrome.storage.local.set(
			{
				resumeSummary: message.data.resumeSummary,
				isSetupComplete: true,
			},
			() => {
				sendResponse({
					success: true,
					message: "Resume summary saved successfully!",
				});
			}
		);
		return true;
	}

	if (message.action === "getResumeSummary") {
		chrome.storage.local.get(["resumeSummary"], (result) => {
			sendResponse({ success: true, data: result.resumeSummary });
		});
		return true;
	}

	if (message.action === "saveGeneratedResponse") {
		chrome.storage.local.set(
			{ lastGeneratedResponse: message.data.message },
			() => {
				sendResponse({
					success: true,
					message: "Generated response saved successfully!",
				});
			}
		);
		return true;
	}

	if (message.action === "getLastGeneratedResponse") {
		chrome.storage.local.get(["lastGeneratedResponse"], (result) => {
			sendResponse({ success: true, data: result.lastGeneratedResponse });
		});
		return true;
	}

	if (message.action === "saveLinkedinGeneratedResponse") {
		chrome.storage.local.set(
			{ lastLinkedinGeneratedResponse: message.data.message },
			() => {
				sendResponse({
					success: true,
					message: "Generated response saved successfully!",
				});
			}
		);
		return true;
	}

	if (message.action === "getLastLinkedinGeneratedResponse") {
		chrome.storage.local.get(
			["lastLinkedinGeneratedResponse"],
			(result) => {
				sendResponse({
					success: true,
					data: result.lastLinkedinGeneratedResponse,
				});
			}
		);
		return true;
	}
});
