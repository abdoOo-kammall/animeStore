window.addEventListener("load", () => {
  const arrImage = [
    "../IMAGES/attack-on-titan.jpg",
    "../IMAGES/arcane.jpg",
    "../IMAGES/bersek.jpg",
    "../IMAGES/one-piece.jpg",
    "../IMAGES/bleach.jpg",
    "../IMAGES/jujutsuekaisen.jpg",
  ];
  function getImageName(imagePath) {
    const parts = imagePath.split("/");
    const imageName = parts[parts.length - 1];
    const nameWithoutExtension = imageName.replace(".jpg", "");
    return nameWithoutExtension;
  }
  let animes = document.querySelector(".animes");

  for (let i = 0; i < arrImage.length; i++) {
    let createAnime = document.createElement("div");
    createAnime.classList.add("anime");
    let creatImg = document.createElement("img");
    let createDivP = document.createElement("div");
    let nameOfAnime = document.createElement("p");
    creatImg.src = arrImage[i];
    creatImg.alt = getImageName(arrImage[i]);
    nameOfAnime.innerText = getImageName(arrImage[i]);
    createAnime.append(creatImg);
    createDivP.classList.add("heading-TV");
    createDivP.append(nameOfAnime);
    createAnime.append(createDivP);
    animes.append(createAnime);
  }
});
