document.addEventListener('DOMContentLoaded', () => {
    // === Инициализация состояния ===
    let isFormEdited = false;

    // === Утилиты ===
    function formatDate(dateStr) {
        if (!dateStr.includes("-")) return dateStr;
        const [year, month, day] = dateStr.split("-");
        return `${day}.${month}.${year}`;
    }

    function readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // === Сохранение данных ===
    function saveData() {
        const eventName = document.getElementById('event-name')?.value || '';
        const studentCountAll = document.getElementById('student-count-all')?.value || '';
        const eventDate = document.getElementById('event-date')?.value || '';
        const eventLocation = document.getElementById('event-location')?.value || '';
        const eventOrganizer = document.getElementById('event-organizer')?.value || '';
        const fileBase64 = localStorage.getItem('official_regulations') || 'LQ==';

        const event = {
            name: eventName,
            student_count_all: parseInt(studentCountAll),
            student_count_organization: 0,
            is_official: true,
            official_type: "Муниципальное",
            official_location: eventLocation,
            official_organizer: eventOrganizer,
            official_regulations: fileBase64,
            date: formatDate(eventDate)
        };

        const reportData = JSON.parse(localStorage.getItem('reportData')) || {};
        if (!Array.isArray(reportData.events)) reportData.events = [];
        reportData.events.push(event);
        localStorage.setItem('reportData', JSON.stringify(reportData));
    }

    // === Сохранение полей ===
    function saveFormFields() {
        const fields = {
            eventName: document.getElementById('event-name')?.value || '',
            studentCountAll: document.getElementById('student-count-all')?.value || '',
            eventDate: document.getElementById('event-date')?.value || '',
            eventLocation: document.getElementById('event-location')?.value || '',
            eventOrganizer: document.getElementById('event-organizer')?.value || '',
            fileName: document.getElementById('fileInput')?.files?.[0]?.name || ''
        };
        localStorage.setItem('block35_fields', JSON.stringify(fields));
    }

    // === Загрузка полей ===
    function loadFormFields() {
        const fields = JSON.parse(localStorage.getItem('block35_fields'));
        if (!fields) return;

        const name = document.getElementById('event-name');
        const count = document.getElementById('student-count-all');
        const date = document.getElementById('event-date');
        const loc = document.getElementById('event-location');
        const org = document.getElementById('event-organizer');

        if (name) name.value = fields.eventName || '';
        if (count) count.value = fields.studentCountAll || '';
        if (date) date.value = fields.eventDate || '';
        if (loc) loc.value = fields.eventLocation || '';
        if (org) org.value = fields.eventOrganizer || '';

        if (fields.fileName) {
            const label = document.createElement('div');
            label.textContent = `Ранее выбран файл: ${fields.fileName}`;
            label.style.fontSize = '14px';
            label.style.marginTop = '6px';
            label.style.color = 'gray';
            const fileInput = document.getElementById('fileInput');
            if (fileInput) fileInput.insertAdjacentElement('afterend', label);
        }
    }

    // === Файл ===
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (file) {
                alert(`Вы выбрали файл: ${file.name}`);
                const base64 = await readFileAsBase64(file);
                localStorage.setItem('official_regulations', base64);
                saveFormFields();
            }
        });
    }

    // === Сохранение при изменении ===
    const ids = ['event-name', 'student-count-all', 'event-date', 'event-location', 'event-organizer'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => {
                isFormEdited = true;
                saveFormFields();
            });
        }
    });

    // === Кнопки Далее / Назад ===
    const nextButton = document.querySelector('.button-next');
    const backButton = document.querySelector('.button-back');

    const exitHandler = () => {
        saveData();
        isFormEdited = false;
        window.removeEventListener('beforeunload', beforeUnloadHandler);
    };

    if (nextButton) nextButton.addEventListener('click', exitHandler);
    if (backButton) backButton.addEventListener('click', exitHandler);

    // === Предупреждение при выходе ===
    const beforeUnloadHandler = (e) => {
        if (isFormEdited) {
            e.preventDefault();
            e.returnValue = 'Вы действительно хотите уйти со страницы?';
            return 'Вы действительно хотите уйти со страницы?';
        }
    };
    window.addEventListener('beforeunload', beforeUnloadHandler);

    // === Меню профиля ===
    const profileIcon = document.getElementById('profile-icon');
    const profileMenu = document.getElementById('profile-menu');
    if (profileIcon && profileMenu) {
        profileIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            profileMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', () => {
            if (!profileMenu.classList.contains('hidden')) {
                profileMenu.classList.add('hidden');
            }
        });
    }

    // === Загрузка сохранённых значений ===
    loadFormFields();
});
