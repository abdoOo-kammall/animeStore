window.addEventListener("DOMContentLoaded", () => {
  const product = JSON.parse(localStorage.getItem("selectedProduct"));

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
  // function updateHeader() {
  //   const loginLink = document.querySelector(
  //     '.main-nav-list a[href="login.html"]'
  //   );
  //   const signupLink = document.querySelector(
  //     '.main-nav-list a[href="signup.html"]'
  //   );
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
