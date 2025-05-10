document.getElementById("avatarUpload").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (!file) return;

    console.log("Выбран файл:", file.name); // Проверяем, выбирается ли файл

    const reader = new FileReader();
    reader.onload = function(e) {
        console.log("Файл загружен:", e.target.result); // Проверяем, загружается ли изображение
        document.getElementById("avatar").src = e.target.result;
    };
    reader.readAsDataURL(file);
});

document.addEventListener("DOMContentLoaded", () => {
    fetch("/user/get_profile/")
        .then(response => response.json())
        .then(data => {
            if (!data) return;

            // ФИО
            const fullName = `${data.second_name} ${data.first_name} ${data.last_name}`;
            document.getElementById("name").value = fullName;

            // Почта
            document.getElementById("email").value = data.email;

            // Должность
            document.getElementById("position").value = data.occupation;

            // Муниципалитет
            document.getElementById("municipality").value = data.municipality_name;

            // Школа (если приходит отдельно)
            if (data.organization_name) {
                document.getElementById("school-name").value = data.organization_name;
            }

            // Аватар (если есть)
            if (data.profile_image) {
                document.getElementById("avatar").src = `data:image/png;base64,${data.profile_image}`;
            }
        })
        .catch(error => {
            console.error("Ошибка загрузки профиля:", error);
        });
});
