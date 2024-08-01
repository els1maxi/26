document.addEventListener("DOMContentLoaded", () => {
    const resTasks = [
        document.getElementById("res1"),
        document.getElementById("res2"),
        document.getElementById("res3"),
        document.getElementById("res4"),
        document.getElementById("res5"),
        document.getElementById("res6"),
        document.getElementById("res7"),
    ];

    // Task 1
    function findBookByAuthor(books, authorToFind) {
        const book = books.find(book => book.author === authorToFind);
        return book ? `Перша книга автора ${authorToFind}: ${book.title}` : `Книга автора ${authorToFind} не знайдена.`;
    }

    const books = [
        { title: 'Гаррі Поттер', author: 'Дж.К. Ролінг' },
        { title: '1984', author: 'Джордж Орвелл' },
        { title: 'Хоббіт', author: 'Дж.Р.Р. Толкієн' }
    ];

    resTasks[0].innerText = findBookByAuthor(books, 'Джордж Орвелл');

    // Task 2
    function filterEvenNumbers(numbers) {
        return numbers.filter(number => number % 2 === 0);
    }

    const numbs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    resTasks[1].innerText = filterEvenNumbers(numbs);

    // Task 3
    function increasePrices(prices, percentage) {
        return prices.map(price => price + price * percentage);
    }

    const prices = [100, 200, 300, 400, 500];
    resTasks[2].innerText = increasePrices(prices, 0.1);

    // Task 4
    function hasNumberGreaterThan(numbers, limit) {
        return numbers.some(number => number > limit);
    }

    const numbers = [45, 80, 32, 100, 105];
    resTasks[3].innerText = hasNumberGreaterThan(numbers, 100)
        ? "У масиві є хоча одне число більше 100."
        : "У масиві немає чисел більше 100.";

    // Task 5
    function areAllNumbersPositive(numbers) {
        return numbers.every(number => number > 0);
    }

    const nums = [1, 2, 3, 4, 5, -6, 7];
    resTasks[4].innerText = areAllNumbersPositive(nums)
        ? "Усі числа в масиві є додатні."
        : "Є хоча одне від'ємне число в масиві.";

    // Task 6
    function extractFirstWords(sentences) {
        return sentences.map(sentence => sentence.split(' ')[0]);
    }

    const sentences1 = ["Я люблю JavaScript", "Масиви це весело", "Програмування це круто"];
    resTasks[5].innerText = extractFirstWords(sentences1);

    // Task 7
    function countTotalWords(sentences) {
        return sentences.reduce((count, sentence) => count + sentence.split(' ').length, 0);
    }

    const sentences2 = ["JavaScript цікавий", "Масиви це корисно", "Вивчайте програмування щодня"];
    resTasks[6].innerText = 'Загальна кількість слів у масиві речень: ' + countTotalWords(sentences2);
});

