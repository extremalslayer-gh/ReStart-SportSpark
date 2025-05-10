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


document.addEventListener("DOMContentLoaded", () => {
    fetchAllReports();
    ["city", "organization", "leader", "date", "edits"].forEach(id => {
    document.getElementById(id).addEventListener("change", applyFilters);
});

});

function fetchAllReports() {
    fetch("/admin/get_reports/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            page: 0
        })
    })
    .then(response => response.json())
    .then(data => {
        // Если пришёл один отчёт — оборачиваем в массив
        const reports = data.reports;

        fillTable(reports);
        fillFilters(reports);
    })
    .catch(error => {
        console.error("Ошибка при загрузке отчётов:", error);
    });
}


function fillTable(reports) {
    const tbody = document.getElementById("reportData");
    tbody.innerHTML = "";

    reports.forEach(report => {
        const org = report.organization;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${report.user_name}</td>
            <td>${org.students_organization}</td>
            <td>${org.students_total}</td>
            <td>${org.students_grade_1}</td>
            <td>${org.students_grade_2}</td>
            <td>${org.students_grade_3}</td>
            <td>${org.students_grade_4}</td>
            <td>${org.students_grade_5}</td>
            <td>${org.students_grade_6}</td>
            <td>${org.students_grade_7}</td>
            <td>${org.students_grade_8}</td>
            <td>${org.students_grade_9}</td>
            <td>${org.students_grade_10}</td>
            <td>${org.students_grade_11}</td>
        `;
        tbody.appendChild(row);
    });
}


function fillFilters(reports) {
    const cities = new Set();
    const orgs = new Set();
    const leaders = new Set();
    const dates = new Set();
    const edits = new Set();

    reports.forEach(report => {
        const org = report.organization;
        let creation_time = org.creation_time.split('T')[0].split('-');
        creation_time = creation_time[2] + '.' + creation_time[1] + '.' + creation_time[0];
        cities.add(report.municipality_name); // Или другой ключ, если есть "город"
        orgs.add(org.name);
        leaders.add(report.user_name);
        dates.add(creation_time); // обрезаем время, если есть
        edits.add(creation_time); // или другой параметр, обозначающий "правки"
    });

    populateSelect("city", cities);
    populateSelect("organization", orgs);
    populateSelect("leader", leaders);
    populateSelect("date", dates);
    populateSelect("edits", edits);
}

function populateSelect(selectId, values) {
    const select = document.getElementById(selectId);
    select.innerHTML = '<option>Все</option>';
    Array.from(values).sort().forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    });
}

function applyFilters() {
    const city = document.getElementById("city").value;
    const org = document.getElementById("organization").value;
    const leader = document.getElementById("leader").value;
    const date = document.getElementById("date").value;
    const edits = document.getElementById("edits").value;

    // Составляем объект filters
    const filters = {};

    if (city !== "Все") filters.municipality_name = [city];  // или другое поле, если "город" отдельно
    if (org !== "Все") filters.name = [org];
    if (leader !== "Все") filters.user_name = [leader];  // если нужно отличать, можно добавить name_leader
    if (date !== "Все") filters.creation_time = [date];
    if (edits !== "Все") filters.organization_id = [edits];

    fetch("/admin/get_reports/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            page: 0,
            filters: filters
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(filters)
        console.log(data.reports)
        const reports = data.reports;
        fillTable(reports);
    })
    .catch(error => {
        console.error("Ошибка при фильтрации:", error);
    });
}


document.getElementById("downloadExcel").addEventListener("click", () => {
    const city = document.getElementById("city").value;
    const org = document.getElementById("organization").value;
    const leader = document.getElementById("leader").value;
    const date = document.getElementById("date").value;
    const edits = document.getElementById("edits").value;

    // Составляем объект filters
    const filters = {};

    if (city !== "Все") filters.municipality_name = [city];  // или другое поле, если "город" отдельно
    if (org !== "Все") filters.name = [org];
    if (leader !== "Все") filters.user_name = [leader];  // если нужно отличать, можно добавить name_leader
    if (date !== "Все") filters.creation_time = [date];
    if (edits !== "Все") filters.organization_id = [edits];

    // Формируем query-параметры
    const query = new URLSearchParams({ filters: JSON.stringify(filters) }).toString();

    // Открываем ссылку на скачивание
    window.location.href = `/admin/export_reports/?${query}`;
});

