let items = [];
function init() {
    fetch("json/items.json")
        .then((response) => response.json())
        .then((data) => {
            data.forEach((item) => {
                items.push(item);
            });
        });
}

let cart = [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

function renderMenu(items) {
    const menuContent = document.getElementById("menu-content");
    menuContent.innerHTML = "";

    const row = document.createElement("div");
    row.classList.add("row");

    items.forEach((item, index) => {
        const col = document.createElement("div");
        col.classList.add("col-md-4", "mb-4");

        const card = document.createElement("div");
        card.classList.add("card", "h-100");

        card.innerHTML = `
            <img src="${item.imageUrl}" class="card-img-top" alt="${item.name}">
            <div class="card-body dark-brown">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">Price: Rs.${item.price}</p>
                <button class="btn btn-primary btn-add-item button" onclick="addToCart(${index})">Add Item</button>
            </div>
        `;

        col.appendChild(card);
        row.appendChild(col);
    });

    menuContent.appendChild(row); // Add row to the menu content
}

function filterCategory(category) {
    if (category === "All") {
        renderMenu(items);
    } else {
        renderMenu(items.filter((item) => item.itemtype === category));
    }
}

function addToCart(index) {
    const item = items[index];
    const cartItem = cart.find((cartItem) => cartItem.index === index);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";
    let totalPrice = 0;
    cart.forEach((cartItem, index) => {
        const cartItemElem = document.createElement("div");
        cartItemElem.classList.add("cart-item");
        cartItemElem.innerHTML = `
            <span>${cartItem.name} - Rs.${cartItem.price}</span>
            <input type="number" value="${
                cartItem.quantity
            }" min="1" onchange="updateQuantity(${index}, this.value)">
            <span>Rs.${(cartItem.price * cartItem.quantity).toFixed(2)}</span>
            <button class="btn btn-danger btn-remove" onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItems.appendChild(cartItemElem);
        totalPrice += cartItem.price * cartItem.quantity;
    });
    document.getElementById("totalPrice").textContent = totalPrice.toFixed(2);
}

function updateQuantity(index, quantity) {
    if (quantity < 1) quantity = 1;
    cart[index].quantity = Number(quantity);
    renderCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

function calculateTotal() {
    const discount = Number(document.getElementById("discount").value) || 0;
    let totalPrice = cart.reduce(
        (total, cartItem) => total + cartItem.price * cartItem.quantity,
        0
    );
    return totalPrice - discount;
}

function showTotal() {
    const total = calculateTotal();
    document.getElementById("totalPrice").textContent = `${total.toFixed(2)}`;
}

function placeOrder() {
    const customerName = document.getElementById("customerName").value;
    const contactNo = document.getElementById("contactNo").value;
    const discount = Number(document.getElementById("discount").value) || 0;
    const totalPrice = calculateTotal();

    if (!customerName || !contactNo) {
        alert("Please enter customer information");
        return;
    }

    const order = {
        customerName,
        contactNo,
        items: cart.map((cartItem) => ({
            name: cartItem.name,
            price: cartItem.price,
            quantity: cartItem.quantity,
        })),
        discount,
        totalPrice,
    };

    orders.push(order); // Add order to the orders array
    localStorage.setItem("orders", JSON.stringify(orders)); // Store orders in localStorage

    console.log("Order placed:", order);
    alert("Order placed successfully!");
    cart = [];
    document.getElementById("customerName").value = "";
    document.getElementById("contactNo").value = "";
    document.getElementById("discount").value = "";
    renderCart();
}

document.getElementById("calculateTotal").addEventListener("click", showTotal);
document.getElementById("placeOrder").addEventListener("click", placeOrder);

window.onload = function () {
    init();
    filterCategory("All");
};