document.addEventListener("DOMContentLoaded", () => {
    const drinkPicker = document.getElementById("pickedDrink");
    const addDrink = document.getElementById("addDrink");
    const dishPicker = document.getElementById("pickedDish");
    const addDish = document.getElementById("addDish");
    const tablePicker = document.getElementById("tableNumber");
    const submit = document.getElementById("submitOrder");

    /* menu */
    const menu = {
        dish: {
            "Cheesecake": 50,
            "Tiramisu": 60,
        },
        drink: {
            "Coffee": 30,
            "Latte": 40,
        },
    };

    const status = ["new", "cook", "done"];

    function renderOptions(select, items) {
        select.appendChild(new Option("Pick", ""));
        Object.entries(items).forEach(([key, value]) => {
            select.appendChild(new Option(`${key} - ${value} $`, `${key} - ${value} $`));
        });
    }

    function renderStatusOptions(select, statuses) {
        statuses.forEach(status => {
            select.appendChild(new Option(status, status));
        });
    }

    renderOptions(dishPicker, menu.dish);
    renderOptions(drinkPicker, menu.drink);

    const orderPreview = document.getElementById("orderPreview");
    const totalDisplay = document.getElementById("orderPreviewTotal");

    function updateOrderPreview(trigger, value) {
        if (!trigger || !value || value === "Pick") return;

        trigger.addEventListener("click", () => {
            const [name, price] = value.split(' -');
            const newItem = document.createElement("div");
            newItem.classList.add("flex", "items-center", "gap-2", "orderItem");
            newItem.innerHTML = `<span>${name}</span><span>|</span><span>${price}</span>`;
            orderPreview.appendChild(newItem);

            const total = Array.from(orderPreview.querySelectorAll('.flex.items-center span:nth-child(3)'))
                .reduce((sum, item) => sum + parseFloat(item.textContent.replace('$', '')), 0);

            totalDisplay.textContent = `Total: ${total.toFixed(2)}$`;
        });
    }

    drinkPicker.addEventListener("change", () => updateOrderPreview(addDrink, drinkPicker.value));
    dishPicker.addEventListener("change", () => updateOrderPreview(addDish, dishPicker.value));

    let tableNumber;

    tablePicker.addEventListener("input", () => {
        tableNumber = tablePicker.value;
    });

    function createOrder() {
        if (!tableNumber || isNaN(tableNumber) || tableNumber <= 0) {
            alert("Table number is invalid.");
            return;
        }

        const orderItems = Array.from(orderPreview.getElementsByClassName("orderItem"));

        if (orderItems.length === 0) {
            alert("No items in the order.");
            return;
        }

        let orders = JSON.parse(localStorage.getItem("orders")) || [];
        let orderNumber = localStorage.getItem("lastOrderNumber") || 0;

        orderNumber++;

        const order = {
            number: orderNumber,
            table: tableNumber,
            dishes: orderItems.map(item => {
                const [name, price] = item.textContent.split('|').map(value => value.trim());
                return { name, price: parseFloat(price.replace('$', '')) };
            }),
            status: "new",
        };

        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));
        localStorage.setItem("lastOrderNumber", orderNumber);

        orderPreview.innerHTML = "";
        totalDisplay.textContent = "";
        tableNumber = null;
        tablePicker.value = "";
    }

    function getOrders() {
        return JSON.parse(localStorage.getItem("orders")) || [];
    }

    function renderOrdersToUsersTable(orders) {
        const usersTable = document.getElementById("usersTable");

        if (orders.length === 0) {
            usersTable.innerHTML = "No orders";
        } else {
            usersTable.innerHTML = "";
            orders.forEach(order => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <th>${order.number}</th>
                    <th>${order.table}</th>
                    <td>
                        <div class="badge badge-info gap-2">
                            ${order.status}
                        </div>
                    </td>
                `;
                usersTable.appendChild(row);
            });
        }
    }

    function renderOrdersToAdminTable(orders) {
        const adminTable = document.getElementById("adminTable");

        if (orders.length === 0) {
            adminTable.innerHTML = "No orders";
        } else {
            adminTable.innerHTML = "";
            orders.forEach(order => {
                const row = document.createElement("tr");
                const dishes = order.dishes.map(dish => dish.name).join(" | ");
                const totalPrice = order.dishes.reduce((sum, dish) => sum + dish.price, 0);

                row.innerHTML = `
                    <th>${order.number}</th>
                    <th>${order.table}</th>
                    <th>${dishes}</th>
                    <th>${totalPrice}$</th>
                    <th>
                        <select class="select select-info status" data-order-id="${order.number}"></select>
                    </th>
                    <th>del</th>
                `;
                adminTable.appendChild(row);

                const statusSelect = row.querySelector(".status");
                renderStatusOptions(statusSelect, status);
                statusSelect.value = order.status;

                statusSelect.addEventListener("change", () => {
                    const selectedStatus = statusSelect.value;
                    const orderId = parseInt(statusSelect.dataset.orderId, 10);

                    const updatedOrders = orders.map(order => {
                        if (order.number === orderId) {
                            return { ...order, status: selectedStatus };
                        } else {
                            return order;
                        }
                    });

                    localStorage.setItem("orders", JSON.stringify(updatedOrders));
                    renderOrdersToTable();
                });
            });
        }
    }

    function renderOrdersToTable() {
        const orders = getOrders();
        renderOrdersToUsersTable(orders);
        renderOrdersToAdminTable(orders);
    }

    submit.addEventListener("click", () => {
        createOrder();
        renderOrdersToTable();
    });

    const ordersData = localStorage.getItem("orders");
    if (ordersData) {
        renderOrdersToTable();
    }
});
