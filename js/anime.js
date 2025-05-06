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
});
