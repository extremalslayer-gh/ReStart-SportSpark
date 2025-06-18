document.addEventListener('DOMContentLoaded', () => {
    const deleteSportBtn = document.getElementById('delete-sport');
    const confirmDeletionBtn = document.getElementById('confirm-deletion');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const addSportBtn = document.getElementById('add-sport');
    const cancelAddBtn = document.getElementById('cancel-add');
    const newSportInput = document.getElementById('new-sport-input');
    const newSportName = document.getElementById('new-sport-name');
    const confirmSportBtn = document.getElementById('confirm-sport');
    const sportsContainer = document.getElementById('sports-container');
    const container = document.querySelector('.container');

    // Утилита отправки данных
    async function postData(url = '', data = {}) {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    // Загрузка видов спорта с сервера
    async function loadSports() {
        try {
            const data = await postData('/admin/get_custom_sports/', {});
            sportsContainer.innerHTML = '';
            data.sports.forEach(sport => {
                const sportDiv = document.createElement('div');
                sportDiv.classList.add('sport-item');
                sportDiv.setAttribute('data-id', sport.id);
                sportDiv.innerHTML = `
                    <label>
                        <input type="checkbox" class="main-checkbox">
                        <span class="sport-title">${sport.name}</span>
                    </label>
                `;
                sportsContainer.appendChild(sportDiv);
            });
        } catch (err) {
            console.error('Ошибка загрузки видов спорта:', err);
        }
    }

    // Инициализация
    loadSports();

    // Активация режима удаления
    function activateDeleteMode() {
        container.classList.add('delete-mode');
        container.classList.remove('add-mode');
        document.querySelectorAll('.sport-item .main-checkbox').forEach(cb => {
            cb.style.display = 'inline-block';
        });
        confirmDeletionBtn.style.display = 'inline-block';
        cancelDeleteBtn.style.display = 'inline-block';
        deleteSportBtn.classList.remove('active');
    }

    // Деактивация режима удаления
    function deactivateDeleteMode() {
        container.classList.remove('delete-mode');
        document.querySelectorAll('.sport-item .main-checkbox').forEach(cb => {
            cb.style.display = 'none';
            cb.checked = false;
            cb.closest('.sport-item').classList.remove('checked');
        });
        confirmDeletionBtn.style.display = 'none';
        cancelDeleteBtn.style.display = 'none';
        deleteSportBtn.classList.add('active');
    }

    // Активация режима добавления
    function activateAddMode() {
        container.classList.add('add-mode');
        container.classList.remove('delete-mode');
        newSportInput.style.display = 'block';
        addSportBtn.classList.remove('active');
    }

    // Деактивация режима добавления
    function deactivateAddMode() {
        container.classList.remove('add-mode');
        newSportInput.style.display = 'none';
        newSportName.value = '';
        addSportBtn.classList.add('active');
    }

    // Добавление нового вида спорта
    confirmSportBtn.addEventListener('click', async () => {
        const sportName = newSportName.value.trim();
        if (sportName) {
            try {
                const response = await postData('/admin/add_custom_sports/', { name: sportName });
                alert(response.message);
                deactivateAddMode();
                await loadSports();
            } catch (err) {
                console.error('Ошибка при добавлении:', err);
            }
        } else {
            alert('Введите название вида спорта');
        }
    });

    // Удаление выбранных видов спорта
    confirmDeletionBtn.addEventListener('click', async () => {
        const checkboxes = document.querySelectorAll('.sport-item .main-checkbox:checked');
        for (const checkbox of checkboxes) {
            const item = checkbox.closest('.sport-item');
            const id = item.getAttribute('data-id');
            if (id) {
                try {
                    const response = await postData('/admin/delete_custom_sports/', { id: Number(id) });
                    console.log(response.message);
                } catch (err) {
                    console.error(`Ошибка при удалении ID ${id}:`, err);
                }
            }
        }
        deactivateDeleteMode();
        await loadSports();
    });

    // Обработка чекбоксов при удалении
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('main-checkbox') && container.classList.contains('delete-mode')) {
            e.target.closest('.sport-item').classList.toggle('checked', e.target.checked);
        }
    });

    // Кнопки управления режимами
    deleteSportBtn.addEventListener('click', activateDeleteMode);
    cancelDeleteBtn.addEventListener('click', deactivateDeleteMode);
    addSportBtn.addEventListener('click', activateAddMode);
    cancelAddBtn.addEventListener('click', deactivateAddMode);

    // Скрытие меню профиля
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

    // Заглушка сохранения
    window.saveData = function () {
        const sports = [];
        document.querySelectorAll('#sports-container .sport-item').forEach(item => {
            const title = item.querySelector('.sport-title').textContent;
            const id = item.getAttribute('data-id') || null;
            sports.push({ id, title });
        });
        console.log('Сохранённые данные:', sports);
    };
});
