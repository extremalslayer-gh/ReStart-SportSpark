document.addEventListener('DOMContentLoaded', () => {
  loadFormFields();

  document.querySelectorAll('.form-item input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const fields = cb.closest('.form-item').querySelector('.form-fields');
      if (fields) fields.style.display = cb.checked ? 'block' : 'none';
      saveFormFields();
    });
  });

  document.querySelectorAll('.form-item input[type="text"]').forEach(inp => {
    inp.addEventListener('input', saveFormFields);
  });

    document.querySelector('.button-next')?.addEventListener('click', () => {
      saveData(); // <--- Добавляем вызов!
      document.getElementById('modal').style.display = 'block';
      renderPreviewModalFromLocalStorage();
    });

  loadVsEventsToForm();
});

function saveFormFields() {
  const formState = { checkboxes: [], inputs: {} };
  document.querySelectorAll('.form-item input[type="checkbox"]').forEach((cb, i) => formState.checkboxes[i] = cb.checked);
  document.querySelectorAll('.form-item input[type="text"]').forEach(input => formState.inputs[input.id] = input.value);
  localStorage.setItem('formFields_vs_events', JSON.stringify(formState));
}

function loadFormFields() {
  const formState = JSON.parse(localStorage.getItem('formFields_vs_events'));
  if (!formState) return;
  document.querySelectorAll('.form-item input[type="checkbox"]').forEach((cb, i) => cb.checked = formState.checkboxes[i]);
  for (let id in formState.inputs) {
    const input = document.getElementById(id);
    if (input) input.value = formState.inputs[id];
  }
  document.querySelectorAll('.form-item input[type="checkbox"]').forEach(cb => {
    const fields = cb.closest('.form-item').querySelector('.form-fields');
    if (fields) fields.style.display = cb.checked ? 'block' : 'none';
  });
}

function renderPreviewModalFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem('reportData'));
  if (!data) return;

  // Расписание занятий ШСК
  const scheduleTable = document.querySelector('.schedule-table tbody');
  scheduleTable.innerHTML = '';
  const scheduleRow = document.createElement('tr');
  [
    data.organization?.hours_mon,
    data.organization?.hours_tue,
    data.organization?.hours_wed,
    data.organization?.hours_thu,
    data.organization?.hours_fri,
    data.organization?.hours_sat,
    data.organization?.hours_sun
  ].forEach(hour => {
    const td = document.createElement('td');
    td.textContent = hour || '-';
    scheduleRow.appendChild(td);
  });
  scheduleTable.appendChild(scheduleRow);

  // Численность обучающихся
  document.querySelector('.students-organization').textContent = data.organization?.students_organization || '-';
  document.querySelector('.students-total').textContent = data.organization?.students_total || '-';

  const classTable = document.querySelector('.students-table tbody');
  classTable.innerHTML = '';
  for (let i = 1; i <= 11; i++) {
    const count = data.organization[`students_grade_${i}`] || '-';
    classTable.insertAdjacentHTML('beforeend', `<tr><td>${i}</td><td>${count}</td></tr>`);
  }

  const sportTable = document.querySelector('.activity-table tbody');
  sportTable.innerHTML = '';
  (data.sports || []).forEach(sp => {
    sportTable.insertAdjacentHTML('beforeend', `<tr><td>${sp.name}</td><td>${sp.student_count}</td></tr>`);
  });

  // Всероссийские мероприятия
  const all = document.querySelector('.event-table-all tbody');
  all.innerHTML = '';
  (data.events || []).forEach(ev => {
    if (ev.official_type === 'Всероссийское') {
      const date = ev.date ? ev.date.split('T')[0].split('-').reverse().join('.') : '-';
      all.insertAdjacentHTML('beforeend', `<tr><td>${ev.name}</td><td>${ev.student_count_all}</td></tr>`);
    }
  });

  // Региональные мероприятия
  const reg = document.querySelector('.event-table-reg tbody');
  reg.innerHTML = '';
  (data.events || []).forEach(ev => {
    if (ev.official_type === 'Региональное') {
      const date = ev.date ? ev.date.split('T')[0].split('-').reverse().join('.') : '-';
      reg.insertAdjacentHTML('beforeend', `<tr><td>${ev.name}</td><td>${ev.student_count_all}</td></tr>`);
    }
  });

  // Муниципальные мероприятия
  const mun = document.querySelector('.full-event-table tbody');
  mun.innerHTML = '';
  let count = 1;
  (data.events || []).forEach(ev => {
    if (ev.official_type === 'Муниципальное') {
      const date = ev.date ? ev.date.split('T')[0].split('-').reverse().join('.') : '-';
      mun.insertAdjacentHTML('beforeend', `
        <tr>
          <td>${count++}</td>
          <td>${ev.name}</td>
          <td>${ev.student_count_all}</td>
          <td>${date}</td>
          <td>${ev.official_location || '-'}</td>
          <td>${ev.official_organizer || '-'}</td>
        </tr>`);
    }
  });

    // === Новый блок: Таблица достижений (Блок 2) ===
    const achievementTable = document.querySelector('.achievement-table tbody');
     const row = `
        <tr>
          <td>Достижение</td>
          <td><a href="${data.organization.achievements}" target="_blank">Скачать</a></td>
        </tr>
      `;
      achievementTable.insertAdjacentHTML('beforeend', row);

  // Базовые мероприятия
  const base = document.querySelector('.event-table tbody');
  base.innerHTML = '';
  (data.events || []).forEach(ev => {
    if (!ev.is_official) {
      const date = ev.date ? ev.date.split('T')[0].split('-').reverse().join('.') : '-';
      base.insertAdjacentHTML('beforeend', `
        <tr>
          <td>${ev.name}</td>
          <td>${ev.student_count_organization || '-'}</td>
          <td>${date}</td>
          <td>${ev.student_count_all || '-'}</td>
        </tr>`);
    }
  });
}

