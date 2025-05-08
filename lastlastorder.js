window.addEventListener("load", () => {

  // جلب بيانات المستخدم من localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (currentUser) {
    console.log("User ID:", currentUser.id);
    console.log("Email:", currentUser.email);
    console.log("Role:", currentUser.role);
  } else {
    console.log("No user found in localStorage");
  }        //////////////////////////////////////////////////////
  
  
  document.querySelector(".sidebar h2").textContent = 
  currentUser.role === "admin" ? "Admin-Dashboard" : 
  currentUser.role === "seller" ? "Seller-Dashboard" : "Dashboard";
  
  if (currentUser.role === "admin") {
    document.getElementById("products-btn")?.style.setProperty("display", "block");
    document.getElementById("orders-btn")?.style.setProperty("display", "block");
    document.getElementById("users-btn")?.style.setProperty("display", "block");
    document.getElementById("stats-btn")?.style.setProperty("display", "block");

    setTimeout(() => {
      document.getElementById("stats-btn")?.click();
    }, 0);
  
  
  } else if (currentUser.role === "seller") {
    document.getElementById("products-btn")?.style.setProperty("display", "block");
    document.getElementById("orders-btn")?.style.setProperty("display", "none");
    document.getElementById("users-btn")?.style.setProperty("display", "none");
    document.getElementById("stats-btn")?.style.setProperty("display", "block");

    setTimeout(() => {
      document.getElementById("stats-btn")?.click();
    }, 0);
    
  } else {
    document.getElementById("products-btn")?.style.setProperty("display", "none");
    document.getElementById("orders-btn")?.style.setProperty("display", "none");
    document.getElementById("users-btn")?.style.setProperty("display", "none");
    document.getElementById("stats-btn")?.style.setProperty("display", "none");
  }

const contentArea = document.getElementById("content-area");
let allUsers = []; 
const usersPerPage = 5; 
let currentUserPage = 1;
let currentProductPage = 1;

document.getElementById("users-btn").addEventListener("click", loadUsers);

function loadUsers() {
  fetch("http://localhost:3000/users")
    .then((res) => res.json())
    .then((users) => {
      allUsers = users;  
      renderUsers(users);    
      setupUserPagination(users); 


    })
    .catch((err) => {
      console.error("Error fetching users:", err);
      contentArea.innerHTML = "<p>Failed to load users.</p>";
    });
}

function renderUsers(users) {
  const previousSearchTermUser = document.getElementById("search-box-user")?.value || "";
  const startIndex = (currentUserPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const usersToDisplay = users.slice(startIndex, endIndex);

  contentArea.innerHTML = `
    <h2>User Management</h2>
  <input type="text" id="search-box-user" placeholder="Search by name or email" />
    <button id="add-user-btn">➕ Add New User</button>
    <table class="users-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Options</th>
        </tr>
      </thead>
      <tbody>
        ${usersToDisplay.map(user => `
          <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role || "Not defined"}</td>
            <td>

            ${currentUser?.role === "admin" ? `
            <button class="edit-btn-user" data-id-user="${user.id}">Edit</button>
            <button class="delete-btn-user" data-id-user="${user.id}">Delete</button>
            ` : "No Access"}

            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;

  // Add pagination buttons
  document.getElementById("content-area").innerHTML += `
    <div class="pagination">
      <button id="prev-page" ${currentUserPage === 1 ? "disabled" : ""}>Previous</button>
      <span>Page ${currentUserPage}</span>
      <button id="next-page" ${currentUserPage * usersPerPage >= users.length ? "disabled" : ""}>Next</button>
    </div>
  `;

  document.getElementById("prev-page").addEventListener("click", () => {
    if (currentUserPage > 1) {
      currentUserPage--;
      renderUsers(users);
      setupUserPagination(users);
    }
  });

  document.getElementById("next-page").addEventListener("click", () => {
    if (currentUserPage * usersPerPage < users.length) {
      currentUserPage++;
      renderUsers(users);
      setupUserPagination(users);
    }
  });

  document.getElementById("add-user-btn").addEventListener("click", () => {
    contentArea.innerHTML = `
      <h2>Add New User</h2>
      <form id="add-user-form">
        <label>Name:</label><br />
        <input type="text" id="add-name" required /><span id="nameError" class="error-msg"></span><br /><br />
        <label>Email:</label><br />
        <input type="email" id="add-email" required /><span id="emailError" class="error-msg"></span><br /><br />
        <label>Password:</label><br />
        <input type="password" id="add-password" required /><span id="passwordError" class="error-msg"></span><br /><br />
        <label>Role:</label><br />
        <select id="add-role">
          <option value="admin">admin</option>
          <option value="customer">customer</option>
          <option value="seller">seller</option>
        </select><br /><br />
        <button type="submit">Add</button>
        <button type="button" id="cancel-add-user">Cancel</button>
      </form>
    `;
  
    if (currentUser?.role === "admin") {
      const nameInput = document.getElementById("add-name");
      const emailInput = document.getElementById("add-email");
      const passwordInput = document.getElementById("add-password");
  
      const nameError = document.getElementById("nameError");
      const emailError = document.getElementById("emailError");
      const passwordError = document.getElementById("passwordError");
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
  
      function validateName() {
        const value = nameInput.value.trim();
        if (value.length < 3) {
          nameError.textContent = "Name must be at least 3 characters.";
          return false;
        }
        nameError.textContent = "";
        return true;
      }
  
      function validateEmail() {
        const value = emailInput.value.trim();
        if (!emailRegex.test(value)) {
          emailError.textContent = "Invalid email address.";
          return false;
        }
        emailError.textContent = "";
        return true;
      }
  
      function validatePassword() {
        const value = passwordInput.value.trim();
        if (!passwordRegex.test(value)) {
          passwordError.textContent = "Password must include uppercase, lowercase, number, special char, and be at least 8 characters.";
          return false;
        }
        passwordError.textContent = "";
        return true;
      }
  
      // Real-time validation
      nameInput.addEventListener("input", validateName);
      emailInput.addEventListener("input", validateEmail);
      passwordInput.addEventListener("input", validatePassword);
  
      document.getElementById("add-user-form").addEventListener("submit", function (e) {
        e.preventDefault();
  
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
  
        if (!isNameValid || !isEmailValid || !isPasswordValid) return;
  
        fetch("http://localhost:3000/users")
          .then(res => res.json())
          .then(usersList => {
            const exists = usersList.find(
              u => u.email === emailInput.value.trim() || u.name === nameInput.value.trim()
            );
  
            if (exists) {
              alert("Email or Name already exists.");
              return;
            }
  
            const newUser = {
              name: nameInput.value.trim(),
              email: emailInput.value.trim(),
              password: passwordInput.value.trim(),
              role: document.getElementById("add-role").value,
            };
  
            return fetch("http://localhost:3000/users", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newUser),
            });
          })
          .then(() => loadUsers())
          .catch(err => console.error("Error adding user:", err));
      });
    }
  
    document.getElementById("cancel-add-user").addEventListener("click", loadUsers);
  });





        
        document.getElementById("search-box-user").value = previousSearchTermUser;
        document.getElementById("search-box-user").focus();
        document.getElementById("search-box-user").addEventListener("input", function () {
        const searchTerm = this.value.toLowerCase();
        const filteredUsers = allUsers.filter(user =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
        );
  
        currentUserPage = 1;
        renderUsers(filteredUsers);
      });
}

