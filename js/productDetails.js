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
    const storedUser = localStorage.getItem("currentUser");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log(cart);

    const exists = cart.some(
      (item) => item.id === product.id || item.product_id === product.id
    );

    if (!storedUser) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "You must log in first to add products to your cart.",
        customClass: {
          title: "swal-title-custom",
          popup: "swal-popup-custom",
          content: "swal-text-custom",
        },
      });
    } else {
      if (!exists) {
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        counter++;
        cartCounter.textContent = counter;

        Swal.fire({
          icon: "success",
          title: "Added to Cart",
          text: "Product has been successfully added to your cart!",
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            title: "swal-title-custom",
            popup: "swal-popup-custom",
            content: "swal-text-custom",
          },
        });
      } else {
        Swal.fire({
          icon: "info",
          title: "Already in Cart",
          text: "This product is already in your cart.",
          customClass: {
            title: "swal-title-custom",
            popup: "swal-popup-custom",
            content: "swal-text-custom",
          },
        });
      }
    }
  });
});
