window.addEventListener("load", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedAnime = urlParams.get("Anime");
  console.log(selectedAnime);
  ////

  fetch("http://localhost:3000/products").then((response) => {
    response.json().then((products) => {
      products = products.filter((item) => {
        return (
          item.anime.toLowerCase().replace(/\s+/g, "-") ===
          selectedAnime.toLowerCase()
        );
      });
      console.log(products);
      grid.innerHTML = "";
      products.forEach((product) => {
        grid.appendChild(createProductCard(product));
      });
    });
  });
  function updateHeader() {
    const loginLink = document.querySelector(
      '.main-nav-list a[href="login.html"]'
    );
    const signupLink = document.querySelector(
      '.main-nav-list a[href="signup.html"]'
    );
    const userIcon = document.querySelector("#user-icon");
    const logOut = document.querySelector(".log-out");
    const cartIcon = document.querySelector(".cart-info");

    if (localStorage.getItem("currentUser")) {
      loginLink.style.display = "none";
      signupLink.style.display = "none";
      userIcon.style.display = "inline-block";
      logOut.style.display = "inline-block";
      cartIcon.style.display = "inline-block";
    } else {
      loginLink.style.display = "inline-block";
      signupLink.style.display = "inline-block";
      userIcon.style.display = "none";
      cartIcon.style.display = "none";
      logOut.style.display = "none";
    }
  }

  updateHeader();
});
