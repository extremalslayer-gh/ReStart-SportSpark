document.addEventListener("DOMContentLoaded", function () {
    const formSection = document.querySelector(".form-section > div");
    const nextBtn = document.querySelector('.button-next');

    async function fetchEventsFromDB() {
        try {
            const response = await fetch('/admin/get_custom_events/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const contentType = response.headers.get("Content-Type") || '';
            if (!contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error("Ожидался JSON, получен HTML:\n" + text);
            }

            const data = await response.json();
            return data.events || [];
        } catch (error) {
            console.error("Ошибка при получении мероприятий из БД:", error);
            return [];
        }
    }

    async function renderEvents() {
        const events = await fetchEventsFromDB();
        formSection.innerHTML = '';

        events.forEach((event, index) => {
            const formItem = document.createElement('div');
            formItem.classList.add('form-item');

            const checkboxId = `event-checkbox-${index + 1}`;
            const inputId = `number-${index + 1}`;

            formItem.innerHTML = `
                <label>
                    <input type="checkbox" id="${checkboxId}" checked>
                    ${index + 1}. ${event.name}
                </label>
                <div class="form-fields" style="display: block;">
                    <label>
                        Количество участников
                        <input type="text" placeholder="Введите количество" id="${inputId}" value="${event.student_count_all || ''}">
                    </label>
                </div>
            `;

            formSection.appendChild(formItem);

            const checkbox = formItem.querySelector('input[type="checkbox"]');
            const formFields = formItem.querySelector('.form-fields');
            checkbox.addEventListener('change', () => {
                formFields.style.display = checkbox.checked ? 'block' : 'none';
            });
        });
    }

    function saveData() {
        const events = [];

        document.querySelectorAll('.form-item').forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            const title = item.querySelector('label').textContent.replace(/^\d+\.\s*/, '').trim();
            const count = item.querySelector('input[type="text"]').value;

            if (checkbox.checked) {
                events.push({
                    name: title,
                    student_count_all: parseInt(count) || 0,
                    student_count_organization: 0,
                    is_official: true,
                    official_type: "Региональное",
                    official_location: "Официальное мероприятие",
                    official_organizer: "Официальное мероприятие",
                    official_regulations: "LQ=="
                });
            }
        });

        let reportData = JSON.parse(localStorage.getItem('reportData')) || {};
        if (Array.isArray(reportData.events)) {
            reportData.events = reportData.events.filter(e => !(e.is_official && e.official_type === "Региональное"));
        } else {
            reportData.events = [];
        }

        reportData.events = reportData.events.concat(events);
        localStorage.setItem('reportData', JSON.stringify(reportData));
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', saveData);
    }

    renderEvents();
});
