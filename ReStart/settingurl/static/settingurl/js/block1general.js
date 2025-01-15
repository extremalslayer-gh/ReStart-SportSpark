document.querySelectorAll('.day-checkbox').forEach((checkbox) => {
  checkbox.addEventListener('change', (event) => {
    const day = event.target.dataset.day;
    const hoursContainer = document.getElementById(`hours-${day}`);
    if (event.target.checked) {
      hoursContainer.classList.remove('hidden');
    } else {
      hoursContainer.classList.add('hidden');
    }
  });
});
