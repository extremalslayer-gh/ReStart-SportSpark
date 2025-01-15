
    document.addEventListener("DOMContentLoaded", () => {
        // Находим все группы чекбоксов и связанных с ними полей ввода
        const sportItems = document.querySelectorAll(".sports > div");

        sportItems.forEach((item) => {
            // Находим чекбокс и поле для ввода внутри группы
            const checkbox = item.querySelector("input[type='checkbox']");
            const inputField = item.querySelector("input[type='text']");

            if (checkbox && inputField) {
                // Изначально скрываем поле ввода, если чекбокс не отмечен
                inputField.style.display = checkbox.checked ? "inline-block" : "none";

                // Добавляем обработчик события на изменение состояния чекбокса
                checkbox.addEventListener("change", () => {
                    inputField.style.display = checkbox.checked ? "inline-block" : "none";
                });
            }
        });
    });
