const addItemBtn = document.getElementById('addItemBtn');
const addItemModal = document.getElementById('addItemModal');
const closeModalBtn = document.getElementById('closeModal');
const addItemForm = document.getElementById('addItemForm');
const inventoryTable = document.getElementById('inventoryTable');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const overlay = document.getElementById('overlay');
const saveCsvBtn = document.getElementById('saveCsvBtn'); // Get the Save to CSV button

let inventory = []; // Array to store inventory items

// Load inventory from local storage (if available)
if (localStorage.getItem('inventory')) {
    inventory = JSON.parse(localStorage.getItem('inventory'));
    renderInventory();
}

// Function to add a new item to the inventory
function addItem(name, category, quantity, price) {
    const newItem = {
        name: name,
        category: category,
        quantity: quantity,
        price: price
    };
    inventory.push(newItem);
    localStorage.setItem('inventory', JSON.stringify(inventory)); // Save to local storage
    renderInventory();
}

// Function to render the inventory in the table
function renderInventory() {
    const inventoryTableBody = inventoryTable.querySelector('tbody');
    inventoryTableBody.innerHTML = ''; // Clear existing rows

    const filteredInventory = filterInventory(inventory); // Apply filtering

    filteredInventory.forEach(item => {
        const row = inventoryTableBody.insertRow();
        const nameCell = row.insertCell();
        const categoryCell = row.insertCell();
        const quantityCell = row.insertCell();
        const priceCell = row.insertCell();
        const actionsCell = row.insertCell();

        nameCell.textContent = item.name;
        categoryCell.textContent = item.category;
        quantityCell.textContent = item.quantity;
        priceCell.textContent = item.price.toFixed(2); // Format price

        // Add actions buttons (edit, delete)
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => {
            editItem(item);
        });
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            deleteItem(item);
        });
        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);
    });
}

// Function to filter inventory based on search and category
function filterInventory(inventory) {
    const searchValue = searchInput.value.toLowerCase();
    const categoryValue = categoryFilter.value;

    return inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchValue);
        const matchesCategory = categoryValue ? item.category === categoryValue : true;
        return matchesSearch && matchesCategory;
    });
}

// Function to edit an item
function editItem(item) {
    // Populate the form with the item's details
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemCategory').value = item.category;
    document.getElementById('itemQuantity').value = item.quantity;
    document.getElementById('itemPrice').value = item.price;

    // Show modal
    addItemModal.style.display = 'block';
    overlay.style.display = 'block';

    // Update button event listener
    addItemForm.onsubmit = function (event) {
        event.preventDefault();
        updateItem(item);
    };
}

// Function to update an existing item
function updateItem(item) {
    const name = document.getElementById('itemName').value;
    const category = document.getElementById('itemCategory').value;
    const quantity = parseInt(document.getElementById('itemQuantity').value);
    const price = parseFloat(document.getElementById('itemPrice').value);

    // Update the item details
    item.name = name;
    item.category = category;
    item.quantity = quantity;
    item.price = price;

    localStorage.setItem('inventory', JSON.stringify(inventory)); // Save to local storage
    renderInventory(); // Refresh the inventory display
    closeModal();
}

// Function to delete an item
function deleteItem(item) {
    inventory = inventory.filter(invItem => invItem !== item);
    localStorage.setItem('inventory', JSON.stringify(inventory)); // Save to local storage
    renderInventory(); // Refresh the inventory display
}

// Function to close the modal
function closeModal() {
    addItemModal.style.display = 'none';
    overlay.style.display = 'none';
    addItemForm.reset(); // Reset the form fields
}

// Function to convert inventory data to CSV and download it
function downloadCSV() {
    const csvRows = [];
    const headers = ['Name', 'Category', 'Quantity', 'Price'];
    csvRows.push(headers.join(',')); // Add headers to CSV

    // Add inventory items to CSV
    inventory.forEach(item => {
        const row = [item.name, item.category, item.quantity, item.price.toFixed(2)];
        csvRows.push(row.join(','));
    });

    // Create a CSV string
    const csvString = csvRows.join('\n');

    // Create a Blob from the CSV string
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    // Create a link element to download the CSV
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'inventory.csv'); // Set default file name

    // Programmatically click the link to trigger the download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Add event listener for the Save to CSV button
saveCsvBtn.addEventListener('click', downloadCSV);

// Add item button click event
addItemBtn.addEventListener('click', () => {
    addItemModal.style.display = 'block';
    overlay.style.display = 'block';

    // Reset the form
    addItemForm.reset();

    // Add new item event listener
    addItemForm.onsubmit = function (event) {
        event.preventDefault();
        const name = document.getElementById('itemName').value;
        const category = document.getElementById('itemCategory').value;
        const quantity = parseInt(document.getElementById('itemQuantity').value);
        const price = parseFloat(document.getElementById('itemPrice').value);
        addItem(name, category, quantity, price);
        closeModal(); // Close modal after adding
    };
});

// Close modal button click event
closeModalBtn.addEventListener('click', closeModal);

// Search input event
searchInput.addEventListener('input', renderInventory);

// Category filter change event
categoryFilter.addEventListener('change', renderInventory);

// Overlay click event to close modal
overlay.addEventListener('click', closeModal);

// Autosave function that runs every 5 minutes (300000 milliseconds)
setInterval(downloadCSV, 300000); // Adjust the interval as needed
