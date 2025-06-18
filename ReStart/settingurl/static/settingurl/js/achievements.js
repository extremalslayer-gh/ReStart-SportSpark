// --- Кодировка в Base64 (текст и файл) ---
function encodeBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

// --- Прочитать файл как base64 ---
function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1]; // убираем data:...
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// --- Сохраняем данные формы (название и имя файла) отдельно ---
function saveFormFields() {
    const formFields = {
        eventName: document.getElementById('event-name')?.value || '',
        fileName: document.getElementById('fileInput')?.files?.[0]?.name || ''
    };
    localStorage.setItem('formFields_achievements', JSON.stringify(formFields));
}

// --- Загружаем данные из localStorage ---
function loadFormFields() {
    const formFields = JSON.parse(localStorage.getItem('formFields_achievements'));
    if (!formFields) return;

    document.getElementById('event-name').value = formFields.eventName || '';

    if (formFields.fileName) {
        const label = document.createElement('div');
        label.textContent = `Ранее выбран файл: ${formFields.fileName}`;
        label.style.fontSize = '14px';
        label.style.marginTop = '6px';
        label.style.color = 'gray';
        document.getElementById('fileInput').insertAdjacentElement('afterend', label);
    }
}

// --- Сохраняем достижение в reportData.organization.achievements (в base64) ---
async function saveData() {
    const eventName = document.getElementById('event-name').value.trim();
    const fileInput = document.getElementById('fileInput');
    const file = fileInput?.files?.[0];

    const achievementNameBase64 = encodeBase64(eventName || 'Без названия');

    let fileBase64 = "LQ=="; // дефолтное значение, если файл не выбран
    if (file) {
        fileBase64 = await readFileAsBase64(file);
    }

    const reportData = JSON.parse(localStorage.getItem('reportData')) || {};
    reportData.organization = reportData.organization || {};
    reportData.organization.achievements = fileBase64;

    localStorage.setItem('reportData', JSON.stringify(reportData));
    localStorage.removeItem('formFields_achievements');
}

// --- Флаг редактирования формы ---
let isFormEdited = false; // ❗ по умолчанию отключено

// --- Обработчик beforeunload ---

window.onbeforeunload = null;

// --- Инициализация при загрузке страницы ---
document.addEventListener('DOMContentLoaded', function () {
    loadFormFields();

    // При вводе текста
    document.getElementById('event-name').addEventListener('input', () => {
        isFormEdited = true;
        saveFormFields();
    });

    // При выборе файла
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', function () {
            isFormEdited = true;
            saveFormFields();
            const file = fileInput.files[0];
            if (file) {
                alert(`Вы выбрали файл: ${file.name}`);
            }
        });
    }

    // Обработка кнопок Назад и Далее
    const nextButton = document.querySelector('.button-next');
    const backButton = document.querySelector('.button-back');

    const saveAndReset = async () => {
        await saveData();
        isFormEdited = false;
        window.removeEventListener('beforeunload', beforeUnloadHandler); // снять обработчик
        if (isFormEdited) {
            localStorage.removeItem('formFields_achievements');
        }
    };

    if (nextButton) nextButton.addEventListener('click', saveAndReset);
    if (backButton) backButton.addEventListener('click', saveAndReset);
});

// --- Меню профиля ---
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
