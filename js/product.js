window.addEventListener("load", () => {
  fetch("http://localhost:3000/products")
    .then((response) => response.json())
    .then((products) => {
      const productGrid = document.getElementById("product-grid");
      const accessGrid = document.getElementById("access-grid");

      const hoodiesAndTShirts = products
        .filter((item) => {
          return item.category === "Hoodies" || item.category === "T-shirts";
        })
        .slice(0, 4);

      const accessories = products
        .filter((item) => {
          return item.category === "Accessories";
        })
        .slice(0, 4);

      hoodiesAndTShirts.forEach((product) => {
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
          const storedUser = localStorage.getItem("currentUser");
          if (!storedUser) alert("U should login to Add");
          else {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.push({
              product_id: product.id,

              product_name: product.product_name,
              price: product.price,
              description: product.description,
              image_url: product.image_url,
            });
            localStorage.setItem("cart", JSON.stringify(cart));
            alert("Product has been added to Cart successfully  ");
            // console.log(cartCounter);

            let cartCounter = document.querySelector(".cart-value");
            counter++;
            cartCounter.textContent = counter;
          }
        });

        const viewBtn = card.querySelector(".viewProduct");
        viewBtn.addEventListener("click", () => {
          localStorage.setItem("selectedProduct", JSON.stringify(product));
          window.location.href = "productDetails.html";
        });

        productGrid.appendChild(card);
      });

      accessories.forEach((product) => {
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
            <button class="viewProduct">
              <i class="fa fa-eye" aria-hidden="true"></i>
            </button>
          </div>
        `;

        const viewBtn = card.querySelector(".viewProduct");
        viewBtn.addEventListener("click", () => {
          localStorage.setItem("selectedProduct", JSON.stringify(product));
          window.location.href = "productDetails.html";
        });

        accessGrid.appendChild(card);
      });
    })
    .catch((error) => console.error("Error fetching products:", error));

  const categories = document.querySelectorAll(".categorieName");

  categories.forEach((categoryLink) => {
    categoryLink.addEventListener("click", (event) => {
      const selectedCategory = event.target.textContent.trim();
      window.location.href = `shop.html?category=${selectedCategory}`;
    });
  });

  // let shopBtn = document.querySelector(".shop-btn");
  // shopBtn.addEventListener("click", () => {
  //   window.location.href = "shop.html";
  // });

  const searchField = document.getElementById("searchBox");
  const suggestionsList = document.getElementById("suggestionsList");

  searchField.addEventListener("input", () => {
    const val = searchField.value.toLowerCase().trim();

    if (val === "") {
      suggestionsList.style.display = "none";
      suggestionsList.innerHTML = "";
      return;
    }

    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((products) => {
        const animes = [...new Set(products.map((p) => p.anime))];
        const filtered = animes.filter((anime) =>
          anime.toLowerCase().startsWith(val)
        );

        suggestionsList.innerHTML = "";

        if (filtered.length > 0) {
          suggestionsList.style.display = "block";
          filtered.forEach((anime) => {
            const li = document.createElement("li");
            li.textContent = anime;

            li.onclick = () => {
              const animeParam = anime.trim().replace(/\s+/g, "-");
              window.location.href = `shop.html?Anime=${encodeURIComponent(
                animeParam
              )}`;
            };

            suggestionsList.appendChild(li);
          });
        } else {
          suggestionsList.style.display = "none";
        }
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        suggestionsList.style.display = "none";
      });
  });

  document.addEventListener("click", (e) => {
    if (
      !searchField.contains(e.target) &&
      !suggestionsList.contains(e.target)
    ) {
      suggestionsList.style.display = "none";
    }
  });
});
