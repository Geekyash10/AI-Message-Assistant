# AI Message Assistant Chrome Extension

A Chrome extension that helps users create personalized messages for LinkedIn and Gmail using AI. The extension processes your resume once, stores a summary, and generates contextual messages with just one click.

## Features

- **One-time Resume Processing**: Upload your resume during initial setup.
- **Smart Context Detection**: Automatically extracts recipient details from LinkedIn/Gmail.
- **AI-Powered Messages**: Generates personalized messages using Google's Gemini AI.
- **Platform Integration**:
  - LinkedIn message composer integration.
  - Gmail compose window integration.
- **Easy Message Management**: Preview, edit, and insert generated messages.

## Tech Stack

- **Frontend**:
  - React (Chrome Extension).
  - Tailwind CSS.
  - Chrome Extension Manifest V3.

- **Backend**:
  - Node.js & Express.
  - MongoDB.
  - Google Gemini AI API.

## Installation

### Prerequisites

- Node.js (v16+).
- MongoDB.
- Google Cloud Project with Gemini API enabled.
- Chrome browser.

### Backend Setup

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd ai-message-assistant/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   MONGODB_URI=your_mongodb_uri
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
   cd ../extension
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
   - Click the extension icon.
   - Follow the setup wizard.
   - Upload your resume.

2. **Using on LinkedIn**:
   - Open any LinkedIn message composer.
   - Click the "Ask AI" button that appears.
   - Preview and edit the generated message.
   - Insert it into the message box.

3. **Using on Gmail**:
   - Open the Gmail compose window.
   - Click the "Ask AI" button.
   - Preview and edit the generated message.
   - Insert it into the email body.

## Project Structure

```
ai-message-assistant/
├── extension/               # Chrome Extension
│   ├── public/             # Extension assets
│   └── src/                # Extension source code
│       ├── components/     # React components
│       ├── contentScripts/ # LinkedIn & Gmail integration
│       ├── services/       # API services
│       └── utils/          # Utility functions
│
└── server/                 # Backend Server
    ├── config/             # Configuration files
    ├── models/             # MongoDB schemas
    ├── controllers/        # Request handlers
    ├── services/           # Business logic
    └── routes/             # API endpoints
```

## API Endpoints

### User Routes
- `POST /api/users/resume` - Upload and process resume.
- `GET /api/users/profile` - Get user profile and resume summary.

### Message Routes
- `POST /api/messages/generate` - Generate AI message.
- `POST /api/messages/save` - Save generated message (optional).

## Development

### Extension Development

```bash
cd extension
npm run dev
```

### Server Development

```bash
cd server
npm run dev
```

## Testing

```bash
# Run backend tests
cd server
npm test

# Run extension tests
cd extension
npm test
```

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## Configuration Options

### Extension Config

```javascript
// config.js
export const CONFIG = {
  API_URL: 'http://localhost:5000',
  STORAGE_KEYS: {
    USER_PROFILE: 'userProfile',
    RESUME_SUMMARY: 'resumeSummary'
  }
};
```

### Server Config

```javascript
// config.js
export const CONFIG = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY
};
```

## Troubleshooting

### Common Issues

1. **Extension not appearing**: Ensure the extension is enabled in Chrome.
2. **AI button not showing**: Try refreshing the page.
3. **Message generation failed**: Check server logs and Gemini API quota.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini AI for message generation.
- Chrome Extensions documentation.
- MongoDB documentation.
