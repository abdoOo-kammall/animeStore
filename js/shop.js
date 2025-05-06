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
  let filteredByAnime = []; // ⬅️ هنا هتحفظ المنتجات اللي جت من الفلترة بالأنمي

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
        <button>
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    `;
    return card;
  };

  const renderProducts = (products) => {
    grid.innerHTML = "";
    products.forEach((product) => {
      grid.appendChild(createProductCard(product));
    });
  };

  // ⬇️ جلب المنتجات وفحص الأنمي
  fetch("http://localhost:3000/products")
    .then((response) => response.json())
    .then((products) => {
      const urlParams = new URLSearchParams(window.location.search);
      const selectedAnime = urlParams.get("Anime");

      if (selectedAnime) {
        filteredByAnime = products.filter((item) => {
          return (
            item.anime.toLowerCase().replace(/\s+/g, "-") ===
            selectedAnime.toLowerCase()
          );
        });
      } else {
        filteredByAnime = products;
      }

      renderProducts(filteredByAnime); // ⬅️ اعرض الفلترة المبدئية
    })
    .catch((error) => console.error("Error fetching products:", error));

  // ⬇️ توليد الفلاتر
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
          // ⬅️ خليك بس مختار واحد
          checkboxes.forEach((cb) => {
            if (cb !== e.target) cb.checked = false;
          });

          const selectedCategory = e.target.checked ? e.target.value : null;

          if (selectedCategory) {
            const filtered = filteredByAnime.filter(
              (product) => product.category === selectedCategory
            );
            renderProducts(filtered);
          } else {
            renderProducts(filteredByAnime);
          }
        });
      });

      isAppended = true;
    }
  });
});
