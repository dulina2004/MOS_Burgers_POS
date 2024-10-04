function init() {
    const orderTableBody = document.getElementById("orderTableBody");
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    orders.forEach((order, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${order.customerName}</td>
            <td>${order.contactNo}</td>
            <td>
                <ul>
                    ${order.items
                        .map(
                            (item) =>
                                `<li>${item.name} (x${item.quantity}) - Rs. ${(
                                    item.price * item.quantity
                                ).toFixed(2)}</li>`
                        )
                        .join("")}
                </ul>
            </td>
            <td>Rs. ${order.discount.toFixed(2)}</td>
            <td>Rs. ${order.totalPrice.toFixed(2)}</td>
        `;
        orderTableBody.appendChild(row);
    });
}
init();
