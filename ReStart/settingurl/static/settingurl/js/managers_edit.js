function showNotification() {
    const notification = document.getElementById("notification");
    notification.classList.remove("hidden");
    setTimeout(() => {
        notification.classList.add("hidden");
    }, 3000);
}

function closeNotification() {
    document.getElementById("notification").classList.add("hidden");
}

function populateFormWithUser(user) {
    const allName = `${user.first_name || ''} ${user.second_name || ''} ${user.last_name || ''}`.trim();
    document.getElementById('all_name').value = allName;
    document.getElementById('municipality_name').value = user.municipality_name || '';
    document.getElementById('Establishment').value = user.organization_name || '';
    document.getElementById('occupation').value = user.occupation || '';
    document.getElementById('email').value = user.email || '';

    // сохраняем ID
    localStorage.setItem('user.id', user.id);
}

async function fetchUsers() {
    try {
        const response = await fetch('/admin/get_users/');
        const data = await response.json();
        const users = data.users || data; // гибкость формата

        const savedUserId = localStorage.getItem('user.id');
        let user = null;

        if (savedUserId) {
            user = users.find(u => String(u.id) === String(savedUserId));
        }

        if (!user && users.length > 0) {
            user = users[0]; // запасной вариант
        }

        if (user) {
            populateFormWithUser(user);
        } else {
            console.warn("Пользователь не найден.");
        }

    } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    const allName = document.getElementById('all_name').value.trim();
    const fullName = allName.split(' ');
    const firstName = fullName[0] || '';
    const secondName = fullName[1] || '';
    const thirdName = fullName[2] || '';
    const occupation = document.getElementById('occupation').value;

    const userId = localStorage.getItem('user.id');

    if (!userId) {
        alert("ID пользователя не найден. Повторно выберите пользователя.");
        return;
    }

    const userData = {
        id: userId,
        first_name: firstName,
        second_name: secondName,
        last_name: thirdName,
        occupation: occupation
    };

    try {
        const response = await fetch('/admin/edit_user/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            showNotification();
            fetchUsers();
        } else {
            alert('Ошибка: ' + (result.message || 'Неизвестная ошибка'));
        }
    } catch (error) {
        console.error('Ошибка при редактировании:', error);
        alert('Ошибка соединения с сервером.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();

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
});
