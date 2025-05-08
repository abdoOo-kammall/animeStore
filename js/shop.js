window.addEventListener("load", () => {
  let grid = document.getElementById("product-grid");
  const categoryBtn = document.querySelector(
    ".filter-group:nth-child(2) .filter-title-btn"
  );
  const categoryBox = document.querySelector(
    ".filter-group:nth-child(2) .filter-bottom"
  );
  const categoryLabel = categoryBox.querySelector(".filter-options");
  const categories = ["Hoodies", "T-Shirts", "Accessories", "Gaming Anime"];
  let isAppended = false;
  let filteredByAnime = [];
  let allProducts = [];

  const createProductCard = (product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image_url}" alt="${product.product_name}" />
      <div class="product-content">
        <h4 class="product-name">${product.product_name}</h4>
        <p class="product-price">${product.price}</p>
        <p class="product-rating">Rating: ${product.rating}</p>
        <p class="product-source">From: ${product.anime}</p>
      </div>
      <div class="product-actions">
        <button class="add-to-cart">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
        <button class="viewProduct"> <i class="fa fa-eye" aria-hidden="true"></i>
        </button>
      </div>
    `;

    const addToCartBtn = card.querySelector(".add-to-cart");
    addToCartBtn.addEventListener("click", () => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push({
        product_name: product.product_name,
        price: product.price,
        description: product.description,
        image_url: product.image_url,
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("mission done ");
    });

    const viewBtn = card.querySelector(".viewProduct");
    viewBtn.addEventListener("click", () => {
      localStorage.setItem("selectedProduct", JSON.stringify(product));
      window.location.href = "productDetails.html";
    });

    return card;
  };

  const renderProducts = (products) => {
    grid.innerHTML = "";
    products.forEach((product) => {
      grid.appendChild(createProductCard(product));
    });
  };

  fetch("http://localhost:3000/products")
    .then((response) => response.json())
    .then((products) => {
      allProducts = products;
      const urlParams = new URLSearchParams(window.location.search);
      const selectedAnime = urlParams.get("Anime");
      const selectedCategory = urlParams.get("Category");

      let filtered = products;

      if (selectedAnime) {
        filtered = filtered.filter(
          (item) =>
            item.anime.toLowerCase().replace(/\s+/g, "-") ===
            selectedAnime.toLowerCase()
        );
      }

      if (selectedCategory) {
        filtered = filtered.filter(
          (item) =>
            item.category.toLowerCase().replace(/\s+/g, "-") ===
            selectedCategory.toLowerCase()
        );
      }

      filteredByAnime = filtered;
      renderProducts(filtered);
    });

  categoryBtn.addEventListener("click", () => {
    categoryBox.classList.toggle("active");

    if (!isAppended) {
      categories.forEach((category) => {
        const html = `
          <label class="filter-checkbox" data-category-slug="${category}">
            <input type="checkbox" name="category" value="${category}" />
            <span>${category}</span>
          </label>`;
        categoryLabel.insertAdjacentHTML("beforeend", html);
      });

      const checkboxes = categoryLabel.querySelectorAll(
        "input[type='checkbox']"
      );
      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", (e) => {
          checkboxes.forEach((cb) => {
            if (cb !== e.target) cb.checked = false;
          });

          const selectedCategory = e.target.checked ? e.target.value : null;

          let filtered = allProducts;
          const urlParams = new URLSearchParams(window.location.search);
          const selectedAnime = urlParams.get("Anime");
          if (selectedAnime) {
            filtered = filtered.filter(
              (item) =>
                item.anime.toLowerCase().replace(/\s+/g, "-") ===
                selectedAnime.toLowerCase()
            );
          }

          if (selectedCategory) {
            filtered = filtered.filter(
              (product) => product.category === selectedCategory
            );

            const url = new URL(window.location.href);
            url.searchParams.set(
              "Category",
              selectedCategory.replace(/\s+/g, "-")
            );
            history.replaceState(null, "", url);
          } else {
            const url = new URL(window.location.href);
            url.searchParams.delete("Category");
            history.replaceState(null, "", url);
          }

          renderProducts(filtered);
        });
      });

      isAppended = true;
    }
  });

  const clearBtn = document.querySelector(".clear-btn");
  console.log(clearBtn);

  clearBtn.addEventListener("click", () => {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach((cb) => (cb.checked = false));

    const url = new URL(window.location.href);
    url.searchParams.delete("Anime");
    url.searchParams.delete("Category");
    history.replaceState(null, "", url);

    fetch("http://localhost:3000/products")
      .then((response) => response.json())
      .then((products) => {
        grid.innerHTML = "";
        products.forEach((product) => {
          grid.appendChild(createProductCard(product));
        });
      });
  });

  let sortElement = document.querySelector(".sort-select");
  console.log(sortElement);
  sortElement.addEventListener("change", () => {
    let sortValue = sortElement.value;

    fetch("http://localhost:3000/products")
      .then((response) => response.json())
      .then((products) => {
        if (sortValue === "price-asc") {
          products = products.sort((a, b) => {
            return (
              parseInt(a.price.replace(/[^\d]/g, "")) -
              parseInt(b.price.replace(/[^\d]/g, ""))
            );
          });
        } else if (sortValue === "price-desc") {
          products = products.sort((a, b) => {
            return (
              parseInt(b.price.replace(/[^\d]/g, "")) -
              parseInt(a.price.replace(/[^\d]/g, ""))
            );
          });
        } else if (sortValue === "rating") {
          products = products.sort((a, b) => {
            return b.rating - a.rating;
          });
        }
        console.log(products);
        grid.innerHTML = "";
        products.forEach((product) => {
          grid.appendChild(createProductCard(product));
        });
      });

    console.log(sortValue);
  });
});
