import React, { useEffect, useState } from "react";
import InitialSetup from "./components/InitialSetup";
import toast from "react-hot-toast";

const App = () => {
	const [resumeUploaded, setResumeUploaded] = useState(false);

	useEffect(() => {
		// Check if a resume summary exists in storage
		chrome.storage.local.get(["resumeSummary"], (result) => {
			setResumeUploaded(!!result.resumeSummary);
		});
	}, []);

	const handleSetupComplete = () => {
		setResumeUploaded(true);
	};
	const handleResumeRemoved = () => {
		// Remove all relevant keys from chrome.storage.local
		chrome.storage.local.remove(
			[
				"resumeSummary",
				"lastGeneratedResponse",
				"lastLinkedinGeneratedResponse",
				"isSetupComplete",
			],
			() => {
				toast.success(
					"Resume and all associated data removed successfully!"
				);
				// wait for the toast to disappear
				setTimeout(() => {
					setResumeUploaded(false);
				}, 5000);
			}
		);
	};

	return (
		<div className=" flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 ">
			<div className="w-[32rem] bg-white rounded-lg shadow-lg p-6">
				{resumeUploaded ? (
					<div className="text-center space-y-6">
						<h1 className="text-base font-bold text-indigo-700">
							AI Message Assistant
						</h1>
						<p className="text-base text-gray-700">
							Your resume has been uploaded successfully! You can
							now use the extension to get personalized
							assistance.
						</p>
						<div className="flex justify-center">
							<button
								onClick={handleResumeRemoved}
								className="px-6 py-3 bg-red-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-300"
							>
								Remove Resume
							</button>
						</div>
					</div>
				) : (
					<InitialSetup onComplete={handleSetupComplete} />
				)}
			</div>
		</div>
	);
};

export default App;
