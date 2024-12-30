# AI Message Assistant Chrome Extension

This Chrome extension helps you send referral requests to recruiters on LinkedIn and apply for internships through Gmail. Upload your resume once, and the extension creates a summary to generate personalized messages. With one click, you can create messages designed for the platform and person you are sending them to. It also saves your last message, so you can reuse it easily without typing again. This tool saves time and makes professional communication simple and effective.

## Features

- **One-Time Resume Processing**: Upload your resume once during setup.
- **Smart Context Detection**: Automatically detects recipient details from LinkedIn or Gmail.
- **AI-Powered Messages**: Creates personalized messages using Google's Gemini AI.
- **Platform Integration**:
  - Seamlessly integrates with the LinkedIn message composer and gmail compose window.
- **Easy Message Management**: Preview, edit, and insert generated messages effortlessly.
- **Save Messages for Future Use**: Save messages for future reference and reuse them anytime.


## Tech Stack

### Frontend
- **React**: Used for building the Chrome Extension interface.
- **Tailwind CSS**: Provides responsive and modern UI styling.
- **Chrome Extension Manifest V3**: Ensures compatibility with the latest Chrome extension standards.
- **Chrome Local Storage**: Stores user data such as resume summaries and saved messages.

### Backend
- **Node.js & Express**: Handles API requests and serves backend functionalities.
- **Google Gemini AI API**: Powers the AI-based personalized message generation.


## Installation

### Prerequisites

- Node.js (v16+).
- Google Cloud Project with Gemini API enabled.
- Chrome browser.

### Backend Setup

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd AI-Message-Buddy/Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Extension Setup

1. Navigate to the extension directory:
   ```bash
    cd AI-Message-Buddy/Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome.
   - Go to `chrome://extensions/`.
   - Enable Developer mode.
   - Click "Load unpacked".
   - Select the `extension/build` directory.

## Usage
1. **Initial Setup**:  
   - Click on the extension icon.  
   - Follow the setup wizard.  
   - Upload your resume for processing.  

2. **Using on LinkedIn**:  
   - Open the LinkedIn message composer.  
   - Click the "Ask AI" button that appears.  
   - Review and edit the generated message.  
   - Save the message if needed.  

3. **Using on Gmail**:  
   - Open the Gmail compose window.  
   - Click the "Ask AI" button.  
   - Preview and edit the generated message.  
   - Save the message if needed.  

## Project Structure

```
AI-Message-Buddy/
├── Backend
│   ├── models
│   │   ├── message.js
│   │   ├── user.js
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
├── Frontend
│   ├── public
│   │   └── manifest.json
│   ├── src
│   │   ├── components
│   │   │   └── InitialSetup.jsx
│   │   ├── contentScripts
│   │   │   ├── gmail.js
│   │   │   └── linkedin.js
│   │   ├── services
│   │   │   └── apiService.js
│   │   ├── App.jsx
│   │   ├── background.js
│   │   ├── main.jsx
│   │   └── index.css
│   └── .eslintrc.js
├── dist
└── index.html

```

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## Troubleshooting

### Common Issues

1. **Extension not appearing**: Ensure the extension is enabled in Chrome.
2. **AI button not showing**:  After making changes to any frontend files, ensure that you rebuild the extension and refresh it in Chrome
3. **Message generation failed**: Ensure your gemini api key is correct 


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini AI for message generation.
- Chrome Extensions documentation.

