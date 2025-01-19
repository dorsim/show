async function fetchJSON(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch JSON file:', error);
    }
}

function createTableHeader(headers) {
    const headerRow = document.getElementById('json-header-row');
    const filterRow = document.getElementById('filter-row');
    if (!headerRow || !filterRow) {
        console.error('Header row or filter row element not found');
        return;
    }
    headers.forEach((header, index) => {
        const th = document.createElement('th');
        th.textContent = header;
        th.addEventListener('click', () => sortTableByColumn(index));
        headerRow.appendChild(th);

        const filterInput = document.createElement('input');
        filterInput.setAttribute('type', 'text');
        filterInput.setAttribute('class', 'filter-input');
        filterInput.setAttribute('data-column', index);
        filterInput.addEventListener('keyup', filterTable);
        const filterTh = document.createElement('th');
        filterTh.appendChild(filterInput);
        filterRow.appendChild(filterTh);
    });
}

function displayJSONData(jsonArray) {
    const tableBody = document.getElementById('json-data-body');
    if (!tableBody) {
        console.error('Table body element not found');
        return;
    }
    jsonArray.forEach((item) => {
        if (item && item) {
            const tr = document.createElement('tr');
            Object.values(item).forEach(cell => {
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
    const rows = Array.from(table.rows).slice(2); // Exclude the header and filter rows
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

function filterTable() {
    const table = document.getElementById('json-data-table');
    const filterInputs = document.getElementsByClassName('filter-input');
    const rows = table.getElementsByTagName('tr');

    Array.from(rows).forEach((row, rowIndex) => {
        if (rowIndex < 2) return; // Skip the header and filter rows

        let rowVisible = true;
        Array.from(filterInputs).forEach(input => {
            const columnIndex = input.getAttribute('data-column');
            const filterValue = input.value.toLowerCase();
            const cell = row.cells[columnIndex];
            if (cell) {
                const cellText = cell.textContent || cell.innerText;
                if (cellText.toLowerCase().indexOf(filterValue) === -1) {
                    rowVisible = false;
                }
            }
        });

        row.style.display = rowVisible ? '' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const jsonFilePath = 'data.json'; // Adjust the path to your JSON file
    try {
        const jsonData = await fetchJSON(jsonFilePath);
        if (!jsonData) {
            console.error('No data found in JSON file');
            return;
        }
        //console.log('Fetched JSON data:', jsonData);
        const jsonArray = jsonData.map(item => item.Data).filter(data => data);

        if (jsonArray.length > 0) {
            createTableHeader(Object.keys(jsonArray[0]));
            displayJSONData(jsonArray);
        } else {
            console.error('No valid Data properties found in JSON items');
        }
    } catch (error) {
        console.error('Failed to fetch or process JSON data:', error);
    }
});