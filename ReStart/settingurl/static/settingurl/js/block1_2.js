    // Эта функция добавляет мероприятие в массив событий
    function saveData() {
        // Собираем данные из формы
        const eventName = document.getElementById('event-name').value;
        const studentCountAll = document.getElementById('student-count-all').value;
        const eventDate = document.getElementById('event-date').value;
        const studentCountOrganization = document.getElementById('student-count-organization').value;

        let dateSplit = eventDate.split('-');
        let dateFinal = `${dateSplit[2]}.${dateSplit[1]}.${dateSplit[0]}`;

        // Сохраняем мероприятие в формате объекта
        const event = {
            "name": eventName,
            "student_count_all": parseInt(studentCountAll),
            "student_count_organization": parseInt(studentCountOrganization),
            "is_official": false, // Пример, если мероприятие официальное
            "date": dateFinal

        };

        // Загружаем массив событий из localStorage
        const reportData = JSON.parse(localStorage.getItem('reportData')) || {};    // Эта функция добавляет мероприятие в массив событий
function saveData() {
    const events = [];

    // Сохраняем первое мероприятие (основной блок с фиксированными ID)
    const firstEvent = {
        name: document.getElementById('event-name').value,
        student_count_all: parseInt(document.getElementById('student-count-all').value),
        student_count_organization: parseInt(document.getElementById('student-count-organization').value),
        date: formatDate(document.getElementById('event-date').value),
        is_official: false
    };

    events.push(firstEvent);

    // Сохраняем все дополнительные мероприятия
    const container = document.getElementById('extra-events-container');
    const inputs = container.querySelectorAll('.step-content');

    // Группируем каждый блок из 4 инпутов в один объект
    for (let i = 0; i < inputs.length; i += 4) {
        const name = inputs[i].querySelector('input')?.value;
        const all = inputs[i + 1].querySelector('input')?.value;
        const date = inputs[i + 2].querySelector('input')?.value;
        const org = inputs[i + 3].querySelector('input')?.value;

        if (name && all && date && org) {
            events.push({
                name: name,
                student_count_all: parseInt(all),
                student_count_organization: parseInt(org),
                date: formatDate(date),
                is_official: false
            });
        }
    }

    const reportData = { events };
    localStorage.setItem('reportData', JSON.stringify(reportData));
}

function formatDate(dateStr) {
    if (!dateStr.includes("-")) return dateStr;
    let parts = dateStr.split('-');
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
}


// Функция для сохранения текущих данных полей в localStorage
function saveFormFields() {
    const eventName = document.getElementById('event-name').value;
    const studentCountAll = document.getElementById('student-count-all').value;
    const eventDate = document.getElementById('event-date').value;
    const studentCountOrganization = document.getElementById('student-count-organization').value;

    const formFields = {
        eventName,
        studentCountAll,
        eventDate,
        studentCountOrganization
    };

    localStorage.setItem('formFields', JSON.stringify(formFields));
}

// Функция для загрузки сохраненных данных полей из localStorage
function loadFormFields() {
    const formFields = JSON.parse(localStorage.getItem('formFields'));
    if (formFields) {
        document.getElementById('event-name').value = formFields.eventName || '';
        document.getElementById('student-count-all').value = formFields.studentCountAll || '';
        document.getElementById('event-date').value = formFields.eventDate || '';
        document.getElementById('student-count-organization').value = formFields.studentCountOrganization || '';
    }
}

// Навешиваем обработчики событий для сохранения при изменении полей
document.addEventListener('DOMContentLoaded', function() {
    loadFormFields();

    document.getElementById('event-name').addEventListener('input', saveFormFields);
    document.getElementById('student-count-all').addEventListener('input', saveFormFields);
    document.getElementById('event-date').addEventListener('input', saveFormFields);
    document.getElementById('student-count-organization').addEventListener('input', saveFormFields);
});



        reportData['events'] = []
        reportData['events'].push(event)

        // Сохраняем обновленный список событий обратно в localStorage
        localStorage.setItem('reportData', JSON.stringify(reportData));
    }