function setupUserPagination(users) {
  const totalPages = Math.ceil(users.length / usersPerPage);
  const prevButton = document.getElementById("prev-page");
  const nextButton = document.getElementById("next-page");

  prevButton.disabled = currentUserPage === 1;
  nextButton.disabled = currentUserPage === totalPages;
}


function editUser(id) {
    fetch(`http://localhost:3000/users/${id}`)
    .then(res => {
        console.log(res); 
        return res.json(); 
      })
      .then(user => {
        contentArea.innerHTML = `
          <h2>Edit User</h2>
          <form id="edit-user-form">
            <label>Name:</label><br />
            <input type="text" id="edit-name" value="${user.name}" readonly /><br /><br />
            <label>Email:</label><br />
            <input type="email" id="edit-email" value="${user.email}" readonly /><br /><br />
            <label>Role:</label><br />
            <select id="edit-role">
              <option value="admin" ${user.role === "admin" ? "selected" : ""}>admin</option>
              <option value="customer" ${user.role === "customer" ? "selected" : ""}>customer</option>
              <option value="seller" ${user.role === "seller" ? "selected" : ""}>seller</option>
            </select><br /><br />
            <button type="submit">Save</button>
            <button type="button" id="cancel-edit">Cancel</button>
          </form>
        `;
  
        document.getElementById("edit-user-form").addEventListener("submit", function (e) {
          e.preventDefault();
          const updatedUser = {
            role: document.getElementById("edit-role").value,
          };
  
          fetch(`http://localhost:3000/users/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedUser),
          })
            .then(() => loadUsers())
            .catch(err => console.error("Error editing user:", err));
        });
  
        document.getElementById("cancel-edit").addEventListener("click", loadUsers);
      });
  }
  
  function deleteUser(id) {
    fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
    })
      .then(() => loadUsers())
      .catch(err => console.error("Error deleting user:", err));
  }
  // Users Event Listener
  contentArea.addEventListener("click", function (e) {

    const currentUser2 = JSON.parse(localStorage.getItem('currentUser'));



    ////////
    if (e.target.classList.contains("edit-btn-user") && currentUser2?.role === "admin") {
      const id = e.target.getAttribute("data-id-user");
      editUser(id);
    }
  
    if (e.target.classList.contains("delete-btn-user")&& currentUser2?.role === "admin") {
      const id = e.target.getAttribute("data-id-user");
      deleteUser(id);
    }
  });


 
////////////////////////////////////////////////////
//product management
////////////////////////////////////////////////////


let allProducts = [];
const productsPerPage = 5;

document.getElementById("products-btn").addEventListener("click", loadProducts);

function loadProducts() {
  fetch("http://localhost:3000/products")
    .then((res) => res.json())
    .then((products) => {


    if (currentUser.role === "admin") {
      allProducts = products;
    } else if (currentUser.role === "seller") {
      allProducts = products.filter(p => p.sellerId === currentUser.id);
    } else {
      allProducts = products.filter(p => p.status === "Approved");

    }
      renderProducts(allProducts);
      setupProductPagination(allProducts);
})
    .catch((err) => {
      console.error("Error fetching products:", err);
      contentArea.innerHTML = "<p>Failed to load products.</p>";
    });
}

function renderProducts(products) {
  const previousSearchTermProduct = document.getElementById("search-box-product")?.value || "";
  const startIndex = (currentProductPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const productsToDisplay = products.slice(startIndex, endIndex);

  contentArea.innerHTML = `
    <h2>Product Management</h2>
  <input type="text" id="search-box-product" placeholder="Search by name or category" />
  
  ${(currentUser.role === "admin" || currentUser.role === "seller") ? `
    
    <button id="add-product-btn">➕ Add New Product</button>
  ` : ""}

      <table class="products-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${productsToDisplay.map(product => `
          <tr>
            <td>${product.id}</td>
            <td>${product.product_name}</td>
            <td>${product.category}</td>
            <td>${product.price}</td>
            <td>${product.status || "Pending"}</td>
            <td>
                ${currentUser.role === "admin" ? `
                <button class="approve-btn-product" data-id-product="${product.id}">Approve</button>
                <button class="reject-btn-product" data-id-product="${product.id}">Reject</button>
                ` : ""}
                ${(product.sellerId === currentUser.id) ? `
                <button class="edit-btn-product" data-id-product="${product.id}">Edit</button>
                <button class="delete-btn-product" data-id-product="${product.id}">Delete</button>
                ` : ""}  
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;

  // Pagination buttons
  document.getElementById("content-area").innerHTML += `
    <div class="pagination">
      <button id="prev-page" ${currentProductPage === 1 ? "disabled" : ""}>Previous</button>
      <span>Page ${currentProductPage}</span>
      <button id="next-page" ${currentProductPage * productsPerPage >= products.length ? "disabled" : ""}>Next</button>
    </div>
  `;

  // Pagination controls
  document.getElementById("prev-page").addEventListener("click", () => {
    if (currentProductPage > 1) {
      currentProductPage--;
      renderProducts(products);
      setupProductPagination(products);
    }
  });

  document.getElementById("next-page").addEventListener("click", () => {
    if (currentProductPage * productsPerPage < products.length) {
      currentProductPage++;
      renderProducts(products);
      setupProductPagination(products);
    }
  });

  if (currentUser?.role !== "seller") {
    document.getElementById("add-product-btn").style.display = "none";
  }
  // Add new product
  document.getElementById("add-product-btn").addEventListener("click", () => {
    contentArea.innerHTML = `
      <h2>Add New Product</h2>
      <form id="add-product-form" enctype="multipart/form-data">
        <label>Name:</label><br />
        <input type="text" id="add-name" required /><br /><br />
        <label>Category:</label><br />
        <input type="text" id="add-category" required /><br /><br />
       <label>Price:</label><br />
        <input type="number" id="add-price" required /><br /><br />

        <label>Image File Name (e.g., gojo.webp):</label><br />
        <input type="file" id="add-image" accept="image/*" required />
        
        <label>Description:</label><br />
        <textarea id="add-description" required></textarea><br /><br />

        <label>Anime:</label><br />
        <input type="text" id="add-anime" required /><br /><br />

        <label>Rating (0–5):</label><br />
        <input type="number" id="add-rating" min="0" max="5" step="0.1" required /><br /><br />

        <button type="submit">Add Product</button>
        <button type="button" id="cancel-add-product">Cancel</button>
      </form>
    `;

    document.getElementById("add-product-form").addEventListener("submit", function (e) {

  
      e.preventDefault();

      fetch("http://localhost:3000/products")
        .then(res => res.json())
        .then(productsList => {

const imageInput = document.getElementById("add-image");
const imageName = imageInput.files[0].name; // ex: "image1.png"
          const newProduct = {
            product_name: document.getElementById("add-name").value,
            category: document.getElementById("add-category").value,
            price: document.getElementById("add-price").value + " EGP",
            image_url: `product-images/${imageName}`,
            description: document.getElementById("add-description").value,
            anime: document.getElementById("add-anime").value,
            rating: parseFloat(document.getElementById("add-rating").value),
            status: "Pending",
            sellerId: currentUser.id
          };

          return fetch("http://localhost:3000/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProduct),
          });
        })
        .then(() => loadProducts())
        .catch(err => console.error("Error adding product:", err));
    });
    

    document.getElementById("cancel-add-product").addEventListener("click", loadProducts);
  });

  document.getElementById("search-box-product").value = previousSearchTermProduct;
  document.getElementById("search-box-product").focus(); // إضافة السطر ده لتركيز الإدخال
  document.getElementById("search-box-product").addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const filteredProducts = allProducts.filter(product =>
      product.product_name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  
    currentProductPage = 1;
    renderProducts(filteredProducts);
  });
}
function setupProductPagination(products) {
  const totalPages = Math.ceil(products.length / productsPerPage);
  const prevButton = document.getElementById("prev-page");
  const nextButton = document.getElementById("next-page");

  prevButton.disabled = currentProductPage === 1;
  nextButton.disabled = currentProductPage === totalPages;
}

function updateProductStatus(id, status) {
    fetch(`http://localhost:3000/products/${id}`)
      .then(res => res.json())
      .then(product => {
        product.status = status;
  
        fetch(`http://localhost:3000/products/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        })
          .then(() => loadProducts())
          .catch(err => console.error("Error updating product status:", err));
      });
  }
  
  function editProduct(id) {
    fetch(`http://localhost:3000/products/${id}`)
      .then(res => res.json())
      .then(product => {

        ////// from login
        if (currentUser.role === "seller" && product.sellerId !== currentUser.id) {
            alert("You are not allowed to edit this product.");
            return;
          }
        //////////////
        contentArea.innerHTML = `
<h2>Edit Product</h2>
        <form id="edit-product-form" enctype="multipart/form-data">
          <label>Name:</label><br />
          <input type="text" id="edit-name" value="${product.product_name}" required /><br /><br />

          <label>Category:</label><br />
          <input type="text" id="edit-category" value="${product.category}" required /><br /><br />

          <label>Price:</label><br />
          <input type="number" id="edit-price" value="${parseFloat(product.price)}" required /><br /><br />

          <label>Image File Name (e.g., gojo.webp):</label><br />
          <input type="file" id="edit-image" accept="image/*" /><br /><br />
          <img src="${product.image_url}" alt="Current Image" width="100" /><br /><br />

          <label>Description:</label><br />
          <textarea id="edit-description" required>${product.description || ''}</textarea><br /><br />

          <label>Anime:</label><br />
          <input type="text" id="edit-anime" value="${product.anime || ''}" required /><br /><br />

          <label>Rating (0–5):</label><br />
          <input type="number" id="edit-rating" min="0" max="5" step="0.1" value="${product.rating || 0}" required /><br /><br />

          <button type="submit">Save Changes</button>
          <button type="button" id="cancel-edit">Cancel</button>
        </form>
      `;
  
        document.getElementById("edit-product-form").addEventListener("submit", function (e) {
          e.preventDefault();
          const imageInput = document.getElementById("edit-image");
          const imageName = imageInput.files[0]?.name || product.image_url.split('/').pop(); // If no new image, keep old one
  
          const updatedProduct = {
            product_name: document.getElementById("edit-name").value,
            category: document.getElementById("edit-category").value,
            price: document.getElementById("edit-price").value + " EGP",
            image_url: `product-images/${imageName}`,
            description: document.getElementById("edit-description").value,
            anime: document.getElementById("edit-anime").value,
            rating: parseFloat(document.getElementById("edit-rating").value),
            status:"Pending",
            sellerId: currentUser.id 
          };
  
          fetch(`http://localhost:3000/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProduct),
          })
            .then(() => loadProducts())
            .catch(err => console.error("Error updating product:", err));
        });
  
        document.getElementById("cancel-edit").addEventListener("click", loadProducts);
      });
  }
  
  function deleteProduct(id) {
    fetch(`http://localhost:3000/products/${id}`)
      .then(res => res.json())
      .then(product => {
        ////// from login
        if (currentUser.role === "seller" && product.sellerId !== currentUser.id) {
          alert("You are not allowed to delete this product.");
          return;
        }
  
        fetch(`http://localhost:3000/products/${id}`, {
          method: "DELETE",
        })
          .then(() => loadProducts())
          .catch(err => console.error("Error deleting product:", err));
      })
      .catch(err => console.error("Error fetching product for deletion:", err));
  }
    
  
  
  // Products Event Listener
  contentArea.addEventListener("click", function (e) {
    if (e.target.classList.contains("pending-btn-product")) {
        const id = e.target.getAttribute("data-id-product");
        updateProductStatus(id, "Pending");
      }
    if (e.target.classList.contains("approve-btn-product")) {
      const id = e.target.getAttribute("data-id-product");
      updateProductStatus(id, "Approved");
    }
  
    if (e.target.classList.contains("reject-btn-product")) {
      const id = e.target.getAttribute("data-id-product");
      updateProductStatus(id, "Rejected");
    }
  
    if (e.target.classList.contains("edit-btn-product")) {
      const id = e.target.getAttribute("data-id-product");
      editProduct(id);
    }
  
    if (e.target.classList.contains("delete-btn-product")) {
      const id = e.target.getAttribute("data-id-product");
      deleteProduct(id);
    }
  });
  
    

//////////////////////////////////////////////////
////////////order/////////////////////////////////
//////////////////////////////////////////////////

function loadOrders() {

    Promise.all([
      fetch("http://localhost:3000/orders").then(res => res.json()),
      fetch("http://localhost:3000/users").then(res => res.json()),
      fetch("http://localhost:3000/products").then(res => res.json())
    ])
      .then(([orders, users, products]) => {
        const enrichedOrders = orders.map(order => {
          const user = users.find(u => u.id === order.userId);

          const productDetails = order.products.map(item => {
            const product = products.find(p => p.id === item.productId);
            const rawPrice = product?.price || "0";
            const price = Number(rawPrice.toString().replace(/[^\d.]/g, "")); // يشيل أي حاجة غير أرقام ونقطة
              return {
              ...item,
              product_name: product ? product.product_name : "Unknown Product",
              price,
              total: price * item.quantity
            };
          });
  
          const total = productDetails.reduce((sum, p) => sum + p.total, 0);
  
          return {
            ...order,
            customer: user ? user.name : "Unknown User",
            productDetails,
            total,
            date: order.date || new Date().toISOString()
          };
        });

        /////////////
        allOrders = enrichedOrders;
        renderOrders(enrichedOrders);
        setupOrderPagination(enrichedOrders);

        ///////////////
  
        console.log(enrichedOrders); // Example output
      })
      .catch(err => console.error("Error loading orders:", err));
  }
  

  let allOrders = [];
  const ordersPerPage = 5;
  let currentOrderPage = 1;
  
  document.getElementById("orders-btn").addEventListener("click", loadOrders);
  
  function renderOrders(orders) {
    const previousSearchTermOrder = document.getElementById("search-box-order")?.value || "";
    const startIndex = (currentOrderPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    const ordersToDisplay = orders.slice(startIndex, endIndex);
  
    contentArea.innerHTML = `
      <h2>Order Management</h2>
      <input type="text" id="search-box-order" placeholder="Search by order ID or customer" />
      <table class="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${ordersToDisplay.map(order => `
            <tr>
              <td>${order.id}</td>
              <td>${order.customer}</td>
              <td>${order.total} EGP</td>
              <td>${order.status || "Pending"}</td>
              <td>${new Date(order.date).toLocaleDateString()}</td>
              <td>
                ${currentUser.role === "admin" ? `
                    <button class="pending-btn-order" data-id-order="${order.id}">Pending</button>
                    <button class="approve-btn-order" data-id-order="${order.id}">Approve</button>
                    <button class="reject-btn-order" data-id-order="${order.id}">Reject</button>
                    <button class="edit-btn-order" data-id-order="${order.id}">Edit</button>
                    <button class="delete-btn-order" data-id-order="${order.id}">Delete</button>
                ` : ""}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <div class="pagination">
        <button id="prev-page" ${currentOrderPage === 1 ? "disabled" : ""}>Previous</button>
        <span>Page ${currentOrderPage}</span>
        <button id="next-page" ${currentOrderPage * ordersPerPage >= orders.length ? "disabled" : ""}>Next</button>
      </div>
    `;
  
    document.getElementById("prev-page").addEventListener("click", () => {
      if (currentOrderPage > 1) {
        currentOrderPage--;
        renderOrders(orders);
        setupOrderPagination(orders);
      }
    });
  
    document.getElementById("next-page").addEventListener("click", () => {
      if (currentOrderPage * ordersPerPage < orders.length) {
        currentOrderPage++;
        renderOrders(orders);
        setupOrderPagination(orders);
      }
    });
  
    document.getElementById("search-box-order").value = previousSearchTermOrder;
    document.getElementById("search-box-order").focus();
    document.getElementById("search-box-order").addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      const filteredOrders = allOrders.filter(order =>
        order.customer.toLowerCase().includes(searchTerm) ||
        order.productDetails.some(p => p.product_name.toLowerCase().includes(searchTerm))      );
  
      currentOrderPage = 1;
      renderOrders(filteredOrders);
    });
  }
  
  function setupOrderPagination(orders) {
    const totalPages = Math.ceil(orders.length / ordersPerPage);
    const prevButton = document.getElementById("prev-page");
    const nextButton = document.getElementById("next-page");
  
    prevButton.disabled = currentOrderPage === 1;
    nextButton.disabled = currentOrderPage === totalPages;
  }
  
  contentArea.addEventListener("click", function (e) {

    if (e.target.classList.contains("pending-btn-order")) {
        const id = e.target.getAttribute("data-id-order");
        /////
        console.log(`pending button clicked for order ID: ${id}`);
        /////
        updateOrderStatus(id, "Pending");
      }
    if (e.target.classList.contains("approve-btn-order")) {
      const id = e.target.getAttribute("data-id-order");
      /////
      console.log(`approve button clicked for order ID: ${id}`);
      /////
      updateOrderStatus(id, "Approved");
    }
  
    if (e.target.classList.contains("reject-btn-order")) {
      const id = e.target.getAttribute("data-id-order");
      //////////
      console.log(`Reject button clicked for order ID: ${id}`);
      /////////
      updateOrderStatus(id, "Rejected");
    }
  
    if (e.target.classList.contains("edit-btn-order")) {
      const id = e.target.getAttribute("data-id-order");
      ////////
      console.log(`edit button clicked for order ID: ${id}`);
      ////////
      editOrder(id);
    }
  
    if (e.target.classList.contains("delete-btn-order")) {
      const id = e.target.getAttribute("data-id-order");
      //////////
      console.log(`delete button clicked for order ID: ${id}`);
      /////////
      deleteOrder(id);
    }
  });
  

function updateOrderStatus(id, status) {
    console.log(`Updating order ID: ${id} to status: ${status}`);
  
    fetch(`http://localhost:3000/orders/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Order ID ${id} not found. Status: ${res.status}`);
        }
        return res.json();
      })
      .then(order => {
        const updatedOrder = {
          ...order,
          status,
          date: order.date || new Date().toISOString()
        };
  
        return fetch(`http://localhost:3000/orders/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedOrder),
        });
      })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update order.");
        loadOrders();
      })
      .catch(err => console.error("Order update failed:", err));
  }


let currentProductDetails = [];

function editOrder(id) {
  Promise.all([
    fetch(`http://localhost:3000/orders/${id}`).then(res => res.json()),
    fetch("http://localhost:3000/users").then(res => res.json()),
    fetch("http://localhost:3000/products").then(res => res.json())
  ])
  .then(([order, users, products]) => {
    currentProductDetails = order.products.map(item => {
      const product = products.find(p => p.id === item.productId);
      const price = Number(product?.price) || 0;
      return {
        ...item,
        product_name: product ? product.product_name : "Unknown Product",
        price: product ? product.price : 0,
        total: price * item.quantity
      };
    });

    renderEditForm(order, users, products);
  })
  .catch(err => console.error("Error fetching order details:", err));
}

function renderEditForm(order, users, products) {
  contentArea.innerHTML = `
    <h2>Edit Order</h2>
    <form id="edit-order-form">
      <label>Customer:</label><br />
      <select id="edit-customer" disabled>
        ${users.map(user => `
          <option value="${user.id}" ${user.id === order.userId ? "selected" : ""}>${user.name}</option>
        `).join("")}
      </select><br /><br />

      <h3>Product Details</h3>
      <div id="product-details">
        ${currentProductDetails.map((productDetail, index) => `
          <div class="product-detail">
            <label>Product ${index + 1}:</label><br />
            <select class="edit-product" data-index="${index}">
              ${products.map(product => `
                <option value="${product.id}" ${product.id === productDetail.productId ? "selected" : ""}>${product.product_name}</option>
              `).join("")}
            </select><br /><br />
            <label>Quantity:</label><br />
            <input type="number" class="edit-quantity" data-index="${index}" value="${productDetail.quantity}" required /><br /><br />

<div style="text-align: center;">
    <button type="button" class="remove-product" data-index="${index}" 
      style="
        background-color:rgb(226, 21, 38);
        color:rgb(255, 255, 255);
        border: 1px solid #f5c6cb;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
      ">
      Remove
    </button>
  </div>
        <hr />
          </div>
        `).join("")}
        <br>
        <button type="button" id="add-product-detail">Add Product</button>
      </div>    

      <label>Status:</label><br />
      <select id="edit-status">
        <option value="Pending" ${order.status === "Pending" ? "selected" : ""}>Pending</option>
        <option value="Approved" ${order.status === "Approved" ? "selected" : ""}>Approved</option>
        <option value="Rejected" ${order.status === "Rejected" ? "selected" : ""}>Rejected</option>
      </select><br /><br />

      <button type="submit">Save Changes</button>
      <button type="button" id="cancel-edit-order">Cancel</button>
    </form>
  `;

  document.getElementById("add-product-detail").addEventListener("click", () => {
    currentProductDetails.push({ productId: products[0].id, quantity: 1 });
    renderEditForm(order, users, products);
  });

  /////////////
  document.querySelectorAll(".remove-product").forEach(button => {
    button.addEventListener("click", (e) => {
      const index = Number(e.target.dataset.index);
      currentProductDetails.splice(index, 1);
      renderEditForm(order, users, products);
    });
  });
  /////////////

  document.getElementById("edit-order-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const updatedOrder = {
      userId: order.userId,
      products: currentProductDetails.map((productDetail, index) => ({
        productId: document.querySelector(`.edit-product[data-index="${index}"]`).value,
        quantity: Number(document.querySelector(`.edit-quantity[data-index="${index}"]`).value),
      })),
      status: document.getElementById("edit-status").value,
      date: order.date || new Date().toISOString()
    };

    fetch(`http://localhost:3000/orders/${order.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedOrder),
    })
    .then(() => loadOrders())
    .catch(err => console.error("Error updating order:", err));
  });

  document.getElementById("cancel-edit-order").addEventListener("click", loadOrders);
}


////////////////////
//statistics 
////////////////////


document.getElementById("stats-btn").addEventListener("click", async () => {
  const [usersRes, productsRes, ordersRes] = await Promise.all([
    fetch("http://localhost:3000/users"),
    fetch("http://localhost:3000/products"),
    fetch("http://localhost:3000/orders")
  ]);

  const [users, products, orders] = await Promise.all([
    usersRes.json(),
    productsRes.json(),
    ordersRes.json()
  ]);

  console.log("Users:", users);
  console.log("Products:", products);
  console.log("Orders:", orders);

  
  console.log("Current User:", currentUser);

  if (currentUser) {
    if (currentUser.role === "admin") {
      const totalProducts = products.length;
      const totalOrders = orders.length;

      // حساب النسب بين حالات الطلبات
      const approvedCount = orders.filter(order => order.status === "Approved").length;
      const pendingCount = orders.filter(order => order.status === "Pending").length;
      const rejectedCount = orders.filter(order => order.status === "Rejected").length;

      // حساب عدد المنتجات حسب الحالة للمخطط الدائري الجديد
      const productsApprovedCount = products.filter(product => product.status === "Approved").length;
      const productsPendingCount = products.filter(product => product.status === "Pending").length;
      const productsRejectedCount = products.filter(product => product.status === "Rejected").length;

      // حساب النسب المئوية للمنتجات حسب الحالة
      const productsApprovedPercent = totalProducts > 0 ? (productsApprovedCount / totalProducts) * 100 : 0;
      const productsPendingPercent = totalProducts > 0 ? (productsPendingCount / totalProducts) * 100 : 0;
      const productsRejectedPercent = totalProducts > 0 ? (productsRejectedCount / totalProducts) * 100 : 0;

      const contentArea = document.getElementById("content-area");
      contentArea.innerHTML = `
        <h2>Statistics Overview (Admin)</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Total Products</h3>
            <p>${totalProducts}</p>
          </div>
          <div class="stat-card">
            <h3>Total Orders</h3>
            <p>${totalOrders}</p>
          </div>
        </div>

        <div class="status-cards">
          <div class="stat-card approved">
            <h3>Approved Orders</h3>
            <p>${approvedCount}</p>
          </div>
          <div class="stat-card pending">
            <h3>Pending Orders</h3>
            <p>${pendingCount}</p>
          </div>
          <div class="stat-card rejected">
            <h3>Rejected Orders</h3>
            <p>${rejectedCount}</p>
          </div>
        </div>

        <h3>Products Status Overview</h3>
        <div class="products-status-cards">
          <div class="stat-card approved">
            <h3>Approved Products</h3>
            <p>${productsApprovedCount} (${productsApprovedPercent.toFixed(2)}%)</p>
          </div>
          <div class="stat-card pending">
            <h3>Pending Products</h3>
            <p>${productsPendingCount} (${productsPendingPercent.toFixed(2)}%)</p>
          </div>
          <div class="stat-card rejected">
            <h3>Rejected Products</h3>
            <p>${productsRejectedCount} (${productsRejectedPercent.toFixed(2)}%)</p>
          </div>
        </div>

        <h3>Products Status Chart</h3>
        <div class="pie-chart-container">
          <div class="pie-chart"
            style="--approved:${productsApprovedPercent}; --pending:${productsPendingPercent}; --rejected:${productsRejectedPercent};">
          </div>
          <ul class="legend">
            <li><span class="legend-color" style="background:#48bb78;"></span> Approved (${productsApprovedCount})</li>
            <li><span class="legend-color" style="background:#ed8936;"></span> Pending (${productsPendingCount})</li>
            <li><span class="legend-color" style="background:#f56565;"></span> Rejected (${productsRejectedCount})</li>
          </ul>
        </div>
      `;
    } else if (currentUser.role === "seller") {
      const sellerId = currentUser.id;
      const sellerProducts = products.filter(product => product.sellerId === sellerId);

      console.log("Seller Products:", sellerProducts);

      // حساب النسب بين حالات المنتجات
      const approvedCount = sellerProducts.filter(product => product.status === "Approved").length;
      const pendingCount = sellerProducts.filter(product => product.status === "Pending").length;
      const rejectedCount = sellerProducts.filter(product => product.status === "Rejected").length;

      const totalProducts = sellerProducts.length;

      const approvedPercent = totalProducts > 0 ? (approvedCount / totalProducts) * 100 : 0;
      const pendingPercent = totalProducts > 0 ? (pendingCount / totalProducts) * 100 : 0;
      const rejectedPercent = totalProducts > 0 ? (rejectedCount / totalProducts) * 100 : 0;

      const contentArea = document.getElementById("content-area");
      contentArea.innerHTML = `
        <h2>Statistics Overview (Seller)</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Total Products</h3>
            <p>${totalProducts}</p>
          </div>
        </div>

        <div class="status-cards">
          <div class="stat-card approved">
            <h3>Approved Products</h3>
            <p>${approvedCount} (${approvedPercent.toFixed(2)}%)</p>
          </div>
          <div class="stat-card pending">
            <h3>Pending Products</h3>
            <p>${pendingCount} (${pendingPercent.toFixed(2)}%)</p>
          </div>
          <div class="stat-card rejected">
            <h3>Rejected Products</h3>
            <p>${rejectedCount} (${rejectedPercent.toFixed(2)}%)</p>
          </div>
        </div>

        <h3>Pie Chart Overview</h3>
        <div class="pie-chart-container">
          <div class="pie-chart"
            style="--approved:${approvedPercent}; --pending:${pendingPercent}; --rejected:${rejectedPercent};">
          </div>
          <ul class="legend">
            <li><span class="legend-color" style="background:#48bb78;"></span> Approved (${approvedCount})</li>
            <li><span class="legend-color" style="background:#ed8936;"></span> Pending (${pendingCount})</li>
            <li><span class="legend-color" style="background:#f56565;"></span> Rejected (${rejectedCount})</li>
          </ul>
        </div>
      `;
    }
  } else {
    console.log("No user found with id 1.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("stats-btn")?.click(); // أو استدعِ loadStatistics() مباشرة
});
})