import React, { useState, useEffect } from "react";
import { FileText, Trash, Loader } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const InitialSetup = ({ onComplete }) => {
	const [file, setFile] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [resumeUploaded, setResumeUploaded] = useState(false);

	useEffect(() => {
		chrome.storage.local.get(["resumeSummary"], (result) => {
			if (result.resumeSummary) {
				setResumeUploaded(true);
			}
		});
	}, []);

	const validateFile = (file) => {
		if (file.type !== "application/pdf") {
			setFile(null);
			toast.error("Please upload a PDF file only");
			return false;
		}
		return true;
	};

	const handleFileChange = (e) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile && validateFile(selectedFile)) {
			setFile(selectedFile);
		}
	};

	const handleRemoveFile = () => {
		setFile(null);
	};

	const handleUpload = async (e) => {
		e.preventDefault();
		if (!file) return;
		setIsLoading(true);

		const formData = new FormData();
		formData.append("resume", file);

		try {
			const response = await fetch(
				"http://localhost:5000/api/users/resume",
				{
					method: "POST",
					body: formData,
				}
			);
			const data = await response.json();

			if (!data.resumeSummary) {
				toast.error("Resume could not be processed. Please try again.");
				return;
			}

			chrome.runtime.sendMessage(
				{
					action: "saveResumeSummary",
					data: { resumeSummary: data.resumeSummary },
				},
				(response) => {
					if (response.success) {
						// wait for the toast to appear
						toast.success("Resume uploaded successfully!");
						setTimeout(() => {
							setResumeUploaded(true);
							onComplete();
						}, 1000);
					}
				}
			);
		} catch (error) {
			console.error("Error processing resume:", error);
			toast.error("Failed to process resume. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-[20vh] flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-4">
			<div className="w-[32rem] bg-white rounded-lg shadow-lg p-6">
				<div className="text-center">
					<h2 className="text-2xl font-bold mb-4">
						{resumeUploaded ? (
							<div className="flex items-center justify-center gap-2 text-green-700">
								<FileText className="h-6 w-6" /> Resume Uploaded
								Successfully
							</div>
						) : (
							"Upload Your Resume"
						)}
					</h2>

					{!resumeUploaded && (
						<form onSubmit={handleUpload} className="space-y-4">
							<div className="border-2 border-dashed rounded-lg p-6 text-center transition-all border-blue-500 bg-blue-50">
								{!file ? (
									<label className="flex flex-col items-center cursor-pointer text-blue-600 hover:text-blue-700">
										<FileText className="h-8 w-8 mb-2" />
										<span className="font-medium">
											Browse Files to upload
										</span>
										<input
											type="file"
											className="hidden"
											accept=".pdf"
											onChange={handleFileChange}
										/>
									</label>
								) : (
									<div className="flex items-center justify-between px-3 py-2 bg-blue-100 rounded-lg">
										<span className="text-blue-600 flex items-center gap-2">
											<FileText className="h-5 w-5" />{" "}
											{file.name}
										</span>
										<button
											type="button"
											className="text-red-600 hover:text-red-700"
											onClick={handleRemoveFile}
										>
											<Trash className="h-4 w-4" />
										</button>
									</div>
								)}
							</div>

							<button
								type="submit"
								disabled={!file || isLoading}
								className="w-full bg-indigo-700 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-800 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors duration-300"
							>
								{isLoading ? (
									<>
										<Loader className="animate-spin h-5 w-5" />{" "}
										Processing...
									</>
								) : (
									"Upload Resume"
								)}
							</button>
						</form>
					)}
				</div>
			</div>
			<Toaster
				position="top-center"
				toastOptions={{
					duration: 3000,
					style: {
						background: "#333",
						color: "#fff",
						padding: "12px",
						borderRadius: "6px",
					},
				}}
			/>
		</div>
	);
};

export default InitialSetup;
