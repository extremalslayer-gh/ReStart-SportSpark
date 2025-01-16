document.addEventListener("DOMContentLoaded", () => {
    // Получаем кнопки для фильтров
    const filterButtons = document.querySelectorAll(".filter-btn");

    filterButtons.forEach((button) => {
        const dropdown = button.nextElementSibling;

        // Открытие/закрытие выпадающих списков
        button.addEventListener("click", () => {
            dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
        });

        // Закрытие выпадающих списков при клике вне их области
        document.addEventListener("click", (e) => {
            if (!dropdown.contains(e.target) && e.target !== button) {
                dropdown.style.display = "none";
            }
        });
    });

    // Обработчик изменения состояния чекбоксов
    const checkboxes = document.querySelectorAll(".filter-dropdown input[type='checkbox']");

    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", applyFilter);
    });

    function applyFilter() {
        const rows = document.querySelectorAll(".styled-table tbody tr");  // Строки таблицы
        const checkedValues = Array.from(document.querySelectorAll(".filter-dropdown input[type='checkbox']:checked"))
            .map((checkbox) => checkbox.value);  // Массив выбранных значений

        rows.forEach((row) => {
            const leaderName = row.cells[0].innerText.trim();  // Получаем имя руководителя из первой ячейки таблицы

            // Проверка, соответствует ли имя руководителя хотя бы одному из выбранных значений
            if (checkedValues.length === 0 || checkedValues.includes(leaderName)) {
                row.style.display = "";  // Показываем строку
            } else {
                row.style.display = "none";  // Скрываем строку
            }
        });
    }
});
