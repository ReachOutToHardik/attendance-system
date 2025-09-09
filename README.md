# Attendance Platform

A modern, web-based attendance management system teachers. Mark, view, and manage attendance per section, subject, and date, with all data stored live in Google Sheets.

---

## Features

- **Mark Attendance:**
  - Select section (A/B/C), subject, and date
  - Mark students as present/absent with a clean, responsive UI
  - Attendance is saved directly to Google Sheets

- **View Attendance Report:**
  - Select section, subject, and month
  - See a date-wise grid (like Excel): students as rows, dates as columns
  - Color-coded for present/absent, sticky columns for easy navigation
  - No export button for a cleaner UI

- **Google Sheets as Database:**
  - Each Section-Subject-Month has its own tab (e.g., `A-Python-2024-07`)
  - Data is always live and accessible from anywhere
  - Easy to share, backup, or analyze in Google Sheets

- **No login required** (testing mode)
- **Mobile-friendly** and responsive

---

## Folder Structure

```
attendance-platform/
│
├── backend/
│   ├── data/
│   │   └── students.json         # Student list per section
│   ├── credentials.json          # Google service account key (not committed)
│   └── server.js                # Node.js/Express backend
│
├── frontend/
│   ├── index.html               # Homepage
│   ├── mark.html                # Mark attendance page
│   ├── report.html              # Attendance report page
│   ├── css/
│   │   └── styles.css           # Main stylesheet
│   ├── js/
│   │   ├── mark.js              # Mark attendance logic
│   │   ├── report.js            # Report dashboard logic
│   │   └── common.js            # (Optional) shared JS
│   └── libs/
│       └── xlsx.full.min.js     # (Optional, if you want Excel export)
│
└── README.md
```

---

## Setup & Usage

### 1. **Google Sheets Setup (One-Time, Free)**
- Create a Google Sheet (e.g., "Attendance Records")
- Enable Google Sheets API and Google Drive API in [Google Cloud Console](https://console.cloud.google.com/)
- Create a Service Account, download the JSON key as `credentials.json`, and place it in `backend/`
- Share your sheet with the service account email (from `credentials.json`) as Editor

### 2. **Install Backend Dependencies**
```
cd backend
npm install
```

### 3. **Start the Backend Server**
```
node server.js
```
- The server runs on [http://localhost:3001](http://localhost:3001)

### 4. **Run the Frontend**
- Serve the `frontend/` folder using a static server (e.g., Python's `http.server`):
```
cd frontend
python -m http.server 5500
```
- Open [http://localhost:5500/index.html](http://localhost:5500/index.html) in your browser

### 5. **Mark and View Attendance**
- Mark attendance for any section/subject/date
- View the report for any section/subject/month
- Data is always live in Google Sheets, in tabs like `A-Python-2024-07`

---

## Importing Student List

To import your student list:
1. Prepare your list in a text file (e.g., `studentslist/extracted.txt`).
2. Format it as JSON like this:
   ```json
   {
     "A": [ { "id": "SAMPLE001", "name": "Student Name" }, ... ],
     "B": [ { "id": "SAMPLE002", "name": "Student Name" }, ... ],
     "C": [ { "id": "SAMPLE003", "name": "Student Name" }, ... ]
   }
   ```
3. Paste the formatted data into `backend/data/students.json`.
4. Restart the backend server.

**Tip:** Use online tools or a script to convert text lists to JSON.

---

## Security & Publishing Notes

- **Do NOT commit real credentials or personal student data to GitHub.**
- Always use sample/demo data in `students.json` and `attendance.json` before publishing.
- Add `backend/credentials.json` and data files to `.gitignore`.
- Review your code for hardcoded secrets, IPs, or personal info before publishing.

---

## Improvements & Contributions

- Add authentication for teachers/students.
- Add export options (Excel, PDF).
- Improve UI/UX and accessibility.
- Add error handling and validation.
- Contributions welcome!

---

## How Data is Stored in Google Sheets
- **Each tab = one Section-Subject-Month** (e.g., `B-Java-2024-08`)
- **Rows:** Students (Name, Roll No)
- **Columns:** Dates (YYYY-MM-DD)
- **Cells:** 'P' for Present, 'A' for Absent
- Marking attendance for the same date will overwrite previous values for that date

---

## Customization & Notes
- To add/remove students, edit `backend/data/students.json`
- To change Google Sheet, update `SPREADSHEET_ID` in `backend/server.js`
- To deploy online, host the frontend (e.g., GitHub Pages) and backend (e.g., Render, Heroku)
- No login/authentication is included (testing mode)

---

## Credits
- Created by Hardik Joshi

---

**For any issues or help, contact Hardik Joshi.**