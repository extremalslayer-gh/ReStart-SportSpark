document.addEventListener("DOMContentLoaded", async () => {
    let isFormEdited = true;

    const sportsContainer = document.querySelector('.sports');
    const inputsIds = ['total-students', 'club-students'];
    for (let i = 1; i <= 11; i++) inputsIds.push(`class-${i}`);

    // Получение видов спорта с сервера
    async function fetchSportsList() {
        try {
            const res = await fetch('/admin/get_custom_sports/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            const data = await res.json();
            return data.sports || [];
        } catch (e) {
            console.error('Ошибка загрузки видов спорта:', e);
            return [];
        }
    }

    // Рендер чекбоксов с input'ами по списку
    async function renderSports() {
        const sports = await fetchSportsList();
        sportsContainer.innerHTML = '';

        sports.forEach(sport => {
            const sportDiv = document.createElement('div');
            sportDiv.innerHTML = `
                <label>
                    <input type="checkbox" data-id="${sport.id}">
                    ${sport.name}
                    <input type="text" placeholder="Кол-во участников" style="display: none;">
                </label>
            `;
            sportsContainer.appendChild(sportDiv);
        });

        updateSportInputs();
        loadFormFields(); // применим сохранённые данные из localStorage после рендера
    }

    // Показать/скрыть поля ввода под чекбоксами
    function updateSportInputs() {
        const checkboxes = sportsContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            const input = cb.parentElement.querySelector('input[type="text"]');
            if (input) input.style.display = cb.checked ? 'inline-block' : 'none';
        });
    }

    // Сохранение всех полей в localStorage
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

        const sportItems = sportsContainer.querySelectorAll('div');
        sportItems.forEach(item => {
            const checkbox = item.querySelector("input[type='checkbox']");
            const input = item.querySelector("input[type='text']");
            formFields.sports.push({
                id: checkbox.dataset.id,
                name: checkbox.nextSibling.textContent.trim(),
                checked: checkbox.checked,
                value: input.value || ''
            });
        });

        localStorage.setItem('formFields_sports', JSON.stringify(formFields));
        console.log('Сохранено: formFields_sports', formFields);
    }

    // Загрузка данных из localStorage
    function loadFormFields() {
        const formFields = JSON.parse(localStorage.getItem('formFields_sports'));
        if (!formFields) return;

        document.getElementById('total-students').value = formFields.totalStudents || '';
        document.getElementById('club-students').value = formFields.clubStudents || '';

        for (let i = 1; i <= 11; i++) {
            document.getElementById(`class-${i}`).value = formFields.grades[`class-${i}`] || '';
        }

        const sportItems = sportsContainer.querySelectorAll('div');
        sportItems.forEach((item, index) => {
            const checkbox = item.querySelector("input[type='checkbox']");
            const input = item.querySelector("input[type='text']");
            const sportData = formFields.sports.find(s => s.id === checkbox.dataset.id);
            if (sportData) {
                checkbox.checked = sportData.checked;
                input.value = sportData.value;
                input.style.display = checkbox.checked ? 'inline-block' : 'none';
            }
        });

        updateSportInputs();
        console.log('Загружено: formFields_sports', formFields);
    }

    // Сохранение в reportData
    function saveData() {
        const totalStudents = document.getElementById('total-students').value;
        const clubStudents = document.getElementById('club-students').value;

        const studentsByGrade = {};
        for (let i = 1; i <= 11; i++) {
            studentsByGrade[`students_grade_${i}`] = parseInt(document.getElementById(`class-${i}`).value) || 0;
        }

        const sports = [];
        sportsContainer.querySelectorAll('div').forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            const input = item.querySelector('input[type="text"]');
            if (checkbox.checked) {
                sports.push({
                    name: checkbox.nextSibling.textContent.trim(),
                    student_count: parseInt(input.value) || 0
                });
            }
        });

        const data = JSON.parse(localStorage.getItem('reportData')) || {};
        data.organization = {
            ...data.organization,
            students_total: parseInt(totalStudents) || 0,
            students_organization: parseInt(clubStudents) || 0,
            ...studentsByGrade,
        };
        data.sports = sports;

        localStorage.setItem('reportData', JSON.stringify(data));
        console.log('Сохранено: reportData', data);
    }

    // Добавление слушателей на поля
    inputsIds.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => {
                saveFormFields();
                isFormEdited = true;
            });
        }
    });

    // Делегирование на чекбоксы
    sportsContainer.addEventListener('change', e => {
        if (e.target && e.target.type === 'checkbox') {
            updateSportInputs();
            saveFormFields();
            isFormEdited = true;
        }
    });

    // Сохранение при переходе
    const nextButton = document.querySelector('.button-next');
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            saveFormFields();
            saveData();
            isFormEdited = false;
        });
    }

    const backButton = document.querySelector('.button-back');
    if (backButton) {
        backButton.addEventListener('click', () => {
            saveFormFields();
            isFormEdited = false;
        });
    }

    window.addEventListener('beforeunload', (e) => {
        if (isFormEdited) {
            e.preventDefault();
            e.returnValue = 'Вы действительно хотите уйти со страницы?';
        }
    });

    // Загружаем и рендерим всё при старте
    await renderSports();
});


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