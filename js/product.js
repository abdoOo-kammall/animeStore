window.addEventListener("load", () => {
  fetch("http://localhost:3000/products")
    .then((response) => response.json())
    .then((products) => {
      const grid = document.getElementById("product-grid");
      products = products.filter((item) => {
        return item.category === "Hoodies" || item.category === "T-shirts";
      });
      products.slice(0, 4).forEach((product) => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image_url}" alt="${product.product_name}" />
            <div class="product-content">
              <h4 class="product-name">${product.product_name}</h4>

              <p class="product-price">${product.price}</p>
              <p class="product-rating">Rating ${product.rating}</p>
              <p class="product-source">From: ${product.anime}</p>
            </div>
          `;

        grid.appendChild(card);
      });
    })
    .catch((error) => console.error("Error fetching products:", error));
});

window.addEventListener("load", () => {
  fetch("http://localhost:3000/products")
    .then((response) => response.json())
    .then((products) => {
      const grid = document.getElementById("access-grid");
      products = products.filter((item) => {
        return item.category === "Accessories";
      });
      console.log(products);
      products.slice(0, 4).forEach((product) => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image_url}" alt="${product.product_name}" />
            <div class="product-content">
              <h4 class="product-name">${product.product_name}</h4>
           
              <p class="product-price">${product.price}</p>
              <p class="product-rating">Rating ${product.rating}</p>

              <p class="product-source">From: ${product.anime}</p>
            </div>
          `;

        grid.appendChild(card);
      });
    })
    .catch((error) => console.error("Error fetching products:", error));
});
