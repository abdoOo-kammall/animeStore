window.addEventListener("DOMContentLoaded", () => {
  const product = JSON.parse(localStorage.getItem("selectedProduct"));

  if (!product) {
    alert("No product selected!");
    window.location.href = "shop.html";
    return;
  }

  document.querySelector(".image-container img").src = product.image_url;
  document.querySelector(".animeName").textContent = product.product_name;
  document.querySelector(".descriptionAnime").textContent = product.description;
  document.querySelector(".priceValue").textContent = product.price;
  document.querySelector(".Rating span").textContent = product.rating;

  document.querySelector(".addd-to-cart").addEventListener("click", () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exists = cart.some(
      (item) => item.product_name === product.product_name
    );

    if (!exists) {
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Product added to cart successfully!");
    }
  });
});