// Функция для сохранения текущих данных полей в localStorage
function saveFormFields() {
    const eventName = document.getElementById('event-name').value;
    const studentCountAll = document.getElementById('student-count-all').value;
    const eventDate = document.getElementById('event-date').value;
    const studentCountOrganization = document.getElementById('student-count-organization').value;

    const formFields = {
        eventName,
        studentCountAll,
        eventDate,
        studentCountOrganization
    };

    localStorage.setItem('formFields', JSON.stringify(formFields));
}

// Функция для загрузки сохраненных данных полей из localStorage
function loadFormFields() {
    const formFields = JSON.parse(localStorage.getItem('formFields'));
    if (formFields) {
        document.getElementById('event-name').value = formFields.eventName || '';
        document.getElementById('student-count-all').value = formFields.studentCountAll || '';
        document.getElementById('event-date').value = formFields.eventDate || '';
        document.getElementById('student-count-organization').value = formFields.studentCountOrganization || '';
    }
}

// Навешиваем обработчики событий для сохранения при изменении полей
document.addEventListener('DOMContentLoaded', function() {
    loadFormFields();

    document.getElementById('event-name').addEventListener('input', saveFormFields);
    document.getElementById('student-count-all').addEventListener('input', saveFormFields);
    document.getElementById('event-date').addEventListener('input', saveFormFields);
    document.getElementById('student-count-organization').addEventListener('input', saveFormFields);
});


// Показывать предупреждение при попытке покинуть страницу
let isFormEdited = true;

// Отмечаем, что форма изменена при любом изменении полей
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('event-name').addEventListener('input', () => isFormEdited = true);
    document.getElementById('student-count-all').addEventListener('input', () => isFormEdited = true);
    document.getElementById('event-date').addEventListener('input', () => isFormEdited = true);
    document.getElementById('student-count-organization').addEventListener('input', () => isFormEdited = true);
});

// Сбросить предупреждение, если нажали "Далее" (то есть данные сохранены)
function saveDataAndResetFlag() {
    saveData();
    isFormEdited = false;
    window.removeEventListener('beforeunload')
}

// При нажатии на кнопку "Далее" использовать новую функцию
document.addEventListener('DOMContentLoaded', function() {
    const nextButton = document.querySelector('.button-next');
    const backButton = document.querySelector('.button-back');
    if (nextButton) {
        nextButton.addEventListener('click', saveDataAndResetFlag);
    }
    if (backButton) {
        backButton.addEventListener('click', saveDataAndResetFlag);
    }
});

// Предупреждение при попытке ухода со страницы и очистка localStorage при уходе
window.addEventListener('beforeunload', function (e) {
    if (isFormEdited) {
        // Очищаем сохраненные поля перед уходом
        localStorage.removeItem('formFields');
        localStorage.removeItem('reportData');

        e.preventDefault();
        confirm("Вы хотите стереть данные?")
        e.returnValue = 'Вы действительно хотите уйти со страницы?';
        return 'Вы действительно хотите уйти со страницы?';
    }
});



// Никаких глобальных blockCount
let eventGroupIndex = 2;

document.querySelector('.button-add').addEventListener('click', () => {
    const container = document.getElementById('extra-events-container');
    const currentGroups = container.querySelectorAll('.event-group');
    const nextIndex = currentGroups.length + 2; // 2 — потому что 1-й блок под цифрами 1–4

    const groupWrapper = document.createElement('div');
    groupWrapper.classList.add('event-group');

    for (let i = 0; i < 4; i++) {
        const step = document.createElement('div');
        step.classList.add('step');

        step.innerHTML = `
            <div class="step-number">${nextIndex}.${i + 1}</div>
            <div class="step-content">
                <label class="step-description">${getLabel(i)}</label>
                <input type="${getInputType(i)}" class="form-input" placeholder="${getPlaceholder(i)}">
            </div>
        `;

        groupWrapper.appendChild(step);
    }

    // Кнопка удаления
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.classList.add('button-delete');
    deleteButton.textContent = 'Удалить мероприятие';
    deleteButton.style.margin = '10px 0';

    deleteButton.addEventListener('click', () => {
        groupWrapper.remove();
        // После удаления переобновить номера всех .event-group
        renumberEventGroups();
    });

    groupWrapper.appendChild(deleteButton);
    container.appendChild(groupWrapper);
});

