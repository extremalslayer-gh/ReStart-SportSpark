        // Скрипт для открытия проводника и обработки выбора файла
        document.getElementById('fileInput').addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                alert(`Вы выбрали файл: ${file.name}`);
                // Здесь можно добавить обработку файла, например, отправку на сервер
            }
        });