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