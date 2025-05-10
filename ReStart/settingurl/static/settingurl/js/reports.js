document.addEventListener("DOMContentLoaded", () => {
    fetchReports();

    // Навешиваем onchange на каждый фильтр
    ["city", "organization", "leader", "date", "edits"].forEach(id => {
        document.getElementById(id).addEventListener("change", applyFilters);
    });
});

function fetchReports(filters = {}) {
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
    .then(res => res.json())
    .then(data => {
        const reports = data.reports;
        renderTable(reports);
        if (!Object.keys(filters).length) {
            fillFilters(reports);
        }
    })
    .catch(err => {
        console.error("Ошибка загрузки отчётов:", err);
    });
}

function renderTable(reports) {
    const tbody = document.getElementById("reportsTableBody");
    tbody.innerHTML = "";

    if (reports.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">Нет данных</td></tr>`;
        return;
    }

    reports.forEach(report => {
        const org = report.organization;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${report.municipality_name || "–"}</td>
            <td>${org.name || "–"}</td>
            <td>${report.user_name || "–"}</td>
            <td>${(org.creation_time || "–").split(" ")[0]}</td>
            <td>${(org.creation_time || "–").split(" ")[0]}</td>
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
        cities.add(report.municipality_name);
        orgs.add(org.name);
        leaders.add(report.user_name);
        dates.add(creation_time);
        edits.add(creation_time);
    });

    populateSelect("city", cities);
    populateSelect("organization", orgs);
    populateSelect("leader", leaders);
    populateSelect("date", dates);
    populateSelect("edits", edits);
}

function populateSelect(id, set) {
    const select = document.getElementById(id);
    select.innerHTML = '<option>Все</option>';
    Array.from(set).sort().forEach(value => {
        if (value && value !== "undefined") {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        }
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

    fetchReports(filters);
}
