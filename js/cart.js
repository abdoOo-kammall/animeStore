document.addEventListener("DOMContentLoaded", function () {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartCounter = document.querySelector(".cart-value");
  if (cartCounter) {
    cartCounter.textContent = cart.length;
  }
  const cartTableBody = document.querySelector(".cart-table tbody");
  const totalPriceElement = document.querySelector(".total-price");
  const summaryTableBody = document.querySelector(".summary-table tbody");
  const summaryTotalPrice = document.querySelector(
    ".summary-table .total-price"
  );

  function renderCartItems() {
    cartTableBody.innerHTML = "";
    let totalPrice = 0;

    cart.forEach((item, index) => {
      const row = document.createElement("tr");
      row.classList.add("cart-item");

      row.innerHTML = `
        <td data-label="Product">
          <div class="cart-product-info">
            <div class="cart-product-image">
              <img src="${item.image_url}" alt="${item.product_name}" />
            </div>
            <div class="cart-product-details">
              <h3>${item.product_name}</h3>
            </div>
          </div>
        </td>
        <td data-label="Price" class="priceClass">${item.price}</td>
        <td data-label="Quantity">
          <div class="quantity-control">
            <div class="quantity-btn" value="-">−</div>
            <input type="text" class="quantity-input" value="1" />
            <div class="quantity-btn" value="+">+</div>
          </div>
        </td>
        <td data-label="Subtotal" class="priceClass">${item.price} EGP</td>
        <td>
          <button class="delete-btn" data-index="${index}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="lucide lucide-trash2-icon lucide-trash-2">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" x2="10" y1="11" y2="17" />
              <line x1="14" x2="14" y1="11" y2="17" />
            </svg>
          </button>
        </td>
      `;

      cartTableBody.appendChild(row);
      totalPrice += parseFloat(item.price);
    });

    updateTotalPrice();
    setupQuantityHandlers();
    setupDeleteHandlers();
  }

  function updateTotalPrice() {
    const rows = document.querySelectorAll(".cart-item");
    let total = 0;
    summaryTableBody.innerHTML = "";

    rows.forEach((row) => {
      const productName = row.querySelector(
        ".cart-product-details h3"
      ).textContent;
      const quantity = parseInt(row.querySelector(".quantity-input").value);
      const price = parseFloat(
        row.querySelector("td[data-label='Price']").textContent
      );
      const subtotal = quantity * price;

      total += subtotal;

      const summaryRow = document.createElement("tr");
      summaryRow.classList.add("summary-item");
      summaryRow.innerHTML = `
        <td><div class="order-product-name">${productName}</div></td>
        <td>${subtotal.toFixed(2)} EGP</td>
      `;
      summaryTableBody.appendChild(summaryRow);

      row.querySelector(
        "td[data-label='Subtotal']"
      ).textContent = `${subtotal.toFixed(2)} EGP`;
    });

    totalPriceElement.innerText = `${total.toFixed(2)} EGP`;
    summaryTotalPrice.innerText = `${total.toFixed(2)} EGP`;
  }

  function setupQuantityHandlers() {
    const quantityButtons = document.querySelectorAll(".quantity-btn");
    quantityButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const isIncrement = btn.getAttribute("value") === "+";
        const input = btn.parentElement.querySelector(".quantity-input");
        let quantity = parseInt(input.value);

        if (isIncrement) {
          quantity++;
        } else if (quantity > 1) {
          quantity--;
        }

        input.value = quantity;
        updateTotalPrice();
      });
    });
  }

  function setupDeleteHandlers() {
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const index = parseInt(button.getAttribute("data-index"));
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCartItems();
        cartCounter.textContent = cart.length;
      });
    });
  }

  renderCartItems();

  let submitOrder = document.querySelector(".checkout-btn");
  let messageDiv = document.getElementById("success-message");

  submitOrder.addEventListener("click", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return alert("You must be logged in to place an order.");

    const rows = document.querySelectorAll(".cart-item");
    const orderProducts = [];

    rows.forEach((row) => {
      const productName = row.querySelector(
        ".cart-product-details h3"
      ).textContent;
      const quantity = parseInt(row.querySelector(".quantity-input").value);
      const matchedProduct = cart.find((p) => p.product_name === productName);
      console.log("Matched product:", matchedProduct);

      if (matchedProduct) {
        orderProducts.push({
          productId:
            matchedProduct.product_id || matchedProduct.id || productName,
          quantity,
        });
      }
    });

    const newOrder = {
      userId: currentUser.id,
      products: orderProducts,
      status: "Pending",
      date: new Date().toISOString(),
    };

    fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newOrder),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to submit order");
        return res.json();
      })
      .then((data) => {
        messageDiv.classList.remove("hidden");
        setTimeout(() => {
          messageDiv.classList.add("hidden");
        }, 4000);
        localStorage.removeItem("cart");
        cart = [];
        renderCartItems();
      })
      .catch((err) => {
        console.error(err);
        alert("There was an error placing the order.");
      });
  });
});
