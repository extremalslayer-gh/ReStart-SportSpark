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
        const reportData = JSON.parse(localStorage.getItem('reportData')) || {};
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




