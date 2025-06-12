document.addEventListener('DOMContentLoaded', () => {
    const deleteSportBtn = document.getElementById('delete-sport');
    const confirmDeletionBtn = document.getElementById('confirm-deletion');
    const addSportBtn = document.getElementById('add-sport');
    const newSportInput = document.getElementById('new-sport-input');
    const newSportName = document.getElementById('new-sport-name');
    const confirmSportBtn = document.getElementById('confirm-sport');

    // Функция для обновления коллекции чекбоксов
    function updateCheckboxes() {
        return document.querySelectorAll('.sports .sport-item .checkbox');
    }

    // Изначально собираем все чекбоксы
    let checkboxes = updateCheckboxes();

    // Показать чекбоксы для удаления и кнопку подтверждения
    deleteSportBtn.addEventListener('click', () => {
        checkboxes = updateCheckboxes(); // Обновляем коллекцию чекбоксов
        checkboxes.forEach(checkbox => {
            checkbox.style.display = 'inline-block';  // Показываем чекбоксы
        });
        confirmDeletionBtn.style.display = 'inline-block';  // Показываем кнопку подтверждения
    });

    // Подтверждение удаления выбранных видов спорта
    confirmDeletionBtn.addEventListener('click', () => {
        checkboxes = updateCheckboxes(); // Обновляем коллекцию чекбоксов при удалении
        checkboxes.forEach((checkbox, index) => {
            if (checkbox.checked) {
                // Удаляем выбранные виды спорта
                checkbox.closest('.sport-item').remove(); // Удаляем элемент вместе с чекбоксом
            }
        });

        // Скрываем кнопку подтверждения и блокируем чекбоксы
        confirmDeletionBtn.style.display = 'none';
        checkboxes.forEach(checkbox => {
            checkbox.style.display = 'none';  // Скрываем чекбоксы после удаления
        });
    });

    // Обработчик изменения состояния чекбоксов
    document.querySelector('.sports').addEventListener('change', (e) => {
        if (e.target.classList.contains('checkbox')) {
            const item = e.target.closest('.sport-item');
            if (e.target.checked) {
                item.classList.add('checked');  // Добавляем зачеркивание
            } else {
                item.classList.remove('checked');  // Убираем зачеркивание
            }
        }
    });

    // Обработчик для добавления нового вида спорта
    addSportBtn.addEventListener('click', () => {
        newSportInput.style.display = 'block';  // Показываем поле для ввода
    });

    // Подтверждение нового вида спорта
    confirmSportBtn.addEventListener('click', () => {
        const sportName = newSportName.value.trim();  // Получаем название нового вида спорта

        if (sportName) {
            // Создаем новый элемент для выбранного вида спорта
            const newSportDiv = document.createElement('div');
            newSportDiv.classList.add('sport-item');
            newSportDiv.innerHTML = `
                <input type="checkbox" class="checkbox" style="display: none;"> ${sportName}
            `;
            document.querySelector('.sports').appendChild(newSportDiv);  // Добавляем новый вид спорта в блок отображения

            // Очистим поле ввода и скрываем его
            newSportName.value = '';
            newSportInput.style.display = 'none';

            // Обновляем коллекцию чекбоксов
            checkboxes = updateCheckboxes();

            // Добавляем обработчик для нового чекбокса
            const newCheckbox = newSportDiv.querySelector('.checkbox');
            newCheckbox.addEventListener('change', () => {
                updateDeleteButtonVisibility();
            });
        } else {
            alert('Пожалуйста, введите название вида спорта!');
        }
    });

    // Функция для обновления видимости кнопки удаления
    function updateDeleteButtonVisibility() {
        const anyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
        deleteSportBtn.disabled = !anyChecked;
    }
});
