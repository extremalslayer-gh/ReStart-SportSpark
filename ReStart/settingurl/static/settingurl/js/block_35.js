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



// Добавление нового блока с полями для мероприятия
document.addEventListener('DOMContentLoaded', () => {
    // Добавляем обработчик для кнопки "Добавить мероприятие"
    document.querySelector('.button-add').addEventListener('click', () => {
        const container = document.getElementById('extra-events-container');
        const currentGroups = container.querySelectorAll('.event-group');
        const nextIndex = currentGroups.length + 2; // Начинаем с 2, чтобы избежать пересечения с уже существующими мероприятиями

        const groupWrapper = document.createElement('div');
        groupWrapper.classList.add('event-group');

        // Генерируем новые шаги для формы
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

        // Добавляем кнопку для удаления блока мероприятия
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.classList.add('button-delete');
        deleteButton.textContent = 'Удалить мероприятие';
        deleteButton.style.margin = '10px 0';

        deleteButton.addEventListener('click', () => {
            groupWrapper.remove();
            renumberEventGroups();
        });

        groupWrapper.appendChild(deleteButton);
        container.appendChild(groupWrapper);
    });

    // Функция для перенумерации блоков мероприятий
    function renumberEventGroups() {
        const groups = document.querySelectorAll('.event-group');
        groups.forEach((group, groupIndex) => {
            const steps = group.querySelectorAll('.step-number');
            steps.forEach((el, stepIndex) => {
                el.innerText = `${groupIndex + 2}.${stepIndex + 1}`;
            });
        });
    }

    // Функции для генерации меток, типов инпутов и плейсхолдеров
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
});




        // Скрипт для открытия проводника и обработки выбора файла
        document.getElementById('fileInput').addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                alert(`Вы выбрали файл: ${file.name}`);
                // Здесь можно добавить обработку файла, например, отправку на сервер
            }

        });



    // Эта функция добавляет мероприятие в массив событий
    function saveData() {
        // Собираем данные из формы
        const eventName = document.getElementById('event-name').value;
        const studentCountAll = document.getElementById('student-count-all').value;
        const eventDate = document.getElementById('event-date').value;
        const eventLocation = document.getElementById('event-location').value;
        const eventOrganizer = document.getElementById('event-organizer').value;

        let dateSplit = eventDate.split('-');
        let dateFinal = `${dateSplit[2]}.${dateSplit[1]}.${dateSplit[0]}`;

        // Сохраняем мероприятие в формате объекта
        const event = {
            "name": eventName,
            "student_count_all": parseInt(studentCountAll),
            "student_count_organization": 0, // Пока не указан
            "is_official": true, // Пример, если мероприятие официальное
            "official_type": "Муниципальное", // Пример
            "official_location": eventLocation,
            "official_organizer": eventOrganizer,
            "official_regulations": "LQ==", // Пример, пока не загружен файл
            "date": dateFinal
        };

        // Загружаем массив событий из localStorage
        const reportData = JSON.parse(localStorage.getItem('reportData')) || {};
        if (!reportData.hasOwnProperty('events')) {
                 reportData['events'] = [];
        }
        reportData['events'].push(event)

        // Сохраняем обновленный список событий обратно в localStorage
        localStorage.setItem('reportData', JSON.stringify(reportData));
    }