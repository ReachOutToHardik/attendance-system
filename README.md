# 🎓 Attendance System  

A complete **teacher-side attendance management system** for colleges/universities.  
Built with **Node.js, Express, and JavaScript**, with seamless **Google Sheets + Google Cloud** integration for real-time sync and secure backups.  

---

## 📖 About This Project  
The **Attendance System** is a web-based app designed for teachers to **efficiently mark, manage, and review student attendance**.  
It features a **clean, minimal UI** and integrates with Google services for **data storage, reporting, and backup**.  

✨ Designed for **scalability** → can be used across classes, sections, and subjects.  

---

## 🚀 Features  
- ✅ **Mark Attendance**: Select class, section, subject, and date → mark present/absent easily.  
- 📊 **Attendance Reports**: Generate detailed reports (by class/subject/month) and download them.  
- 📥 **Student Data Import**: Upload student lists via PDF or text files.  
- 🎨 **Modern UI/UX**: Responsive, distraction-free interface.  
- ☁️ **Google Sheets & Cloud Integration**: Automatic sync for transparency + secure backup.  
- 🔧 **Scalable & Customizable**: Extendable to fit any department or college.  

---

## ⚙️ How It Works  
1. **Mark Attendance** → Go to *Mark Attendance*, select class/subject/date, and submit.  
2. **View Reports** → Access *Reports* to filter by class/subject/month and download records.  
3. **Data Sync** → All data is saved locally **and** pushed to Google Sheets + Google Cloud.  

---

## 🛠️ Tech Stack  
- **Frontend** → HTML, CSS, JavaScript  
- **Backend** → Node.js (Express)  
- **Database/Storage** → JSON (local), Google Sheets & Google Cloud (cloud)  

---

## 📂 Folder Structure  
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
