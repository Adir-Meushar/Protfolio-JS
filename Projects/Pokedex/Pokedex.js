const pokemonCount = 386;
const pokedex = {};
const pokemonList = document.getElementById("pokemon-list");
const favorite = document.querySelector("#favorite");
let favoriteMsg = document.getElementById("favorite-msg");
let pokemonImg = document.getElementById("pokemon-img");
let addedFavorites = new Set(); // Set to track added favorite Pokemon IDs
const saveBtn = document.querySelector("#save");
const clearBtn = document.querySelector("#clear");

window.onload = async () => {
  loader(true);
  snackbar("Loading Pokémons. It might take a few minutes. Please wait...");
  await fetchAllPokemon();
  let gen1Start = 1;
  let gen2Start = 152;
  let gen3Start = 251;
  const gen1Btn = document.querySelector("#gen1-button");
  const gen2Btn = document.querySelector("#gen2-button");
  const gen3Btn = document.querySelector("#gen3-button");

  for (let i = gen1Start; i <= gen2Start - 1; i++) {
    let pokemon = document.createElement("div");
    pokemon.id = i;
    pokemon.textContent =
      i.toString() + " ." + pokedex[i]["name"].toUpperCase();
    pokemon.classList.add("pokemon-names");
    pokemon.addEventListener("click", updatePokemon);
    pokemonList.append(pokemon);
  }

  function displayPokemon(start, end) {
    pokemonList.innerHTML = "";
    for (let i = start; i <= end; i++) {
      let pokemon = document.createElement("div");
      pokemon.id = i;
      pokemon.textContent = `${i} . ${pokedex[i].name.toUpperCase()}`;
      pokemon.classList.add("pokemon-names");
      pokemon.addEventListener("click", updatePokemon);
      pokemonList.append(pokemon);
    }
  }

  gen1Btn.addEventListener("click", () => {
    displayPokemon(gen1Start, gen2Start - 1);
    snackbar("Generation 1 is now displayed");
  });

  gen2Btn.addEventListener("click", () => {
    displayPokemon(gen2Start, gen3Start);
    snackbar("Generation 2 is now displayed");
  });

  gen3Btn.addEventListener("click", () => {
    displayPokemon(gen3Start + 1, pokemonCount);
    snackbar("Generation 3 is now displayed");
  });

  // Fix first pokemon types//
  document.getElementById("pokemon-description").innerText = pokedex[1]["desc"];
  document.getElementsByClassName("first1")[0].style.backgroundColor = "green";
  document.getElementsByClassName("first1")[0].style.color = "white";
  document.getElementsByClassName("first2")[0].style.color = "black";
  document.getElementsByClassName("first2")[0].style.backgroundColor = "purple";
  loader(false);

  // Add event listener to handle adding Pokemon to favorites//
  pokemonImg.addEventListener("dblclick", addPokemonToFavorites);

  // Load favorites from local storage if they exist//
  const favoritesData = localStorage.getItem("favorites");
  if (favoritesData) {
    favoriteMsg.remove();
    const favoritesArray = JSON.parse(favoritesData);

    // Add the favorites from local storage to the addedFavorites set//
    favoritesArray.forEach((id) => addedFavorites.add(id));

    // Render the favorites from local storage//
    favoritesArray.forEach((id) => renderFavoritePokemon(id));
  }
};

async function fetchAllPokemon() {
  let url = "https://pokeapi.co/api/v2/pokemon?limit=" + pokemonCount;
  let res = await fetch(url);
  let pokemonList = await res.json();

  for (let i = 1; i <= pokemonCount; i++) {
    await getPokemon(i, pokemonList.results[i - 1].url);
  }
}

function updatePokemon() {
  pokemonImg.src = pokedex[this.id]["img"];

  let typesDiv = document.getElementById("pokemon-types");
  while (typesDiv.firstChild) {
    typesDiv.firstChild.remove();
  }

  let types = pokedex[this.id]["types"];
  for (let i = 0; i < types.length; i++) {
    let type = document.createElement("span");
    type.innerText = types[i]["type"]["name"].toUpperCase();
    type.classList.add("type-box");
    type.classList.add(types[i]["type"]["name"]);
    typesDiv.append(type);
  }
  document.getElementById("pokemon-description").innerText =
    pokedex[this.id]["desc"];

  // Update the id of the currently displayed Pokemon in the event listener//
  pokemonImg.dataset.id = this.id;
}

