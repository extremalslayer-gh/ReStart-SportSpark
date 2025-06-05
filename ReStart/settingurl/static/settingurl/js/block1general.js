document.querySelectorAll('.day-checkbox').forEach((checkbox) => {
  checkbox.addEventListener('change', (event) => {
    const day = event.target.dataset.day;
    const hoursContainer = document.getElementById(`hours-${day}`);
    if (event.target.checked) {
      hoursContainer.classList.remove('hidden');
    } else {
      hoursContainer.classList.add('hidden');
    }
  });
});

// Функция для сохранения данных в localStorage
function saveData() {
    const data = JSON.parse(localStorage.getItem('reportData')) || {};

    // Сохраняем расписание по дням
    const dayCheckboxes = document.querySelectorAll('.day-checkbox');
    const dayMapping = {
        monday: 'mon',
        tuesday: 'tue',
        wednesday: 'wed',
        thursday: 'thu',
        friday: 'fri',
        saturday: 'sat',
        sunday: 'sun',
    };

    const hoursData = {};

    dayCheckboxes.forEach((checkbox) => {
        const day = checkbox.dataset.day;
        const dayKey = dayMapping[day];
        const hoursContainer = document.getElementById(`hours-${day}`);
        const hoursInput = hoursContainer.querySelector('.hours-input');

        if (checkbox.checked) {
            hoursData[`hours_${dayKey}`] = parseInt(hoursInput.value) || 0;
        } else {
            hoursData[`hours_${dayKey}`] = 0;
        }
    });

    data.organization = {
        ...data.organization,
        ...hoursData,
    };

    localStorage.setItem('reportData', JSON.stringify(data));
}

document.querySelector('.button-next').addEventListener('click', saveData);

// --- Сохраняем текущие данные формы расписания ---
function saveFormFields() {
    const formFields = {};
    document.querySelectorAll('.day-checkbox').forEach((checkbox) => {
        const day = checkbox.dataset.day;
        const hoursInput = document.querySelector(`#hours-${day} .hours-input`);
        formFields[day] = {
            checked: checkbox.checked,
            hours: hoursInput ? hoursInput.value : ''
        };
    });
    localStorage.setItem('formFields_schedule', JSON.stringify(formFields));
}

// --- Загружаем данные формы расписания ---
function loadFormFields() {
    const saved = JSON.parse(localStorage.getItem('formFields_schedule'));
    if (!saved) return;

    Object.entries(saved).forEach(([day, { checked, hours }]) => {
        const checkbox = document.querySelector(`.day-checkbox[data-day="${day}"]`);
        const hoursContainer = document.getElementById(`hours-${day}`);
        const hoursInput = hoursContainer?.querySelector('.hours-input');

        if (checkbox) checkbox.checked = checked;
        if (hoursContainer) {
            if (checked) hoursContainer.classList.remove('hidden');
            else hoursContainer.classList.add('hidden');
        }
        if (hoursInput) hoursInput.value = hours;
    });
}

// --- Флаг редактирования и предупреждение при уходе ---
let isFormEdited = true;

window.addEventListener('beforeunload', function (e) {
    if (isFormEdited) {
        localStorage.removeItem('formFields_schedule');
        e.preventDefault();
        e.returnValue = 'Вы действительно хотите уйти со страницы?';
        return 'Вы действительно хотите уйти со страницы?';
    }
});

// --- Навешиваем обработчики сохранения при вводе ---
document.addEventListener('DOMContentLoaded', function () {
    loadFormFields();

    document.querySelectorAll('.day-checkbox').forEach((checkbox) => {
        checkbox.addEventListener('change', saveFormFields);
    });

    document.querySelectorAll('.hours-input').forEach((input) => {
        input.addEventListener('input', saveFormFields);
    });

    const nextButton = document.querySelector('.button-next');
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            saveData();
            isFormEdited = false;
            window.removeEventListener('beforeunload');
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const profileIcon = document.getElementById('profile-icon');
    const profileMenu = document.getElementById('profile-menu');

    profileIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        profileMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
        if (!profileMenu.classList.contains('hidden')) {
            profileMenu.classList.add('hidden');
        }
    });
});


document.addEventListener("DOMContentLoaded", () => {
  const dayCheckboxes = document.querySelectorAll('.day-checkbox');

  // Функция для отображения или скрытия поля с часами по состоянию чекбокса
  function toggleHoursInput(checkbox) {
    const day = checkbox.dataset.day;
    const hoursContainer = document.getElementById(`hours-${day}`);
    if (checkbox.checked) {
      hoursContainer.classList.remove('hidden');
    } else {
      hoursContainer.classList.add('hidden');
      // Можно сбросить значение часов при скрытии, если нужно:
      // const input = hoursContainer.querySelector('.hours-input');
      // if (input) input.value = 0;
    }
  }

  // Загрузка данных из localStorage и заполнение формы
  function loadData() {
    const reportData = JSON.parse(localStorage.getItem('reportData'));
    if (!reportData || !reportData.generalData) return;

    const generalData = reportData.generalData;

    dayCheckboxes.forEach(checkbox => {
      const day = checkbox.dataset.day;
      // Данные по чекбоксу и часам из generalData
      const checked = !!generalData[`${day}_checked`];
      const hours = generalData[`${day}_hours`] || 0;

      checkbox.checked = checked;

      const hoursContainer = document.getElementById(`hours-${day}`);
      const input = hoursContainer.querySelector('.hours-input');
      if (input) {
        input.value = hours;
      }

      // Отобразить или скрыть поле
      toggleHoursInput(checkbox);
    });
  }

  // Сохранение данных из формы в localStorage
  function saveData() {
    let reportData = JSON.parse(localStorage.getItem('reportData')) || {};
    reportData.generalData = reportData.generalData || {};

    dayCheckboxes.forEach(checkbox => {
      const day = checkbox.dataset.day;
      const hoursContainer = document.getElementById(`hours-${day}`);
      const input = hoursContainer.querySelector('.hours-input');

      reportData.generalData[`${day}_checked`] = checkbox.checked;
      reportData.generalData[`${day}_hours`] = input ? parseInt(input.value) || 0 : 0;
    });

    localStorage.setItem('reportData', JSON.stringify(reportData));
    alert('Данные сохранены!');
  }

  // Инициализация — навешиваем обработчики
  dayCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      toggleHoursInput(checkbox);
    });
  });

  // Загружаем данные при загрузке страницы
  loadData();

  // Кнопка "Далее" вызывается из HTML через onclick="saveData()"
  window.saveData = saveData; // чтобы функция была глобально доступна из HTML
});
