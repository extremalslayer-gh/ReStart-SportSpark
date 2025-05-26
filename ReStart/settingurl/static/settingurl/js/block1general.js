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
            const day = checkbox.dataset.day; // Получаем ключ дня недели (например, "monday")
            const dayKey = dayMapping[day]; // Преобразуем в нужный формат ("mon", "tue", и т.д.)
            const hoursContainer = document.getElementById(`hours-${day}`);
            const hoursInput = hoursContainer.querySelector('.hours-input');

            // Сохраняем количество часов для выбранного дня
            if (checkbox.checked) {
                hoursData[`hours_${dayKey}`] = parseInt(hoursInput.value) || 0;
            } else {
                hoursData[`hours_${dayKey}`] = 0; // Если не отмечен, значение по умолчанию — 0
            }
        });

        // Обновляем данные в localStorage
        data.organization = {
            ...data.organization,
            ...hoursData,
        };

        localStorage.setItem('reportData', JSON.stringify(data));
    }

    // Добавляем обработчики событий на кнопку "Далее"
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
