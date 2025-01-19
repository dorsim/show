async function fetchJSON(filePath) {
    const response = await fetch(filePath);
    const data = await response.json();
    return data;
}

function createTableHeader(headers) {
    const headerRow = document.getElementById('json-header-row');
    if (!headerRow) {
        console.error('Header row element not found');
        return;
    }
    headers.forEach((header, index) => {
        const th = document.createElement('th');
        th.textContent = header;
        th.addEventListener('click', () => sortTableByColumn(index));
        headerRow.appendChild(th);
    });
}

function displayJSONData(jsonArray) {
    const tableBody = document.getElementById('json-data-body');
    if (!tableBody) {
        console.error('Table body element not found');
        return;
    }
    jsonArray.forEach((item) => {
        if (item.Data) {
            const tr = document.createElement('tr');
            Object.values(item.Data).forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        } else {
            console.warn('Skipping item with null or undefined Data property', item);
        }
    });
}

function sortTableByColumn(columnIndex) {
    const table = document.getElementById('json-data-table');
    const rows = Array.from(table.rows).slice(1); // Exclude the header row
    const isAscending = table.rows[0].cells[columnIndex].classList.toggle('asc', !table.rows[0].cells[columnIndex].classList.contains('asc'));

    rows.sort((rowA, rowB) => {
        const cellA = rowA.cells[columnIndex].textContent.trim();
        const cellB = rowB.cells[columnIndex].textContent.trim();

        if (!isNaN(cellA) && !isNaN(cellB)) {
            return isAscending ? cellA - cellB : cellB - cellA;
        }

        return isAscending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
    });

    rows.forEach(row => table.appendChild(row));
}

document.addEventListener('DOMContentLoaded', async () => {
    const jsonFilePath = 'data.json'; // Adjust the path to your JSON file
    const jsonData = await fetchJSON(jsonFilePath);
    const jsonArray = jsonData.map(item => item.Data).filter(data => data);

    if (jsonArray.length > 0) {
        createTableHeader(Object.keys(jsonArray[0]));
        displayJSONData(jsonArray);
    }
});