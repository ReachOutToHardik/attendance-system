document.addEventListener('DOMContentLoaded', () => {
  const sectionSelect = document.getElementById('section');
  const subjectSelect = document.getElementById('subject');
  const monthInput = document.getElementById('month');
  const form = document.getElementById('report-form');
  const reportTable = document.getElementById('report-table');

  // Set default month to current month
  if (monthInput && !monthInput.value) {
    const now = new Date();
    const month = now.toISOString().slice(0, 7);
    monthInput.value = month;
  }

  let lastGrid = [];
  let lastDates = [];

  form.addEventListener('submit', e => {
    e.preventDefault();
    const section = sectionSelect.value;
    const subject = subjectSelect.value;
    const month = monthInput.value; // format: yyyy-mm
    if (!month) {
      reportTable.innerHTML = '<em>Please select a month.</em>';
      return;
    }
    fetch(`http://localhost:3001/api/attendance?section=${section}&subject=${subject}&month=${month}`)
      .then(res => res.json())
      .then(data => {
        if (!data || !data.matrix || !data.matrix.length || !data.dateCols || !data.dateCols.length) {
          reportTable.innerHTML = '<em>No data found for this selection.</em>';
          return;
        }
        const dates = data.dateCols.map(d => d.h);
        const grid = data.matrix.map(r => {
          const row = { id: r.id, name: r.name };
          dates.forEach(date => {
            if (r.attendance[date] === 'P') row[date] = '✔️';
            else if (r.attendance[date] === 'A') row[date] = '❌';
            else row[date] = '';
          });
          return row;
        });
        lastGrid = grid;
        lastDates = dates;
        renderGrid(grid, dates);
      });
  });

  function renderGrid(grid, dates) {
    if (!grid.length || !dates.length) {
      reportTable.innerHTML = '<em>No data found for this selection.</em>';
      return;
    }
    let html = '<table><thead><tr>';
    html += '<th class="sticky-col">Student Name</th><th class="sticky-col-2">Student ID</th>';
    html += dates.map(date => `<th>${date}</th>`).join('');
    html += '</tr></thead><tbody>';
    html += grid.map(r => {
      let row = `<tr><td class="sticky-col">${r.name}</td><td class="sticky-col-2">${r.id}</td>`;
      row += dates.map(date => {
        if (r[date] === '✔️') return '<td class="present">✔️</td>';
        if (r[date] === '❌') return '<td class="absent">❌</td>';
        return '<td></td>';
      }).join('');
      row += '</tr>';
      return row;
    }).join('');
    html += '</tbody></table>';
    reportTable.innerHTML = html;
  }
});
