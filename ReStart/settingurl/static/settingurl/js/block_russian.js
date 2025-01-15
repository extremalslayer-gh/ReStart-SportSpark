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


    // Эта функция собирает данные о выбранных мероприятиях и сохраняет их в localStorage
    function saveData() {
        // Массив для хранения данных о мероприятиях
        const events = [];

        // Функция для добавления данных мероприятия в массив
        function addEvent(name, studentCount, eventDate) {
            events.push({
                "name": name,
                "student_count_all": parseInt(studentCount), // Получаем количество участников
                "student_count_organization": 0, // строго 0
                "is_official": true, // только true
                "official_type": "Региональное", // Значение передается как аргумент
                "official_location": "Официальное мероприятие", // только "Официальное мероприятие"
                "official_organizer": "Официальное мероприятие", // только "Официальное мероприятие"
                "official_regulations": "LQ==", // только "LQ=="
                "date": eventDate // Дата с поля
            });
        }

        // Проверка всех мероприятий, которые отмечены галочкой
        const checkboxes = document.querySelectorAll('.form-item input[type="checkbox"]');
        checkboxes.forEach((checkbox, index) => {
            if (checkbox.checked) {
                // Для каждого отмеченного мероприятия, собираем данные
                let name = '';
                let studentCount = '';
                let eventDate = '';

                // В зависимости от мероприятия получаем данные
                switch (index) {
                    case 0:
                        name = 'Региональные соревнования по баскетболу среди команд общеобразовательных организаций';
                        studentCount = document.getElementById('number1').value;
                        eventDate = document.getElementById('date1').value;
                        break;
                    case 1:
                        name = 'Региональные соревнования по волейболу «Серебряный мяч»';
                        studentCount = document.getElementById('number2').value;
                        eventDate = document.getElementById('date2').value;
                        break;
                    case 2:
                        name = 'Региональные соревнования по легкоатлетическому четырехборью «Шиповка юных»';
                        studentCount = document.getElementById('number3').value;
                        eventDate = document.getElementById('date3').value;
                        break;
                    case 3:
                        name = 'Региональные соревнования по лыжным гонкам';
                        studentCount = document.getElementById('number4').value;
                        eventDate = document.getElementById('date4').value;
                        break;
                    case 4:
                        name = document.getElementById('name5').value || 'Другое';
                        studentCount = document.getElementById('number5').value;
                        eventDate = document.getElementById('date5').value;
                        break;
                }

                // Добавляем в массив, если есть название мероприятия
                if (name) {
                    addEvent(name, studentCount, eventDate);
                }
            }
        });

        // Получаем текущие данные из localStorage
        let reportData = JSON.parse(localStorage.getItem('reportData')) || {};
        reportData['events'] = events;

        // Сохраняем обновленные данные обратно в localStorage
        localStorage.setItem('reportData', JSON.stringify(reportData));
    }




