// Получаем элементы
 const modalOverlay = document.getElementById("modal-overlay");
 const secondModalOverlay = document.getElementById("second-modal-overlay");
 const checkboxes = document.querySelectorAll(".access-checkbox");
 var currentCheckbox = null;
 let originalCheckedState = null;

 // Показываем первое модальное окно
 function showModal(checkbox) {
     console.log(123);
     currentCheckbox = checkbox; // Сохраняем текущий checkbox
     originalCheckedState = checkbox.checked; // Сохраняем исходное состояние
     modalOverlay.style.display = "flex";
     // Временно возвращаем галочку в исходное состояние
     checkbox.checked = originalCheckedState;
 }

 // Закрываем первое модальное окно
 function closeModal() {
     modalOverlay.style.display = "none";
     //currentCheckbox = null;
     originalCheckedState = null;
 }

 // Подтверждение действия в первом модальном окне
 function confirmAction() {
     if (currentCheckbox) {
         // Применяем изменение состояния
         currentCheckbox.checked = !originalCheckedState;
     }
     closeModal();
     // Показываем второе модальное окно
     secondModalOverlay.style.display = "flex";
 }

 // Отмена действия в первом модальном окне
 function cancelAction() {
     closeModal(); // Просто закрываем первое окно, без изменений
 }

 // Закрытие второго модального окна
 function closeSecondModal() {
     secondModalOverlay.style.display = "none";
 }

 // Подтверждение действия во втором модальном окне
 async function confirmSecondAction() {
     const passwordInput = document.getElementById("password-input");
     const password = passwordInput.value.trim(); // Получаем введённый пароль

     if (!password) {
         alert("Пожалуйста, введите пароль");
         return;
     }

     try {
         // Отправка POST-запроса
         const response = await fetch("/admin/verify_password/", {
             method: "POST",
             headers: {
                 "Content-Type": "application/json",
                 //"X-CSRFToken": getCSRFToken(), // Добавление CSRF-токена
             },
             body: JSON.stringify({ password: password }), // Отправка пароля в JSON-формате
         });

         if (response.ok) {

             // Проверяем, успешно ли проверен пароль
             if (response.status == 200) {
                 alert("Пароль подтверждён. Доступ изменён!");
                 // Подтверждение действия во втором модальном окне
     if (currentCheckbox) {
         const userId = currentCheckbox.id; // Получаем ID текущего чекбокса
         const banState = currentCheckbox.checked; // Получаем текущее состояние чекбокса

         try {
             // Отправка POST-запроса
             const response = await fetch("/admin/set_user_ban/", {
                 method: "POST",
                 headers: {
                     "Content-Type": "application/json",
                     //"X-CSRFToken": getCSRFToken(), // Добавление CSRF-токена
                 },
                 body: JSON.stringify({
                     id: userId,
                     ban: banState,
                 }), // Отправка ID и состояния чекбокса
             });

             currentCheckbox.checked = !banState;
         } catch (error) {
             console.error("Ошибка при отправке запроса:", error);
             alert("Произошла ошибка. Попробуйте ещё раз.");
             // Возвращаем чекбокс в прежнее состояние при ошибке
             currentCheckbox.checked = !banState;
         } finally {
             // Закрываем второе модальное окно
             closeSecondModal();
         }
     }
             } else {
                 alert("Ошибка: неверный пароль.");
             }
         } else {
             alert("Ошибка при проверке пароля.");
         }
     } catch (error) {
         console.error("Ошибка при отправке запроса:", error);
         alert("Произошла ошибка. Попробуйте ещё раз.");
     } finally {
         // Закрываем второе модальное окно
         closeSecondModal();
     }
 }



     // Функция для загрузки данных пользователей с API
     async function fetchUsers() {
         try {
             const response = await fetch('/admin/get_users/');  // API endpoint для получения списка пользователей
             const users = (await response.json())["users"]; // Преобразуем ответ в формат JSON

             // Получаем элемент tbody для добавления данных
             const tableBody = document.getElementById('users-table-body');

             // Очистим таблицу перед добавлением новых данных
             tableBody.innerHTML = '';

             console.log(users)

             // Добавляем данные о пользователях в таблицу
             for (let user of users) {
                 const row = document.createElement('tr');

                 row.innerHTML = `
                     <td>${user.second_name} ${user.first_name} ${user.last_name}</td>
                     <td>${user.municipality_name}</td>
                     <td>${user.organization_name}</td>
                     <td>${user.email}</td>
                     <td><input type="checkbox" class="access-checkbox" ${user.is_banned ? '' : 'checked'} id="${user.id}"></td>
                     <td><button class="edit-btns" onclick="setManagerId('${user.id}')">✎</button></td>
                 `;

                 tableBody.appendChild(row);  // Добавляем строку в таблицу
             };
                 const checkboxes = document.querySelectorAll(".access-checkbox");
                 // Привязываем обработчики событий для чекбоксов
                 checkboxes.forEach(checkbox => {
                     checkbox.addEventListener("click", function (e) {
                         e.preventDefault(); // Отключаем мгновенное переключение галочки
                         showModal(checkbox);
     });
 });
         } catch (error) {
             console.error('Ошибка при загрузке пользователей:', error);
         }
     }

     // Вызываем функцию для загрузки пользователей при загрузке страницы
     window.onload = fetchUsers;

    function setManagerId(managerId) {
        localStorage.setItem("user.id", managerId);
        // Можно добавить переход или другое действие, например:
        window.location.href = "/managers_edit";
    }


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