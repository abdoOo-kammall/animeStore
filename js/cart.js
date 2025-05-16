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
        if (cartCounter) {
          cartCounter.textContent = cart.length;
        }
      });
    });
  }

  // Initial render
  renderCartItems();

  let submitOrder = document.querySelector(".checkout-btn");
  let messageDiv = document.getElementById("success-message");

  submitOrder.addEventListener("click", () => {
    // Show success message
    messageDiv.classList.remove("hidden");
    setTimeout(() => {
      messageDiv.classList.add("hidden");
    }, 4000);

    // Get userId from currentUser
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || !currentUser.id) {
      alert("You must be logged in to place an order.");
      return;
    }

    // Create products array from cart
    const rows = document.querySelectorAll(".cart-item");
    const products = Array.from(rows).map((row) => {
      const productName = row.querySelector(
        ".cart-product-details h3"
      ).textContent;
      const quantity = parseInt(row.querySelector(".quantity-input").value);
      const product = cart.find((item) => item.product_name === productName);

      return {
        productId:
          product.id ||
          product.productId ||
          Math.random().toString(16).slice(2, 6),
        quantity: quantity,
      };
    });

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const newOrder = {
      userId: currentUser.id,
      products: products,
      status: "Pending",
      date: new Date().toISOString(),
      id: (orders.length + 1).toString(),
    };

    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Clear the cart
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartItems();
    if (cartCounter) {
      cartCounter.textContent = "0";
    }
  });

  // Optional: Update header based on login status
  // function updateHeader() {
  //   const loginLink = document.querySelector('.main-nav-list a[href="login.html"]');
  //   const signupLink = document.querySelector('.main-nav-list a[href="signup.html"]');
  //   const userIcon = document.querySelector("#user-icon");
  //   const logOut = document.querySelector(".log-out");
  //   const cartIcon = document.querySelector(".cart-info");

  //   if (localStorage.getItem("currentUser")) {
  //     loginLink.style.display = "none";
  //     signupLink.style.display = "none";
  //     userIcon.style.display = "inline-block";
  //     logOut.style.display = "inline-block";
  //     cartIcon.style.display = "inline-block";
  //   } else {
  //     loginLink.style.display = "inline-block";
  //     signupLink.style.display = "inline-block";
  //     userIcon.style.display = "none";
  //     cartIcon.style.display = "none";
  //     logOut.style.display = "none";
  //   }
  // }

  // updateHeader();
});
