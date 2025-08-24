# wa-timed-message
A simple script for sending scheduled WhatsApp messages built with whatsapp-web.js

Prerequisites
- Before running this project, make sure you have:
- Node.js v16+ installed
- npm (comes with Node.js)
- A WhatsApp account (must scan QR on first run)
- Access to the group (you don’t need to be admin, just a member)
- A Google Cloud Project with Google Sheets API enabled

Installation

1. Clone this repo:
git clone https://github.com/bonoemarizade/wa-timed-message.git
cd wa-timed-message

2. Install dependencies:
npm install

3. Setup Google Sheets API credentials:
- Go to Google Cloud Console
- Create a new project (or select existing)
- Go to APIs & Services > Library
- Enable Google Sheets API
- Enable Google Drive API (needed to access spreadsheets)
- Go to APIs & Services > Credentials
- Click Create Credentials → Service Account
- Give it a name and role (e.g., “Editor”)
- After creation, click on the service account → Keys → Add Key → Create new key → JSON
- Save the downloaded JSON file as credentials.json inside the project root
- Share your target Google Sheet with the service account email (something like xxxx@xxxx.iam.gserviceaccount.com) and give Editor/Viewer access.

4. Replace the SPREADSHEET_ID and RANGE with your Sheets setup
5. Get the group id by:
npm run group
6. Replace the groupId with your desired group
7. Run the script:
npm run start
