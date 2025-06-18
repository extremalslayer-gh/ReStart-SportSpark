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
    const saved = JSON.parse(localStorage.getItem('reportData'));
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

window.onbeforeunload = null;

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


function loadDataFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem('reportData'));
    if (!data || !data.organization) return;

    const org = data.organization;

    // Пример заполнения часов по дням недели
    // Предполагаем, что input-ы для часов имеют id вида hours-monday, hours-tuesday и т.п.
    const dayMap = {
        mon: 'monday',
        tue: 'tuesday',
        wed: 'wednesday',
        thu: 'thursday',
        fri: 'friday',
        sat: 'saturday',
        sun: 'sunday'
    };

    for (const [key, day] of Object.entries(dayMap)) {
        const input = document.querySelector(`#hours-${day} .hours-input`);
        if (input && org[`hours_${key}`] !== undefined) {
            input.value = org[`hours_${key}`];
            // Также можно установить чекбокс как checked, если часы > 0
            const checkbox = document.querySelector(`.day-checkbox[data-day="${day}"]`);
            if (checkbox) {
                checkbox.checked = org[`hours_${key}`] > 0;
                const container = document.getElementById(`hours-${day}`);
                if (container) {
                    if (checkbox.checked) container.classList.remove('hidden');
                    else container.classList.add('hidden');
                }
            }
        }
    }
}

// Вызови эту функцию после загрузки DOM:
document.addEventListener('DOMContentLoaded', loadDataFromLocalStorage);



