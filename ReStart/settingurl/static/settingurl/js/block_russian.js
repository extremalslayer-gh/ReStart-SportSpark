document.addEventListener("DOMContentLoaded", function () {
    // Получаем все чекбоксы
    const checkboxes = document.querySelectorAll('.form-item input[type="checkbox"]');

    // Функция для обновления видимости полей
    function updateFields() {
        checkboxes.forEach(checkbox => {
            const formFields = checkbox.closest('.form-item').querySelector('.form-fields');
            if (checkbox.checked) {
                formFields.style.display = 'block'; // Показываем поля ввода
            } else {
                formFields.style.display = 'none'; // Скрываем поля ввода
            }
        });
    }

    // Инициализация видимости полей при загрузке страницы
    updateFields();

    // Добавляем обработчик события для каждого чекбокса
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateFields);
    });
});
