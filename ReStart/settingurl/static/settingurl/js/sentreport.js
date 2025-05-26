// Получаем данные с сервера
fetch('/reports/get_report/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({'id': localStorage.getItem('report_id')})
})
  .then(response => response.json())
  .then(data => {
// Автозаполнение таблицы расписания
const scheduleData = [
  { day: 'Понедельник', hours: data.organization.hours_mon },
  { day: 'Вторник', hours: data.organization.hours_tue },
  { day: 'Среда', hours: data.organization.hours_wed },
  { day: 'Четверг', hours: data.organization.hours_thu },
  { day: 'Пятница', hours: data.organization.hours_fri },
  { day: 'Суббота', hours: data.organization.hours_sat },
  { day: 'Воскресенье', hours: data.organization.hours_sun }
];

const scheduleTable = document.querySelector('.schedule-table');

// Создаем строки отдельно
const headerRow = document.createElement('tr'); // строка для дней недели
const hoursRow = document.createElement('tr');  // строка для количества часов

scheduleData.forEach(item => {
  const dayHeader = document.createElement('th');
  dayHeader.textContent = item.day;
  headerRow.appendChild(dayHeader);

  const hourCell = document.createElement('td');
  hourCell.textContent = item.hours;
  hoursRow.appendChild(hourCell);
});

// Очищаем старое содержимое (если было)
scheduleTable.innerHTML = '';
// Добавляем сначала дни недели, потом часы
scheduleTable.appendChild(headerRow);
scheduleTable.appendChild(hoursRow);


    // Число обучающихся
    document.querySelector('.students-organization').textContent = data.organization.students_organization || '';
    document.querySelector('.students-total').textContent = data.organization.students_total || '';

    // Таблица по классам
    const classesData = [
      { class: '1', students: data.organization.students_grade_1 },
      { class: '2', students: data.organization.students_grade_2 },
      { class: '3', students: data.organization.students_grade_3 },
      { class: '4', students: data.organization.students_grade_4 },
      { class: '5', students: data.organization.students_grade_5 },
      { class: '6', students: data.organization.students_grade_6 },
      { class: '7', students: data.organization.students_grade_7 },
      { class: '8', students: data.organization.students_grade_8 },
      { class: '9', students: data.organization.students_grade_9 },
      { class: '10', students: data.organization.students_grade_10 },
      { class: '11', students: data.organization.students_grade_11 }
    ];

    const classesTable = document.querySelector('.students-tables').querySelector('tbody');
    classesData.forEach(item => {
      const row = `<tr><td>${item.class}</td><td>${item.students}</td></tr>`;
      classesTable.insertAdjacentHTML('beforeend', row);
    });

    // Таблица видов спорта
    const sportsTable = document.querySelector('.activity-table').querySelector('tbody');
    console.log(data)
    data.sports.forEach(item => {
      const row = `<tr><td>${item.name}</td><td>${item.student_count}</td></tr>`;
      sportsTable.insertAdjacentHTML('beforeend', row);
    });


  // === Новое: Физкультурные мероприятия ШСК ===
  const eventTable = document.querySelector('.event-table').querySelector('tbody');
  const allRussianTable = document.querySelector('.event-table-all').querySelector('tbody');
  const regionalTable = document.querySelector('.event-table-reg').querySelector('tbody');
  const municipalTable = document.querySelector('.full-event-table').querySelector('tbody');

  let municipalCounter = 1;
  // Проходим все мероприятия
  data.events.forEach((item, index) => {
    if (!item.is_official) {
      // Обычные мероприятия ШСК
      const row = `
        <tr>
          <td>${item.name}</td>
          <td>${item.student_count_organization || '-'}</td>
          <td>${item.date || '-'}</td>
          <td>${item.student_count_all || '-'}</td>
        </tr>
      `;
      eventTable.insertAdjacentHTML('beforeend', row);
    } else {
      // Официальные мероприятия
      if (item.official_type === 'Всероссийское') {
        const row = `
          <tr>
            <td>${item.name}</td>
            <td>${item.student_count_all || '-'}</td>
            <td>${item.date || '-'}</td>
          </tr>
        `;
        allRussianTable.insertAdjacentHTML('beforeend', row);
      } else if (item.official_type === 'Региональное') {
        const row = `
          <tr>
            <td>${item.name}</td>
            <td>${item.student_count_all || '-'}</td>
            <td>${item.date || '-'}</td>
          </tr>
        `;
        regionalTable.insertAdjacentHTML('beforeend', row);
      } else if (item.official_type === 'Муниципальное') {
        const row = `
          <tr>
            <td>${municipalCounter++}</td>
            <td>${item.name}</td>
            <td>${item.student_count_all || '-'}</td>
            <td>${item.date || '-'}</td>
            <td>${item.official_location || '-'}</td>
            <td>${item.official_organizer || '-'}</td>
            <td>${item.official_regulations || '-'}</td>
          </tr>
        `;
        municipalTable.insertAdjacentHTML('beforeend', row);
      }
    }
  });
    // === Новый блок: Таблица достижений (Блок 2) ===
    const achievementTable = document.querySelector('.achievement-table tbody');
     const row = `
        <tr>
          <td>'Достижение'</td>
          <td><a href="${data.organization.achievements}" target="_blank">Скачать</a></td>
        </tr>
      `;
      achievementTable.insertAdjacentHTML('beforeend', row);

})
.catch(error => console.error('Ошибка:', error));


