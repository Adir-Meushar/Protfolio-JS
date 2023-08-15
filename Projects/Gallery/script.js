class Gallery {
  images = [];
  imgElem;
  currentImage = -1;
  interval;
  imgDescription;

  constructor(elemId, ...imageUrls) {
    this.images = imageUrls;
    const galleryElem = document.getElementById(elemId);
    galleryElem.classList.add("gallery");

    const right = document.createElement("div");
    right.classList.add("arrow", "right");
    right.addEventListener("click", () => this.nextImage());
    galleryElem.appendChild(right);

    const left = document.createElement("div");
    left.classList.add("arrow", "left");
    left.addEventListener("click", () => this.prevImage());
    galleryElem.appendChild(left);

    this.imgElem = document.createElement("img");
    this.imgDescription = document.createElement("div");
    this.imgDescription.classList.add("description");
    galleryElem.appendChild(this.imgDescription);

    galleryElem.addEventListener("mouseover", () => {
      this.stopAuto();
    });

    //sync gallery//
    galleryElem.addEventListener("mouseout", () => {
      const myEvent = new CustomEvent("startAllGallery");
      dispatchEvent(myEvent);
    });

    addEventListener("startAllGallery", () => this.startAuto());

    galleryElem.appendChild(this.imgElem);
    this.nextImage();
    this.startAuto();
  }

  nextImage() {
    this.currentImage++;

    if (this.currentImage >= this.images.length) {
      this.currentImage = 0;
    }

    this.imgElem.src = this.images[this.currentImage];
    const imageFileName = this.images[this.currentImage].split("/").pop();
    this.imgDescription.textContent = this.getImageDescription(imageFileName);
  }

  prevImage() {
    this.currentImage--;

    if (this.currentImage < 0) {
      this.currentImage = this.images.length - 1;
    }

    this.imgElem.src = this.images[this.currentImage];
    const imageFileName = this.images[this.currentImage].split("/").pop();
    this.imgDescription.textContent = this.getImageDescription(imageFileName);
  }

  getImageDescription(imageFileName) {
    const imageDescriptions = {
      "fresh-water-forest": "fresh-water-forest",
      jungle: "jungle",
      desert: "desert",
      blizard: "blizard",
      savannah: "savannah",
      tiger: "Tiger",
      lion: "Lion",
      leopard: "Leopard",
      jaguar: "Jaguar",
      cheetah: "Cheetah",
      "saltwater crocodile": "saltwater crocodile",
      cobra: "cobra",
      "komodo-dragon": "komodo-dragon",
      "gila monster": "gila monster",
      tortoise: "tortoise",
      "Bald-eagles": "Bald-eagles",
      vultures: "vultures",
      ostrich: "ostrich",
      "snow-owl": "snow-owl",
      Peacock: "Peacock",
    };

    for (const [keyword, description] of Object.entries(imageDescriptions)) {
      if (imageFileName.includes(keyword)) {
        return description;
      }
    }

    return "Image Description";
  }

  startAuto() {
    clearInterval(this.interval);

    this.interval = setInterval(() => {
      this.nextImage();
    }, 3 * 1000);
  }

  stopAuto() {
    clearInterval(this.interval);
  }
}

const g1 = new Gallery(
  "gallery1",
  "./images/nature/fresh-water-forest.jpg",
  "./images/nature/jungle.jpg",
  "./images/nature/desert.jpg",
  "./images/nature/blizard.jpg",
  "./images/nature/savannah.jpg"
);
const g2 = new Gallery(
  "gallery2",
  "images/big-cats/tiger.jpg",
  "./images/big-cats/lion.jpg",
  "./images/big-cats/leopard.jpg",
  "./images/big-cats/jaguar.jpg",
  "images/big-cats/cheetah.jpg"
);
const g3 = new Gallery(
  "gallery3",
  "./images/reptiles/saltwater crocodile.jpg",
  "./images/reptiles/cobra.jpg",
  "./images/reptiles/komodo-dragon.jpg",
  "./images/reptiles/gila monster.jpg",
  "./images/reptiles/tortoise.jpg"
);
const g4 = new Gallery(
  "gallery4",
  "./images/birds/Bald-eagles.jpg",
  "./images/birds/vultures.jpg",
  "./images/birds/ostrich.jpg",
  "./images/birds/snow-owl.jpg",
  "./images/birds/Peacock.jpg"
);
