document.addEventListener('DOMContentLoaded', () => {
  const sectionSelect = document.getElementById('section');
  const subjectSelect = document.getElementById('subject');
  const dateInput = document.getElementById('date');
  const studentsList = document.getElementById('students-list');
  const form = document.getElementById('attendance-form');

  // Set default date to today
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;

  function loadStudents() {
    const section = sectionSelect.value;
    studentsList.innerHTML = '<div class="loading">Loading...</div>';
    fetch('http://localhost:3001/api/students?section=' + section)
      .then(res => res.json())
      .then(students => {
        if (!students.length) {
          studentsList.innerHTML = '<em>No students found for this section.</em>';
          return;
        }
        // Use document fragment for fast rendering
        const fragment = document.createDocumentFragment();
        students.forEach(s => {
          const label = document.createElement('label');
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.name = 'student';
          checkbox.value = s.id;
          label.appendChild(checkbox);
          label.appendChild(document.createTextNode(` ${s.name} (${s.id})`));
          fragment.appendChild(label);
        });
        studentsList.innerHTML = '';
        studentsList.appendChild(fragment);
      });
  }

  sectionSelect.addEventListener('change', loadStudents);
  loadStudents();

  form.addEventListener('submit', e => {
    e.preventDefault();
    const section = sectionSelect.value;
    const subject = subjectSelect.value;
    const date = dateInput.value;
    const checkboxes = studentsList.querySelectorAll('input[type="checkbox"]');
    const attendance = Array.from(checkboxes).map(cb => ({
      id: cb.value,
      present: cb.checked
    }));
    fetch('http://localhost:3001/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, subject, date, attendance })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          form.reset();
          dateInput.value = today;
          loadStudents();
          showToast('Attendance saved!', true);
        } else {
          showToast('Error: ' + (data.error || 'Unknown error'), false);
        }
      });
  });

  // Toast feedback
  function showToast(msg, success) {
    let toast = document.getElementById('toast-msg');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-msg';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = success ? 'toast success' : 'toast error';
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 2000);
  }
});
