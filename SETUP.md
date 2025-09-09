# ⚙️ Setup & Usage  

Follow these steps to run the project locally.  

---

## 1️⃣ Google Sheets Setup (One-Time)  
1. Create a Google Sheet (e.g., *Attendance Records*).  
2. Enable **Google Sheets API** and **Google Drive API** in [Google Cloud Console](https://console.cloud.google.com/).  
3. Create a Service Account, download the JSON key → save it as `backend/credentials.json`.  
4. Share the Google Sheet with the service account email (Editor access).  

---

## 2️⃣ Install Backend Dependencies  
Open a terminal in the `backend` folder and run:  
cd backend
npm install

---

## 3️⃣ Start the Backend Server

node server.js
The backend runs on: http://localhost:3001

---

## 4️⃣ Run the Frontend
Serve the frontend/ folder using any static server (Python example shown):

cd frontend
python -m http.server 5500
Now open → http://localhost:5500/index.html

---

## 5️⃣ Mark and View Attendance
Go to Mark Attendance → Select class/section/subject/date → Submit.

Go to Reports → View/download attendance by class/subject/month.

Data is synced live to Google Sheets (tabs named like A-Python-2024-07).

---

## 📥 Importing Student List
Prepare a text file (e.g., studentslist/extracted.txt).

Convert it to JSON format like:

{
  "A": [ { "id": "SAMPLE001", "name": "Student Name" } ], <br>
  "B": [ { "id": "SAMPLE002", "name": "Student Name" } ], <br>
  "C": [ { "id": "SAMPLE003", "name": "Student Name" } ]  <br>
}
Paste into backend/data/students.json.
