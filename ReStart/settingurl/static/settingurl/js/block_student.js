
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



    function saveData() {
        const totalStudents = document.getElementById('total-students').value;
        const clubStudents = document.getElementById('club-students').value;

        // Сохраняем численность по классам
        const studentsByGrade = {};
        for (let i = 1; i <= 11; i++) {
            studentsByGrade[`students_grade_${i}`] = parseInt(document.getElementById(`class-${i}`).value) || 0;
        }

        // Сохраняем данные о видах спорта
        const sportsElements = document.querySelectorAll('.sports div');
        const sports = [];
        sportsElements.forEach((sport) => {
            const checkbox = sport.querySelector('input[type="checkbox"]');
            const studentCountInput = sport.querySelector('input[type="text"]');
            if (checkbox.checked) {
                sports.push({
                    name: checkbox.nextSibling.textContent.trim(),
                    student_count: parseInt(studentCountInput.value) || 0,
                });
            }
        });

        // Получаем или создаем данные в localStorage
        const data = JSON.parse(localStorage.getItem('reportData')) || {};
        data.organization = {
            ...data.organization,
            students_total: parseInt(totalStudents) || 0,
            students_organization: parseInt(clubStudents) || 0,
            ...studentsByGrade,
        };
        data.sports = sports;

        // Сохраняем данные в localStorage
        localStorage.setItem('reportData', JSON.stringify(data));
    }

