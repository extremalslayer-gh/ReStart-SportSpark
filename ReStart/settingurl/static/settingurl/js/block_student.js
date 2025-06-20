document.addEventListener("DOMContentLoaded", () => {
    let isFormEdited = true;

    const checkboxes = document.querySelectorAll('.sports > div input[type="checkbox"]');
    const inputsIds = ['total-students', 'club-students'];
    for (let i = 1; i <= 11; i++) inputsIds.push(`class-${i}`);

    function updateSportInputs() {
        checkboxes.forEach(cb => {
            const input = cb.parentElement.querySelector('input[type="text"]');
            if (input) input.style.display = cb.checked ? 'inline-block' : 'none';
        });
    }

    function saveFormFields() {
        const formFields = {
            totalStudents: document.getElementById('total-students')?.value || '',
            clubStudents: document.getElementById('club-students')?.value || '',
            grades: {},
            sports: {}
        };

        for (let i = 1; i <= 11; i++) {
            formFields.grades[`class-${i}`] = document.getElementById(`class-${i}`)?.value || '';
        }

        const sportItems = document.querySelectorAll('.sports > div');
        sportItems.forEach(item => {
            const checkbox = item.querySelector("input[type='checkbox']");
            const input = item.querySelector("input[type='text']");
            const name = checkbox.nextSibling.textContent.trim(); // Название вида спорта

            formFields.sports[name] = {
                checked: checkbox.checked,
                value: input.value || ''
            };
        });

        localStorage.setItem('formFields_sports', JSON.stringify(formFields));
        console.log('Saved formFields_sports:', formFields);
    }

    function loadFormFields() {
        const formFields = JSON.parse(localStorage.getItem('formFields_sports'));
        if (!formFields) return;

        document.getElementById('total-students').value = formFields.totalStudents || '';
        document.getElementById('club-students').value = formFields.clubStudents || '';

        for (let i = 1; i <= 11; i++) {
            document.getElementById(`class-${i}`).value = formFields.grades[`class-${i}`] || '';
        }

        const sportItems = document.querySelectorAll('.sports > div');
        sportItems.forEach(item => {
            const checkbox = item.querySelector("input[type='checkbox']");
            const input = item.querySelector("input[type='text']");
            const name = checkbox.nextSibling.textContent.trim();

            const saved = formFields.sports[name];
            if (saved) {
                checkbox.checked = saved.checked;
                input.value = saved.value;
                input.style.display = checkbox.checked ? 'inline-block' : 'none';
            }
        });
    }


    function saveData() {
        const totalStudents = document.getElementById('total-students').value;
        const clubStudents = document.getElementById('club-students').value;

        const studentsByGrade = {};
        for (let i = 1; i <= 11; i++) {
            studentsByGrade[`students_grade_${i}`] = parseInt(document.getElementById(`class-${i}`).value) || 0;
        }

        const sportsElements = document.querySelectorAll('.sports > div');
        const sports = [];
        sportsElements.forEach((sport) => {
            const checkbox = sport.querySelector('input[type="checkbox"]');
            const studentCountInput = sport.querySelector('input[type="text"]');
            if (checkbox.checked) {
                sports.push({
                    name: checkbox.nextSibling.textContent.trim(),
                    student_count: parseInt(studentCountInput.value) || 0,
                });
            }
        });

        const data = JSON.parse(localStorage.getItem('reportData')) || {};
        data.organization = {
            ...data.organization,
            students_total: parseInt(totalStudents) || 0,
            students_organization: parseInt(clubStudents) || 0,
            ...studentsByGrade,
        };
        data.sports = sports;

        localStorage.setItem('reportData', JSON.stringify(data));
        console.log('Saved reportData:', data);
    }

    // Инициализация формы
    loadFormFields();

    // Добавляем слушатели
    document.getElementById('total-students').addEventListener('input', () => {
        saveFormFields();
        isFormEdited = true;
    });
    document.getElementById('club-students').addEventListener('input', () => {
        saveFormFields();
        isFormEdited = true;
    });

    for (let i = 1; i <= 11; i++) {
        document.getElementById(`class-${i}`).addEventListener('input', () => {
            saveFormFields();
            isFormEdited = true;
        });
    }

    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            updateSportInputs();
            saveFormFields();
            isFormEdited = true;
        });
    });

    // Предупреждение при уходе
    window.addEventListener('beforeunload', (e) => {
        if (isFormEdited) {
            e.preventDefault();
            e.returnValue = 'Вы действительно хотите уйти со страницы?';
            return 'Вы действительно хотите уйти со страницы?';
        }
    });

    // Кнопка Далее
    const nextButton = document.querySelector('.button-next');
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            saveFormFields();
            saveData();
            isFormEdited = false; // чтобы не показывать предупреждение при переходе
            // Позволяем ссылке перейти на другую страницу (если она есть)
        });
    }

    // Кнопка Назад
    const backButton = document.querySelector('.button-back');
    if (backButton) {
        backButton.addEventListener('click', () => {
            saveFormFields();
            isFormEdited = false; // чтобы не показывать предупреждение при переходе
        });
    }
});

function loadDataForBlockStudentEdit() {
  var reportData = JSON.parse(localStorage.getItem('reportData'));
  if (!reportData || !reportData.organization) return;
  localStorage.setItem('oldEvents', JSON.stringify(reportData.events));
    reportData.events = [];
    localStorage.setItem('reportData', JSON.stringify(reportData));

  // Заполняем общие поля
  document.getElementById('total-students').value = reportData.organization.students_total || '';
  document.getElementById('club-students').value = reportData.organization.students_organization || '';

  // Заполняем классы
  for (let i = 1; i <= 11; i++) {
    const gradeKey = `students_grade_${i}`;
    const input = document.getElementById(`class-${i}`);
    if (input) {
      input.value = reportData.organization[gradeKey] || '';
    }
  }

  // Заполняем виды спорта
  const sportsElements = document.querySelectorAll('.sports > div');
  if (reportData.sports && reportData.sports.length) {
    sportsElements.forEach((sportEl, index) => {
      const checkbox = sportEl.querySelector('input[type="checkbox"]');
      const input = sportEl.querySelector('input[type="text"]');
      const sportData = reportData.sports[index];
      if (checkbox && input && sportData) {
        checkbox.checked = !!sportData.checked;
        input.value = sportData.student_count || '';
        input.style.display = checkbox.checked ? 'inline-block' : 'none';
      }
    });
  }
}


// Вызываем функцию при загрузке страницы
document.addEventListener('DOMContentLoaded', loadDataForBlockStudentEdit);

 let studentCount = document.querySelector('#total-students')