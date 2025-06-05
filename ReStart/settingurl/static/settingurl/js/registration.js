function showNotification(event) {
    event.preventDefault(); // Останавливаем отправку формы

    const notification = document.getElementById("notification");
    notification.classList.remove("hidden"); // Показываем уведомление

    // Автоматически скрыть уведомление через 3 секунды
    setTimeout(() => {
        notification.classList.add("hidden");
    }, 3000);
}

function closeNotification() {
    const notification = document.getElementById("notification");
    notification.classList.add("hidden"); // Скрываем уведомление
}



    // Закрытие уведомления
    function closeNotification() {
        document.getElementById("notification").classList.add("hidden");
    }

    // Функция для получения списка пользователей
    async function fetchUsers() {
        try {
            const response = await fetch('/admin/get_users/');
            const users = await response.json();

            const userList = document.getElementById('users');
            userList.innerHTML = '';

            users.forEach(user => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `${user.all_name} (${user.municipality_name}) - ${user.Establishment} - ${user.occupation} - ${user.email}
                    <button onclick="toggleUserBan(${user.id}, ${user.is_banned})">${user.is_banned ? 'Разблокировать' : 'Заблокировать'}</button>`;
                userList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Ошибка при получении списка пользователей:', error);
        }
    }

    // Функция для блокировки/разблокировки пользователя
    async function toggleUserBan(userId, isBanned) {
        const banStatus = !isBanned;
        try {
            const response = await fetch('/admin/set_user_ban/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    //'X-CSRFToken': '{{ csrf_token }}'  // Если используете Django, добавьте токен CSRF
                },
                body: JSON.stringify({
                    id: userId,
                    ban: banStatus
                })
            });

            const result = await response.json();
            if (response.ok) {
                alert('Статус пользователя обновлен');
                fetchUsers();  // Обновляем список пользователей
            } else {
                alert('Ошибка при обновлении статуса пользователя');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при блокировке/разблокировке пользователя.');
        }
    }

    // Функция для обработки отправки формы
    async function handleSubmit(event) {
        event.preventDefault(); // Предотвращаем стандартное поведение формы

        const allName = document.getElementById('all_name').value;
        const fullName = allName.split(' ');
        const firstName = fullName[0];
        const secondName = fullName[1];
        const thirdName = fullName[2];
        const municipalityName = document.getElementById('municipality_name').value;
        const Establishment = document.getElementById('Establishment').value;
        const occupation = document.getElementById('occupation').value;
        const email = document.getElementById('email').value;

        const userData = {
            user: {
                first_name: firstName,
                second_name: secondName,
                last_name: thirdName,
                municipality_name: municipalityName,
                occupation: occupation,
                email: email
            },
            organization: {
                name: Establishment
            }
        };

        try {
            const response = await fetch('/register/create_account/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    //'X-CSRFToken': '{{ csrf_token }}'  // Если используете Django, добавьте токен CSRF
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            if (response.ok) {
                // Показать уведомление об успешной регистрации
                document.getElementById("notification").classList.remove("hidden");
                fetchUsers();  // Обновляем список пользователей
            } else {
                alert('Ошибка регистрации: ' + result.message);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при регистрации.');
        }
    }

    // Загружаем список пользователей при загрузке страницы
    window.onload = fetchUsers;



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