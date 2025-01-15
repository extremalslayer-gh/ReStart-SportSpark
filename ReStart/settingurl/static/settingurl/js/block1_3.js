        // Скрипт для открытия проводника и обработки выбора файла
        document.getElementById('fileInput').addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                alert(`Вы выбрали файл: ${file.name}`);
                // Здесь можно добавить обработку файла, например, отправку на сервер
            }
        });




    // Эта функция срабатывает при нажатии на кнопку "Далее"
    function saveData() {
        // Загружаем данные из localStorage
        const data = JSON.parse(localStorage.getItem('reportData')) || {};
        const sports = data.sports || [];

        // Получаем введенные данные из формы
        const location = document.getElementById('location').value || 'Место проведения';
        const inventoryAvailable = document.getElementById('inventory-available').value || 'Инвентарь в наличии: 0';
        const inventoryUsed = document.getElementById('inventory-used').value || 'Используемый инвентарь: 0';

        const inventoryData = `${inventoryAvailable} : ${inventoryUsed}`;

        // Проходим по каждому виду спорта и обновляем данные
        sports.forEach(sport => {
            sport.location = location; // Обновляем место проведения
            sport.inventory = inventoryData; // Обновляем инвентарь
        });

        // Сохраняем обновленные данные обратно в localStorage
        localStorage.setItem('reportData', JSON.stringify(data));
    }






