import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const dataDir = path.join(__dirname, 'data');
const studentsFile = path.join(dataDir, 'students.json');

// Google Sheets setup
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const SPREADSHEET_ID = '1B-YRU3U8pW18lBv5NguXSAtrA71bKk5EHJssHgpk9t0';

// Helper to get tab name
function getTabName(section, subject, dateOrMonth) {
  // dateOrMonth: '2024-07-13' or '2024-07'
  // Always use yyyy-mm for tab name
  const month = dateOrMonth.slice(0, 7);
  return `${section}-${subject}-${month}`;
}

async function ensureSectionSheet(section, subject, month, students) {
  const tabName = getTabName(section, subject, month);
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  const res = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const allTabNames = res.data.sheets.map(s => s.properties.title);
  console.log('DEBUG: All tab names in sheet:', allTabNames);
  const exists = allTabNames.includes(tabName);
  if (!exists) {
    console.log('DEBUG: Creating new tab:', tabName);
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [{ addSheet: { properties: { title: tabName } } }],
      },
    });
    // Add header row: Name, Roll No
    const header = ['Name', 'Roll No'];
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${tabName}!A1:B1`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [header] },
    });
    // Add student rows
    const studentRows = students.map(s => [s.name, s.id]);
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${tabName}!A2:B${students.length + 1}`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: studentRows },
    });
  } else {
    console.log('DEBUG: Tab already exists:', tabName);
  }
}

async function appendAttendanceMatrix({ section, subject, date, attendance }) {
  let studentsData = JSON.parse(fs.readFileSync(studentsFile, 'utf-8'));
  const students = studentsData[section] || [];
  const tabName = getTabName(section, subject, date);
  console.log('DEBUG: Using tabName for attendance:', tabName);
  await ensureSectionSheet(section, subject, date, students);
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  // Get current header row
  const headerRes = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${tabName}!1:1`,
  });
  let header = headerRes.data.values ? headerRes.data.values[0] : ['Name', 'Roll No'];
  let dateCol = header.indexOf(date);
  if (dateCol === -1) {
    // Add new date column
    header.push(date);
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${tabName}!A1:${String.fromCharCode(65 + header.length - 1)}1`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [header] },
    });
    dateCol = header.length - 1;
  }
  // Get all student rows
  const studentRowsRes = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${tabName}!A2:B`,
  });
  const studentRows = studentRowsRes.data.values || [];
  // Build update data
  const idToRow = {};
  studentRows.forEach((row, idx) => { idToRow[row[1]] = idx; });
  const updates = [];
  for (const student of attendance) {
    const rowIdx = idToRow[student.id];
    if (rowIdx !== undefined) {
      // Update the correct cell
      const cell = `${String.fromCharCode(65 + dateCol)}${rowIdx + 2}`;
      updates.push({ range: `${tabName}!${cell}`, value: student.present ? 'P' : 'A' });
    }
  }
  // Batch update
  if (updates.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        data: updates.map(u => ({ range: u.range, values: [[u.value]] })),
        valueInputOption: 'USER_ENTERED',
      },
    });
  }
}

async function getAttendanceMatrix(section, subject, month) {
  let studentsData = JSON.parse(fs.readFileSync(studentsFile, 'utf-8'));
  const students = studentsData[section] || [];
  const tabName = getTabName(section, subject, month);
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  // Get header row
  const headerRes = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${tabName}!1:1`,
  });
  const header = headerRes.data.values ? headerRes.data.values[0] : ['Name', 'Roll No'];
  // Get all student rows
  const studentRowsRes = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${tabName}!A2:${String.fromCharCode(65 + header.length - 1)}`,
  });
  const studentRows = studentRowsRes.data.values || [];
  // Filter date columns for the selected month
  const dateCols = header.map((h, i) => ({ h, i })).filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d.h) && d.h.startsWith(month));
  // If no dateCols, return empty matrix and dateCols
  if (dateCols.length === 0) {
    return { header, dateCols: [], matrix: [] };
  }
  // Build matrix
  const matrix = studentRows.map(row => {
    const id = row[1];
    const name = row[0];
    const attendance = {};
    for (const d of dateCols) {
      attendance[d.h] = row[d.i] || '';
    }
    return { id, name, attendance };
  });
  return { header, dateCols, matrix };
}

// Get students by section (still from JSON)
app.get('/api/students', (req, res) => {
  const section = req.query.section;
  if (!section) return res.status(400).json({ error: 'Section required' });
  try {
    const studentsData = JSON.parse(fs.readFileSync(studentsFile, 'utf-8'));
    res.json(studentsData[section] || []);
  } catch (err) {
    console.error('Error reading students.json:', err);
    res.status(500).json({ error: 'Failed to read students data' });
  }
});

// Get attendance report (from Google Sheets)
app.get('/api/attendance', async (req, res) => {
  const { section, subject, month } = req.query;
  if (!section || !subject || !month) return res.status(400).json({ error: 'Section, subject, and month required' });
  try {
    const result = await getAttendanceMatrix(section, subject, month);
    res.json(result);
  } catch (err) {
    console.error('Error reading attendance from Google Sheets:', err);
    res.status(500).json({ error: 'Failed to read attendance data' });
  }
});

// Save attendance (to Google Sheets)
app.post('/api/attendance', async (req, res) => {
  const { section, subject, date, attendance } = req.body;
  console.log('POST /api/attendance called', { section, subject, date, attendance });
  if (!section || !subject || !date || !attendance) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  let studentsData = JSON.parse(fs.readFileSync(studentsFile, 'utf-8'));
  const studentsMap = {};
  for (const s of (studentsData[section] || [])) studentsMap[s.id] = s.name;
  const attendanceWithNames = attendance.map(a => ({ ...a, name: studentsMap[a.id] || a.id }));
  try {
    await appendAttendanceMatrix({ section, subject, date, attendance: attendanceWithNames });
    console.log('✅ Called appendAttendanceMatrix');
    res.json({ success: true });
  } catch (err) {
    console.error('Error writing attendance to Google Sheets:', err);
    res.status(500).json({ error: 'Failed to save attendance' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
