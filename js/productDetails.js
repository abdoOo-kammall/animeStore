window.addEventListener("DOMContentLoaded", () => {
  const product = JSON.parse(localStorage.getItem("selectedProduct"));

  document.querySelector(".image-container img").src = product.image_url;
  document.querySelector(".animeName").textContent = product.product_name;
  document.querySelector(".descriptionAnime").textContent = product.description;
  document.querySelector(".priceValue").textContent = product.price;
  document.querySelector(".Rating span").textContent = product.rating;

  let sizeValue = document.querySelectorAll(".valueSize");
  sizeValue.forEach((Element) => {
    Element.addEventListener("click", () => {
      sizeValue.forEach((btn) => {
        btn.style.backgroundColor = "";
        btn.style.color = "#5560a3";
      });
      Element.style.backgroundColor = "#5560a3";
      Element.style.color = "#fff";
    });
  });

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartCounter = document.querySelector(".cart-value");
  let counter = cart.length;
  cartCounter.textContent = counter;

  document.querySelector(".addd-to-cart").addEventListener("click", () => {
    const exists = cart.some(
      (item) => item.product_name === product.product_name
    );
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) alert("U should login to Add");
    else {
      if (!exists) {
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        counter++;
        cartCounter.textContent = counter;
        alert("Product added to cart successfully!");
      } else {
        alert("Product has been added once!");
      }
    }
  });
});
