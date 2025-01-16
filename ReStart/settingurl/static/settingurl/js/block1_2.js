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
        const reportData = JSON.parse(localStorage.getItem('reportData')) || {};
        reportData['events'] = []
        reportData['events'].push(event)

        // Сохраняем обновленный список событий обратно в localStorage
        localStorage.setItem('reportData', JSON.stringify(reportData));
    }


