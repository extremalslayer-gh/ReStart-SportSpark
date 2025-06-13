document.addEventListener("DOMContentLoaded", function () {
    const checkboxes = document.querySelectorAll('.form-item input[type="checkbox"]');

    function updateFields() {
        checkboxes.forEach(checkbox => {
            const formFields = checkbox.closest('.form-item').querySelector('.form-fields');
            if (checkbox.checked) {
                formFields.style.display = 'block';
            } else {
                formFields.style.display = 'none';
            }
        });
    }

    updateFields();

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateFields);
    });

    // --- Загрузка сохраненных данных ---
    function loadFormFields() {
        const reportData = JSON.parse(localStorage.getItem('reportData'));
        if (!reportData || !Array.isArray(reportData.events)) return;

        // Отфильтровать официальные мероприятия с типом "Региональное"
        const officialEvents = reportData.events.filter(e => e.is_official === true && e.official_type === "Региональное");

        officialEvents.forEach(event => {
            // Сопоставляем название с индексом чекбокса
            let idx = -1;
            switch (event.name) {
                case 'Региональные соревнования по баскетболу среди команд общеобразовательных организаций':
                    idx = 0;
                    break;
                case 'Региональные соревнования по волейболу «Серебряный мяч»':
                    idx = 1;
                    break;
                case 'Региональные соревнования по легкоатлетическому четырехборью «Шиповка юных»':
                    idx = 2;
                    break;
                case 'Региональные соревнования по лыжным гонкам':
                    idx = 3;
                    break;
                default:
                    idx = 4; // "Другое"
            }

            if (idx !== -1) {
                const checkbox = checkboxes[idx];
                if (checkbox) {
                    checkbox.checked = true;
                    const formFields = checkbox.closest('.form-item').querySelector('.form-fields');
                    formFields.style.display = 'block';

                    // Заполнить количество участников
                    switch (idx) {
                        case 0:
                            document.getElementById('number1').value = event.student_count_all || '';
                            break;
                        case 1:
                            document.getElementById('number2').value = event.student_count_all || '';
                            break;
                        case 2:
                            document.getElementById('number3').value = event.student_count_all || '';
                            break;
                        case 3:
                            document.getElementById('number4').value = event.student_count_all || '';
                            break;
                        case 4:
                            document.getElementById('name5').value = event.name !== 'Другое' ? event.name : '';
                            document.getElementById('number5').value = event.student_count_all || '';
                            break;
                    }
                }
            }
        });
    }

    // --- Сохранение данных ---
    function saveData() {
        const events = [];

        function addEvent(name, studentCount) {
            events.push({
                "name": name,
                "student_count_all": parseInt(studentCount) || 0,
                "student_count_organization": 0,
                "is_official": true,
                "official_type": "Региональное",
                "official_location": "Официальное мероприятие",
                "official_organizer": "Официальное мероприятие",
                "official_regulations": "LQ=="
            });
        }

        checkboxes.forEach((checkbox, index) => {
            if (checkbox.checked) {
                let name = '';
                let studentCount = '';

                switch (index) {
                    case 0:
                        name = 'Региональные соревнования по баскетболу среди команд общеобразовательных организаций';
                        studentCount = document.getElementById('number1').value;
                        break;
                    case 1:
                        name = 'Региональные соревнования по волейболу «Серебряный мяч»';
                        studentCount = document.getElementById('number2').value;
                        break;
                    case 2:
                        name = 'Региональные соревнования по легкоатлетическому четырехборью «Шиповка юных»';
                        studentCount = document.getElementById('number3').value;
                        break;
                    case 3:
                        name = 'Региональные соревнования по лыжным гонкам';
                        studentCount = document.getElementById('number4').value;
                        break;
                    case 4:
                        name = document.getElementById('name5').value || 'Другое';
                        studentCount = document.getElementById('number5').value;
                        break;
                }

                if (name) {
                    addEvent(name, studentCount);
                }
            }
        });

        let reportData = JSON.parse(localStorage.getItem('reportData')) || {};

        // Удаляем из существующих событий региональные официальные, чтобы заменить
        if (Array.isArray(reportData.events)) {
            reportData.events = reportData.events.filter(e => !(e.is_official === true && e.official_type === "Региональное"));
        } else {
            reportData.events = [];
        }

        // Добавляем новые отмеченные
        reportData.events = reportData.events.concat(events);

        localStorage.setItem('reportData', JSON.stringify(reportData));
    }

    // Навесить обработчик на кнопку "Далее"
    const nextBtn = document.querySelector('.button-next');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            saveData();
        });
    }

    // Загрузить данные при старте
    loadFormFields();
});
