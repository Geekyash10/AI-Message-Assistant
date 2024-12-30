export const uploadResume = async (formData) => {
	try {
		const response = await fetch("http://localhost:5000/api/users/resume", {
			method: "POST",
			body: formData,
		});
		return await response.json();
	} catch (error) {
		console.error("API Error:", error);
		throw error;
	}
};
