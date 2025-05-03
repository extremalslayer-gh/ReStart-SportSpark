<script>
function openModal() {
    document.getElementById('report-modal').style.display = 'flex';
    // Здесь можно подставлять реальный текст отчета
    document.getElementById('modal-report-content').innerText = 'Тут будет ваш реальный отчет!';
}

function closeModal() {
    document.getElementById('report-modal').style.display = 'none';
}

// Навешиваем обработчики клика на все глазики
document.querySelectorAll('.report-icon img').forEach(function(img) {
    img.addEventListener('click', function() {
        openModal();
    });
});
</script>
