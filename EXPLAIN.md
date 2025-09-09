# What Does This Attendance Platform Do?

This web-based platform helps BCA 3rd semester teachers easily mark and view student attendance for every subject, section, and day. It is designed to be simple, fast, and usable on any device.

---

## What Does It Do?

- **Mark Attendance:**
  - Teachers select a section (A/B/C), subject, and date.
  - They see a list of students and tick who is present.
  - With one click, attendance is saved.

- **View Attendance Report:**
  - Teachers select a section, subject, and month.
  - The platform shows a grid (like Excel):
    - Rows = students
    - Columns = each day of the month
    - Each cell shows if the student was present (✔️) or absent (❌)
  - The grid is color-coded and easy to read.

- **All Data is Live in Google Sheets:**
  - Every time attendance is marked, it is saved in a Google Sheet.
  - Each section, subject, and month has its own tab (e.g., `A-Python-2024-07`).
  - Teachers can view or share the Google Sheet at any time.

---

## How Does It Work?

1. **No Login Needed:**
   - Any teacher can use the site (for testing/demo mode).

2. **Marking Attendance:**
   - The teacher opens the Mark Attendance page.
   - Selects section, subject, and date.
   - Checks the boxes for present students.
   - Clicks "Submit"—the data is sent to the backend.
   - The backend updates the correct Google Sheet tab for that section, subject, and month.

3. **Viewing Reports:**
   - The teacher opens the Report page.
   - Selects section, subject, and month.
   - The site fetches the data from the correct Google Sheet tab.
   - The dashboard shows a grid with all students and all dates for that month.

4. **Google Sheets as Database:**
   - The backend creates a new tab in the Google Sheet for each Section-Subject-Month if it doesn't exist.
   - The tab has all students as rows and all dates as columns.
   - Marking attendance for the same date will update (overwrite) the previous value for that date.

---

## Why Is This Useful?
- No more paper registers or manual Excel files.
- All data is always backed up and shareable in Google Sheets.
- Teachers can see attendance patterns at a glance.
- Works on any device—no app install needed.

---

**In short:**
- Teachers mark and view attendance in a few clicks.
- Everything is saved and organized in Google Sheets.
- The platform is simple, fast, and always up-to-date.