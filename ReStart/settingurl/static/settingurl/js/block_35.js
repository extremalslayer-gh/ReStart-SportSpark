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
        //reportData['events'] = []
        reportData['events'].push(event)

        // Сохраняем обновленный список событий обратно в localStorage
        localStorage.setItem('reportData', JSON.stringify(reportData));
    }