function addPokemonToFavorites() {
  favoriteMsg.remove();
  // Get the id of the currently displayed Pokemon//
  const id = pokemonImg.dataset.id;

  // Check if the Pokemon is already added to favorites//
  if (addedFavorites.has(id)) {
    // Pokemon already exists, do not add again//
    return;
  }
  if (favorite.children.length >= 9) {
    return;
  }

  let favoritePokemon = document.createElement("div");
  favoritePokemon.classList.add("favorite-pokemon");
  let pokemonImage = document.createElement("img");
  pokemonImage.src = pokedex[id]["img"];
  favoritePokemon.appendChild(pokemonImage);
  let pokemonName = document.createElement("span");
  pokemonName.textContent = pokedex[id]["name"];
  favoritePokemon.appendChild(pokemonName);
  favorite.appendChild(favoritePokemon);
  addedFavorites.add(id);
}

async function getPokemon(num, url) {
  let res = await fetch(url);
  let pokemon = await res.json();
  let pokemonName = pokemon["name"];
  let pokemonImg = pokemon["sprites"]["front_default"];
  let pokemonType = pokemon["types"];

  res = await fetch(pokemon["species"]["url"]);
  let pokemonDec = await res.json();
  pokemonDec = pokemonDec["flavor_text_entries"][9]["flavor_text"];
  pokedex[num] = {
    name: pokemonName,
    img: pokemonImg,
    types: pokemonType,
    desc: pokemonDec,
  };
}

function loader(isShow) {
  const elem = document.querySelector(".loaderFrame");
  if (isShow) {
    elem.style.display = "flex";
  } else {
    elem.style.display = "none";
  }
}
function snackbar(text) {
  const elem = document.querySelector("#snackbar");
  elem.classList.add("show");
  elem.innerHTML = text;
  setTimeout(() => {
    elem.classList.remove("show");
  }, 3 * 1000);
}
clearBtn.addEventListener("click", () => {
  localStorage.clear();
  snackbar("Cleared favorite list.");
  favorite.innerHTML = "";
  setTimeout(() => {
    location.reload();
  }, 1500);

  favorite.appendChild(favoriteMsg);
});
saveBtn.addEventListener("click", saveFavoritesToLocalStorage);
function saveFavoritesToLocalStorage() {
  const favoriteChildren = favorite.children;
  if (favoriteChildren.length === 1 && favoriteChildren[0] === favoriteMsg) {
    snackbar("Please add at least one favorite Pokémon.");
    return;
  }
  // Convert the addedFavorites set to an array//
  const favoritesArray = Array.from(addedFavorites);

  // Save the favorites array to local storage//
  localStorage.setItem("favorites", JSON.stringify(favoritesArray));
  loader(true);
  snackbar("Saving Pokemons");
  setTimeout(() => {
    loader(false);
  }, 2500);
}
function renderFavoritePokemon(id) {
  const favoritePokemon = document.createElement("div");
  favoritePokemon.classList.add("favorite-pokemon");

  const pokemonImage = document.createElement("img");
  pokemonImage.src = pokedex[id]["img"];
  favoritePokemon.appendChild(pokemonImage);

  const pokemonName = document.createElement("span");
  pokemonName.textContent = pokedex[id]["name"];
  favoritePokemon.appendChild(pokemonName);

  favorite.appendChild(favoritePokemon);
}

function loader(isShow) {
  const elem = document.querySelector(".loaderFrame");
  if (isShow) {
    elem.style.display = "flex";
  } else {
    elem.style.display = "none";
  }
}
function snackbar(text) {
  const elem = document.querySelector("#snackbar");
  elem.classList.add("show");
  elem.innerHTML = text;
  setTimeout(() => {
    elem.classList.remove("show");
  }, 3 * 1000);
}
