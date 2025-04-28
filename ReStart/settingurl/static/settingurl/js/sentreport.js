// Автозаполнение даты
document.getElementById('report-date').textContent = new Date().toLocaleDateString();

// Автозаполнение таблицы расписания
const scheduleData = JSON.parse(localStorage.getItem('schedule')) || [
  { day: 'Понедельник', hours: 2 },
  { day: 'Вторник', hours: 0 },
  { day: 'Среда', hours: 0 },
  { day: 'Четверг', hours: 0 },
  { day: 'Пятница', hours: 0 },
  { day: 'Суббота', hours: 0 },
  { day: 'Воскресенье', hours: 0 }
];

const scheduleTable = document.getElementById('schedule-table').querySelector('tbody');
scheduleData.forEach(item => {
  const row = `<tr><td>${item.day}</td><td>${item.hours}</td></tr>`;
  scheduleTable.insertAdjacentHTML('beforeend', row);
});

// Место проведения занятий
document.getElementById('place').textContent = localStorage.getItem('place') || 'Спортзал';

// Таблица инвентаря
const inventoryData = JSON.parse(localStorage.getItem('inventory')) || [
  { item: 'Мячи', quantity: 15 },
  { item: 'Ковровая сетка', quantity: 1 }
];

const inventoryTable = document.getElementById('inventory-table').querySelector('tbody');
inventoryData.forEach(item => {
  const row = `<tr><td>${item.item}</td><td>${item.quantity}</td></tr>`;
  inventoryTable.insertAdjacentHTML('beforeend', row);
});

// Число обучающихся
document.getElementById('students-total').textContent = localStorage.getItem('studentsTotal') || '1300';

// Таблица по классам
const classesData = JSON.parse(localStorage.getItem('classes')) || [
  { class: '1', students: 11 },
  { class: '2', students: 12 },
  { class: '3', students: 10 }
];

const classesTable = document.getElementById('classes-table').querySelector('tbody');
classesData.forEach(item => {
  const row = `<tr><td>${item.class}</td><td>${item.students}</td></tr>`;
  classesTable.insertAdjacentHTML('beforeend', row);
});
