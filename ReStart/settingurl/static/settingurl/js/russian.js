document.addEventListener('DOMContentLoaded', () => {
    const deleteEventBtn = document.getElementById('delete-event');
    const confirmDeletionBtn = document.getElementById('confirm-deletion');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const addEventBtn = document.getElementById('add-event');
    const cancelAddBtn = document.getElementById('cancel-add');
    const newEventInput = document.getElementById('new-event-input');
    const newEventName = document.getElementById('new-event-name');
    const confirmEventBtn = document.getElementById('confirm-event');
    const eventsContainer = document.getElementById('events-container');
    const container = document.querySelector('.container');

    async function postData(url = '', data = {}) {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        // Проверка: получаем не HTML-ошибку?
        const contentType = response.headers.get('Content-Type') || '';
        if (!contentType.includes('application/json')) {
            const text = await response.text();
            throw new Error('Ошибка: сервер вернул не JSON. Ответ:\n' + text);
        }

        return response.json();
    }

    async function loadEvents() {
        try {
            const data = await postData('/admin/get_custom_events/', {});
            eventsContainer.innerHTML = '';
            data.events.forEach(event => {
                if (event.event_type != 'Всероссийское')
                {
                    return;
                }
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event-item');
                eventDiv.setAttribute('data-id', event.id);
                eventDiv.innerHTML = `
                    <label>
                        <input type="checkbox" class="main-checkbox">
                        <span class="event-title">${event.name}</span>
                    </label>
                `;
                eventsContainer.appendChild(eventDiv);
            });
        } catch (err) {
            console.error('Ошибка загрузки мероприятий:', err);
        }
    }

        loadEvents();

    loadEvents().then(() => {
        deactivateDeleteMode(); // <-- Сразу скрываем чекбоксы и кнопку "Отменить"
    });


    function activateDeleteMode() {
        container.classList.add('delete-mode');
        container.classList.remove('add-mode');
        document.querySelectorAll('.event-item .main-checkbox').forEach(cb => {
            cb.style.display = 'inline-block';
        });
        confirmDeletionBtn.style.display = 'inline-block';
        cancelDeleteBtn.style.display = 'inline-block';
        deleteEventBtn.classList.remove('active');
    }

    function deactivateDeleteMode() {
        container.classList.remove('delete-mode');
        document.querySelectorAll('.event-item .main-checkbox').forEach(cb => {
            cb.style.display = 'none';
            cb.checked = false;
            cb.closest('.event-item').classList.remove('checked');
        });
        confirmDeletionBtn.style.display = 'none';
        cancelDeleteBtn.style.display = 'none';
        deleteEventBtn.classList.add('active');
    }

    function activateAddMode() {
        container.classList.add('add-mode');
        container.classList.remove('delete-mode');
        newEventInput.style.display = 'block';
        addEventBtn.classList.remove('active');
    }

    function deactivateAddMode() {
        container.classList.remove('add-mode');
        newEventInput.style.display = 'none';
        newEventName.value = '';
        addEventBtn.classList.add('active');
    }

    confirmEventBtn.addEventListener('click', async () => {
        const eventName = newEventName.value.trim();
        if (eventName) {
            try {
                const response = await postData('/admin/add_custom_event/', { name: eventName, event_type: 'Всероссийское'});
                alert(response.message);
                deactivateAddMode();
                await loadEvents();
                deactivateDeleteMode(); // <-- добавьте это
            } catch (err) {
                console.error('Ошибка при добавлении:', err);
            }
        } else {
            alert('Введите название мероприятия');
        }
    });

    confirmDeletionBtn.addEventListener('click', async () => {
        const checkboxes = document.querySelectorAll('.event-item .main-checkbox:checked');
        for (const checkbox of checkboxes) {
            const item = checkbox.closest('.event-item');
            const id = item.getAttribute('data-id');
            if (id) {
                try {
                    const response = await postData('/admin/delete_custom_event/', { id: Number(id) });
                    console.log(response.message);
                } catch (err) {
                    console.error(`Ошибка при удалении ID ${id}:`, err);
                }
            }
        }
        deactivateDeleteMode();
        await loadEvents();
        deactivateDeleteMode(); // <-- добавьте это (ещё раз, чтобы скрыть чекбоксы после обновления)
    });

    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('main-checkbox') && container.classList.contains('delete-mode')) {
            e.target.closest('.event-item').classList.toggle('checked', e.target.checked);
        }
    });

    deleteEventBtn.addEventListener('click', activateDeleteMode);
    cancelDeleteBtn.addEventListener('click', deactivateDeleteMode);
    addEventBtn.addEventListener('click', activateAddMode);
    cancelAddBtn.addEventListener('click', deactivateAddMode);

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

    window.saveData = function () {
        const events = [];
        document.querySelectorAll('#events-container .event-item').forEach(item => {
            const title = item.querySelector('.event-title').textContent;
            const id = item.getAttribute('data-id') || null;
            events.push({ id, title });
        });
        console.log('Сохранённые данные:', events);
    };
});




