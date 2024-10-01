document.addEventListener('DOMContentLoaded', () => {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    // Calculate customers with most orders
    const customerOrderCount = orders.reduce((acc, order) => {
        acc[order.customerName] = (acc[order.customerName] || 0) + 1;
        return acc;
    }, {});

    // Sort customers by order count in descending order
    const sortedCustomers = Object.entries(customerOrderCount).sort((a, b) => b[1] - a[1]);

    const customerTableBody = document.getElementById('customerTable').getElementsByTagName('tbody')[0];
    sortedCustomers.forEach(([customerName, count]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customerName}</td>
            <td>${count}</td>
        `;
        customerTableBody.appendChild(row);
    });

    // Calculate most popular items
    const itemCount = orders.reduce((acc, order) => {
        order.items.forEach(item => {
            if (!acc[item.name]) {
                acc[item.name] = 0;
            }
            acc[item.name] += item.quantity;
        });
        return acc;
    }, {});

    // Sort items by quantity in descending order
    const sortedItems = Object.entries(itemCount).sort((a, b) => b[1] - a[1]);

    const itemTableBody = document.getElementById('itemTable').getElementsByTagName('tbody')[0];
    sortedItems.forEach(([itemName, quantity]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${itemName}</td>
            <td>${quantity}</td>
        `;
        itemTableBody.appendChild(row);
    });
});