function renumberEventGroups() {
    const groups = document.querySelectorAll('.event-group');
    groups.forEach((group, groupIndex) => {
        const steps = group.querySelectorAll('.step-number');
        steps.forEach((el, stepIndex) => {
            el.innerText = `${groupIndex + 2}.${stepIndex + 1}`;
        });
    });
}

function getLabel(i) {
    switch (i) {
        case 0: return "Название мероприятия";
        case 1: return "Количество участников мероприятия";
        case 2: return "Дата проведения";
        case 3: return "Количество участников Школьного спортивного клуба";
    }
}

function getInputType(i) {
    return (i === 2) ? "date" : ((i === 0) ? "text" : "number");
}

function getPlaceholder(i) {
    if (i === 0) return "Введите название мероприятия";
    if (i === 1 || i === 3) return "Введите число";
    return "";
}



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




document.addEventListener('DOMContentLoaded', function () {
    loadFormFields(); // Загружаем ранее сохраненные данные

    // Сохраняем данные при изменении полей
    document.getElementById('event-name').addEventListener('input', saveFormFields);

    // Получаем кнопку "Прикрепить положение" и скрытый input для выбора файла
    const attachPositionButton = document.getElementById('attach-position');
    const fileInputPosition = document.getElementById('fileInputPosition');

    // Обработчик для кнопки "Прикрепить положение"
    attachPositionButton.addEventListener('click', function () {
        fileInputPosition.click(); // Открываем проводник для выбора файла
    });

    // Обработчик для выбора файла
    fileInputPosition.addEventListener('change', async function () {
        const file = fileInputPosition.files[0];

        if (file) {
            alert(`Вы выбрали файл: ${file.name}`); // Показываем имя файла
            const fileBase64 = await readFileAsBase64(file); // Кодируем файл в base64

            // Сохраняем файл в localStorage
            const reportData = JSON.parse(localStorage.getItem('reportData')) || {};
            reportData.position = fileBase64;  // Сохраняем положение
            localStorage.setItem('reportData', JSON.stringify(reportData));
        }
    });

    const nextButton = document.querySelector('.button-next');
    const backButton = document.querySelector('.button-back');

    const saveAndReset = async () => {
        await saveData();
        isFormEdited = false;
        window.removeEventListener('beforeunload', beforeUnloadHandler);
    };

    if (nextButton) nextButton.addEventListener('click', saveAndReset);
    if (backButton) backButton.addEventListener('click', saveAndReset);
});

// Функция для кодирования файла в base64
function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1]; // Убираем data:...
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Функция для сохранения данных в localStorage
function saveFormFields() {
    const formFields = {
        eventName: document.getElementById('event-name')?.value || '',
        fileName: document.getElementById('fileInputPosition')?.files?.[0]?.name || ''
    };
    localStorage.setItem('formFields_position', JSON.stringify(formFields));
}

// Функция для загрузки данных из localStorage
function loadFormFields() {
    const formFields = JSON.parse(localStorage.getItem('formFields_position'));
    if (!formFields) return;

    document.getElementById('event-name').value = formFields.eventName || '';
    if (formFields.fileName) {
        const label = document.createElement('div');
        label.textContent = `Ранее выбран файл: ${formFields.fileName}`;
        label.style.fontSize = '14px';
        label.style.marginTop = '6px';
        label.style.color = 'gray';
        document.getElementById('fileInputPosition').insertAdjacentElement('afterend', label);
    }
}
