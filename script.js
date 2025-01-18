async function fetchCSV(filePath) {
    const response = await fetch(filePath);
    const data = await response.text();
    return data;
}

function csvToArray(csv, delimiter = ',') {
    const rows = csv.trim().split('\n');
    return rows.map(row => row.split(delimiter));
}

function displayCSVData(csvArray) {
    const listElement = document.getElementById('csv-data-list');
    csvArray.forEach(row => {
        const listItem = document.createElement('li');
        listItem.textContent = row.join(', ');
        listElement.appendChild(listItem);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const csvFilePath = 'data.csv'; // Adjust the path to your CSV file
    const csvData = await fetchCSV(csvFilePath);
    const csvArray = csvToArray(csvData);
    displayCSVData(csvArray);
});
