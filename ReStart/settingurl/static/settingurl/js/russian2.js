
        document.addEventListener('DOMContentLoaded', () => {
            const deleteEventBtn = document.getElementById('delete-event');
            const confirmDeletionBtn = document.getElementById('confirm-deletion');
            const addEventBtn = document.getElementById('add-event');
            const newEventInput = document.getElementById('new-event-input');
            const newEventName = document.getElementById('new-event-name');
            const newEventCount = document.getElementById('new-event-count');
            const confirmEventBtn = document.getElementById('confirm-event');
            const eventsContainer = document.getElementById('events-container');

            // Функция для обновления коллекции чекбоксов
            function updateCheckboxes() {
                return document.querySelectorAll('.form-item .checkbox');
            }

            // Изначально собираем все чекбоксы
            let checkboxes = updateCheckboxes();

            // Показать чекбоксы для удаления и кнопку подтверждения
            deleteEventBtn.addEventListener('click', () => {
                checkboxes = updateCheckboxes(); // Обновляем коллекцию чекбоксов
                checkboxes.forEach(checkbox => {
                    checkbox.style.display = 'inline-block';  // Показываем чекбоксы
                });
                confirmDeletionBtn.style.display = 'inline-block';  // Показываем кнопку подтверждения
            });

            // Подтверждение удаления выбранных мероприятий
            confirmDeletionBtn.addEventListener('click', () => {
                checkboxes = updateCheckboxes(); // Обновляем коллекцию чекбоксов при удалении
                checkboxes.forEach((checkbox) => {
                    if (checkbox.checked) {
                        // Удаляем выбранные мероприятия
                        checkbox.closest('.form-item').remove(); // Удаляем элемент вместе с чекбоксом
                    }
                });

                // Скрываем кнопку подтверждения и блокируем чекбоксы
                confirmDeletionBtn.style.display = 'none';
                checkboxes.forEach(checkbox => {
                    checkbox.style.display = 'none';  // Скрываем чекбоксы после удаления
                });

                // Перенумеровываем оставшиеся мероприятия
                renumberEvents();
            });

            // Обработчик изменения состояния чекбоксов
            eventsContainer.addEventListener('change', (e) => {
                if (e.target.classList.contains('checkbox')) {
                    const item = e.target.closest('.form-item');
                    if (e.target.checked) {
                        item.classList.add('checked');  // Добавляем зачеркивание
                    } else {
                        item.classList.remove('checked');  // Убираем зачеркивание
                    }
                }
            });

            // Обработчик для добавления нового мероприятия
            addEventBtn.addEventListener('click', () => {
                newEventInput.style.display = 'block';  // Показываем поле для ввода
            });

            // Подтверждение нового мероприятия
            confirmEventBtn.addEventListener('click', () => {
                const eventName = newEventName.value.trim();  // Получаем название нового мероприятия
                const eventCount = newEventCount.value.trim();  // Получаем количество участников

                if (eventName && eventCount) {
                    // Создаем новый элемент для мероприятия
                    const newEventDiv = document.createElement('div');
                    newEventDiv.classList.add('form-item');

                    // Определяем номер нового мероприятия
                    const eventNumber = document.querySelectorAll('.form-item').length + 1;

                    newEventDiv.innerHTML = `
                        <label>
                            <input type="checkbox" class="checkbox" style="display: none;">
                            ${eventNumber}. ${eventName}
                        </label>
                        <div class="form-fields">
                            <label>
                                Количество участников
                                <input type="text" placeholder="${eventCount}" class="participants-count" value="${eventCount}">
                            </label>
                        </div>
                    `;
                    eventsContainer.appendChild(newEventDiv);  // Добавляем новое мероприятие в блок отображения

                    // Очищаем поля ввода и скрываем их
                    newEventName.value = '';
                    newEventCount.value = '';
                    newEventInput.style.display = 'none';

                    // Обновляем коллекцию чекбоксов
                    checkboxes = updateCheckboxes();

                    // Добавляем обработчик для нового чекбокса
                    const newCheckbox = newEventDiv.querySelector('.checkbox');
                    newCheckbox.addEventListener('change', () => {
                        updateDeleteButtonVisibility();
                    });
                } else {
                    alert('Пожалуйста, заполните все поля!');
                }
            });

            // Функция для перенумерации мероприятий
            function renumberEvents() {
                const events = document.querySelectorAll('.form-item');
                events.forEach((event, index) => {
                    const label = event.querySelector('label');
                    const text = label.textContent.trim();
                    // Удаляем старый номер (если есть)
                    const newText = text.replace(/^\d+\./, '');
                    // Добавляем новый номер
                    label.textContent = `${index + 1}. ${newText}`;
                });
            }

            // Функция для обновления видимости кнопки удаления
            function updateDeleteButtonVisibility() {
                const anyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
                deleteEventBtn.disabled = !anyChecked;
            }
        });

        // Обработчик для меню профиля
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
