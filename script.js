async function fetchCSV(filePath) {
    const response = await fetch(filePath);
    const data = await response.text();
    return data;
}

function csvToArray(csv, delimiter = ',') {
    const rows = csv.trim().split('\n');
    return rows.map(row => row.split(delimiter));
}

function createTableHeader(headers) {
    const headerRow = document.getElementById('csv-header-row');
    headers.forEach((header, index) => {
        const th = document.createElement('th');
        th.textContent = header;
        th.addEventListener('click', () => sortTableByColumn(index));
        headerRow.appendChild(th);
    });
}

function displayCSVData(csvArray) {
    const tableBody = document.getElementById('csv-data-body');
    csvArray.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

function sortTableByColumn(columnIndex) {
    const table = document.getElementById('csv-data-table');
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
    const csvFilePath = 'data.csv'; // Adjust the path to your CSV file
    const csvData = await fetchCSV(csvFilePath);
    const csvArray = csvToArray(csvData);

    if (csvArray.length > 0) {
        createTableHeader(csvArray[0]);
        displayCSVData(csvArray.slice(1));
    }
});