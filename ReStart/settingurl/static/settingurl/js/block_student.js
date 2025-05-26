
    document.addEventListener("DOMContentLoaded", () => {
        // Находим все группы чекбоксов и связанных с ними полей ввода
        const sportItems = document.querySelectorAll(".sports > div");

        sportItems.forEach((item) => {
            // Находим чекбокс и поле для ввода внутри группы
            const checkbox = item.querySelector("input[type='checkbox']");
            const inputField = item.querySelector("input[type='text']");

            if (checkbox && inputField) {
                // Изначально скрываем поле ввода, если чекбокс не отмечен
                inputField.style.display = checkbox.checked ? "inline-block" : "none";

                // Добавляем обработчик события на изменение состояния чекбокса
                checkbox.addEventListener("change", () => {
                    inputField.style.display = checkbox.checked ? "inline-block" : "none";
                });
            }
        });
    });




    function saveData() {
        const totalStudents = document.getElementById('total-students').value;
        const clubStudents = document.getElementById('club-students').value;

        // Сохраняем численность по классам
        const studentsByGrade = {};
        for (let i = 1; i <= 11; i++) {
            studentsByGrade[`students_grade_${i}`] = parseInt(document.getElementById(`class-${i}`).value) || 0;
        }

        // Сохраняем данные о видах спорта
        const sportsElements = document.querySelectorAll('.sports div');
        const sports = [];
        sportsElements.forEach((sport) => {
            const checkbox = sport.querySelector('input[type="checkbox"]');
            const studentCountInput = sport.querySelector('input[type="text"]');
            if (checkbox.checked) {
                sports.push({
                    name: checkbox.nextSibling.textContent.trim(),
                    student_count: parseInt(studentCountInput.value) || 0,
                });
            }
        });

        // Получаем или создаем данные в localStorage
        const data = JSON.parse(localStorage.getItem('reportData')) || {};
        data.organization = {
            ...data.organization,
            students_total: parseInt(totalStudents) || 0,
            students_organization: parseInt(clubStudents) || 0,
            ...studentsByGrade,
        };
        data.sports = sports;

        // Сохраняем данные в localStorage
        localStorage.setItem('reportData', JSON.stringify(data));
    }



// --- Сохранение текущих данных всех полей в localStorage ---
function saveFormFields() {
    const formFields = {
        totalStudents: document.getElementById('total-students')?.value || '',
        clubStudents: document.getElementById('club-students')?.value || '',
        grades: {},
        sports: []
    };

    for (let i = 1; i <= 11; i++) {
        formFields.grades[`class-${i}`] = document.getElementById(`class-${i}`)?.value || '';
    }

    const sportItems = document.querySelectorAll('.sports > div');
    sportItems.forEach((item, index) => {
        const checkbox = item.querySelector("input[type='checkbox']");
        const input = item.querySelector("input[type='text']");
        formFields.sports.push({
            checked: checkbox.checked,
            value: input.value || ''
        });
    });

    localStorage.setItem('formFields_sports', JSON.stringify(formFields));
}

// --- Загрузка сохранённых данных из localStorage ---
function loadFormFields() {
    const data = JSON.parse(localStorage.getItem('formFields_sports'));
    if (!data) return;

    document.getElementById('total-students').value = data.totalStudents || '';
    document.getElementById('club-students').value = data.clubStudents || '';

    for (let i = 1; i <= 11; i++) {
        document.getElementById(`class-${i}`).value = data.grades[`class-${i}`] || '';
    }

    const sportItems = document.querySelectorAll('.sports > div');
    sportItems.forEach((item, index) => {
        const checkbox = item.querySelector("input[type='checkbox']");
        const input = item.querySelector("input[type='text']");
        if (data.sports[index]) {
            checkbox.checked = data.sports[index].checked;
            input.value = data.sports[index].value;
            input.style.display = checkbox.checked ? 'inline-block' : 'none';
        }
    });
}

// --- Отслеживание изменений ---
document.addEventListener("DOMContentLoaded", () => {
    loadFormFields();

    document.getElementById('total-students').addEventListener('input', saveFormFields);
    document.getElementById('club-students').addEventListener('input', saveFormFields);
    for (let i = 1; i <= 11; i++) {
        document.getElementById(`class-${i}`).addEventListener('input', saveFormFields);
    }
});

// --- Предупреждение при выходе ---
let isFormEdited = true;

window.addEventListener('beforeunload', function (e) {
    if (isFormEdited) {
        localStorage.removeItem('formFields_sports');
        e.preventDefault();
        e.returnValue = 'Вы действительно хотите уйти со страницы?';
        return 'Вы действительно хотите уйти со страницы?';
    }
});

// --- Сброс флага при "далее" или "назад" ---
document.addEventListener('DOMContentLoaded', function() {
    const nextButton = document.querySelector('.button-next');
    const backButton = document.querySelector('.button-back');

    const saveAndReset = () => {
        saveData();
        isFormEdited = false;
        window.removeEventListener('beforeunload');
    };

    if (nextButton) nextButton.addEventListener('click', saveAndReset);
    if (backButton) backButton.addEventListener('click', saveAndReset);
});
