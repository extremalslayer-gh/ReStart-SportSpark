

document.addEventListener("DOMContentLoaded", function () {
    // Получаем все чекбоксы
    const checkboxes = document.querySelectorAll('.form-item input[type="checkbox"]');

    // Функция для обновления видимости полей
    function updateFields() {
        checkboxes.forEach(checkbox => {
            const formFields = checkbox.closest('.form-item').querySelector('.form-fields');
            if (checkbox.checked) {
                formFields.style.display = 'block'; // Показываем поля ввода
            } else {
                formFields.style.display = 'none'; // Скрываем поля ввода
            }
        });
    }

    // Инициализация видимости полей при загрузке страницы
    updateFields();

    // Добавляем обработчик события для каждого чекбокса
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateFields);
    });
});


    // Функция для отправки данных на сервер
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
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при отправке данных.');
        });
    }



    // Эта функция собирает данные о выбранных мероприятиях и сохраняет их в localStorage
    function saveData() {
        // Массив для хранения данных о мероприятиях
        const events = [];

        // Функция для добавления данных мероприятия в массив
        function addEvent(name, studentCount) {
            events.push({
                "name": name,
                "student_count_all": parseInt(studentCount), // Получаем количество участников
                "student_count_organization": 0, // строго 0
                "is_official": true, // только true
                "official_type": "Всероссийское", // Значение передается как аргумент
                "official_location": "Официальное мероприятие", // только "Официальное мероприятие"
                "official_organizer": "Официальное мероприятие", // только "Официальное мероприятие"
                "official_regulations": "LQ==", // только "LQ=="
            });
        }

        // Проверка всех мероприятий, которые отмечены галочкой
        const checkboxes = document.querySelectorAll('.form-item input[type="checkbox"]');
        checkboxes.forEach((checkbox, index) => {
            if (checkbox.checked) {
                // Для каждого отмеченного мероприятия, собираем данные
                let name = '';
                let studentCount = '';

                // В зависимости от мероприятия получаем данные
                switch (index) {
                    case 0:
                        name = 'Всероссийские соревнования по баскетболу среди команд общеобразовательных организаций';
                        studentCount = document.getElementById('number1').value;
                        break;
                    case 1:
                        name = 'Всероссийские соревнования по волейболу «Серебряный мяч»';
                        studentCount = document.getElementById('number2').value;
                        break;
                    case 2:
                        name = 'Всероссийские соревнования по легкоатлетическому четырехборью «Шиповка юных»';
                        studentCount = document.getElementById('number3').value;
                        break;
                    case 3:
                        name = 'Всероссийские соревнования по лыжным гонкам';
                        studentCount = document.getElementById('number4').value;
                        break;
                    case 4:
                        name = document.getElementById('name5').value || 'Другое';
                        studentCount = document.getElementById('number5').value;
                        break;
                }

                // Добавляем в массив, если есть название мероприятия
                if (name) {
                    addEvent(name, studentCount);
                }
            }
        });

        // Получаем текущие данные из localStorage
        let reportData = JSON.parse(localStorage.getItem('reportData')) || {};

        if (reportData.hasOwnProperty('events'))
        {
               reportData['events'] = reportData['events'].concat(events);
            }
            else {
                reportData['events'] = events;
            }

        // Сохраняем обновленные данные обратно в localStorage
        localStorage.setItem('reportData', JSON.stringify(reportData));

        sendDataToServer();

        localStorage.clear();
    }



// --- Сохраняем состояние формы (чекбоксы и инпуты) ---
function saveFormFields() {
    const formState = {
        checkboxes: [],
        inputs: {}
    };

    document.querySelectorAll('.form-item input[type="checkbox"]').forEach((checkbox, index) => {
        formState.checkboxes[index] = checkbox.checked;
    });

    // Сохраняем все поля с количеством участников
    formState.inputs.number1 = document.getElementById('number1')?.value || '';
    formState.inputs.number2 = document.getElementById('number2')?.value || '';
    formState.inputs.number3 = document.getElementById('number3')?.value || '';
    formState.inputs.number4 = document.getElementById('number4')?.value || '';
    formState.inputs.number5 = document.getElementById('number5')?.value || '';
    formState.inputs.name5 = document.getElementById('name5')?.value || '';

    localStorage.setItem('formFields_vs_events', JSON.stringify(formState));
}

// --- Восстанавливаем данные из localStorage ---
function loadFormFields() {
    const formState = JSON.parse(localStorage.getItem('formFields_vs_events'));
    if (!formState) return;

    document.querySelectorAll('.form-item input[type="checkbox"]').forEach((checkbox, index) => {
        checkbox.checked = formState.checkboxes[index];
    });

    if (document.getElementById('number1')) document.getElementById('number1').value = formState.inputs.number1;
    if (document.getElementById('number2')) document.getElementById('number2').value = formState.inputs.number2;
    if (document.getElementById('number3')) document.getElementById('number3').value = formState.inputs.number3;
    if (document.getElementById('number4')) document.getElementById('number4').value = formState.inputs.number4;
    if (document.getElementById('number5')) document.getElementById('number5').value = formState.inputs.number5;
    if (document.getElementById('name5'))   document.getElementById('name5').value   = formState.inputs.name5;

    // Обновляем отображение полей
    const event = new Event('change');
    document.querySelectorAll('.form-item input[type="checkbox"]').forEach(cb => cb.dispatchEvent(event));
}

// --- Удаляем сохранённые поля только после отправки ---
let isFormEdited = true;
window.addEventListener('beforeunload', function (e) {
    if (isFormEdited) {
        localStorage.removeItem('formFields_vs_events');
        e.preventDefault();
        e.returnValue = 'Вы действительно хотите уйти со страницы?';
        return 'Вы действительно хотите уйти со страницы?';
    }
});

// --- Инициализация событий и обработчиков ---
document.addEventListener('DOMContentLoaded', function () {
    loadFormFields();

    // Слушатели на чекбоксы
    document.querySelectorAll('.form-item input[type="checkbox"]').forEach((checkbox) => {
        checkbox.addEventListener('change', saveFormFields);
    });

    // Слушатели на поля
    ['number1', 'number2', 'number3', 'number4', 'number5', 'name5'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', saveFormFields);
    });

    // Подменяем функцию отправки, чтобы снять блокировку и очистить localStorage
    /*const originalSendData = sendDataToServer;
    sendDataToServer = function () {
        isFormEdited = false;
        window.removeEventListener('beforeunload');
        localStorage.removeItem('formFields_vs_events');
        originalSendData(); // вызов оригинальной функции
    };*/
});