function closePreview() {
  document.getElementById('modal').style.display = 'none';
}


async function loadVsEventsToForm() {
  try {
    const response = await fetch('/admin/get_custom_events/', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    const vsEvents = data.events.filter(ev => ev.event_type === 'Всероссийское');
    const container = document.getElementById('vs-events-container');
    container.innerHTML = '';

    vsEvents.forEach((event, index) => {
      const id = `number-${index + 1}`;
      const checkboxId = `event-checkbox-${index + 1}`;
      const html = `
        <div class="form-item">
          <label><input type="checkbox" id="${checkboxId}"> ${index + 1}. ${event.name}</label>
          <div class="form-fields">
            <label>Количество участников <input type="text" id="${id}" placeholder="Введите количество"></label>
          </div>
        </div>`;
      container.insertAdjacentHTML('beforeend', html);
    });

    loadFormFields();
    addCheckboxHandlers(); // 👈 Обязательный вызов
  } catch (err) {
    console.error('Ошибка загрузки мероприятий:', err);
  }
}

///////////////////////////////////////////////////////////////////////////////////

function saveData() {
  const events = [];
  const formItems = document.querySelectorAll('.form-item');

  formItems.forEach((item, index) => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    const input = item.querySelector('input[type="text"]');
    const label = item.querySelector('label');

    if (checkbox && checkbox.checked && input) {
      const name = label.textContent.trim().replace(/^\d+\.\s*/, '');
      const studentCount = input.value;

      events.push({
        name: name,
        student_count_all: parseInt(studentCount) || 0,
        student_count_organization: 0,
        is_official: true,
        official_type: "Всероссийское",
        official_location: "Официальное мероприятие",
        official_organizer: "Официальное мероприятие",
        official_regulations: "LQ==",
      });
    }
  });

  let reportData = JSON.parse(localStorage.getItem('reportData')) || {};
  reportData.events = (reportData.events || []).concat(events);
  localStorage.setItem('reportData', JSON.stringify(reportData));
}





    // Функция для отправки данных на серверMore actions
    function sendDataToServer() {
        // Получаем объект reportData из localStorage
        const reportData = JSON.parse(localStorage.getItem('reportData'));

        // Проверка наличия данных
        if (!reportData || !reportData.events) {
            alert('Нет данных для отправки');
            return;
        }

        // Создание JSON объекта для отправки
        const data = {
            // 'id': localStorage.getItem('report_id'), для редактирования
            events: reportData.events || [],
            organization: reportData.organization,
            sports: reportData.sports || []// Передаем только массив событий
            // Можно добавить дополнительные данные, если необходимо
        };

        console.log(data);
        // Отправка POST-запроса
        fetch('/reports/create_report/', { // для редактирования вместо /reports/create_report/ будет /reports/edit_report/
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Указываем, что отправляем JSON
            },
            body: JSON.stringify(data), // Преобразуем объект в JSON
        })
        .then(response => {
            if (response.ok) {
                return response.json(); // Парсим ответ от сервера как JSON
            }
            throw new Error('Ошибка при отправке данных');
        })
        .then(result => {
            // Обработка ответа от сервера
            console.log('Данные успешно отправлены:', result);
            alert('Данные успешно отправлены на сервер!');
            window.location.href = '/recentrep';

            localStorage.clear()
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при отправке данных.');
        });
    }



function addCheckboxHandlers() {
  document.querySelectorAll('.form-item input[type="checkbox"]').forEach(cb => {
    const fields = cb.closest('.form-item').querySelector('.form-fields');
    if (fields) {
      fields.style.display = cb.checked ? 'block' : 'none'; // начальная установка
    }

    cb.addEventListener('change', () => {
      if (fields) fields.style.display = cb.checked ? 'block' : 'none';
      saveFormFields();
    });
  });
}
