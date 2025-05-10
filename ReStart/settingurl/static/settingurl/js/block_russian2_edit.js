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
            'id': localStorage.getItem('report_id'), //для редактирования
            events: reportData.events || [],
            organization: reportData.organization,
            sports: reportData.sports || []// Передаем только массив событий
            // Можно добавить дополнительные данные, если необходимо
        };

        console.log(data);
        // Отправка POST-запроса
        fetch('/reports/edit_report/', { // для редактирования вместо /reports/create_report/ будет /reports/edit_report/
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





