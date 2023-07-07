const baseURL = "https://pokeapi.co/api/v2";
const limit = 12; // Cantidad de Pokémon por página (9 para el ejemplo)
let currentPage = 1; // Página actual
const totalPokemon = 200; // Total de Pokémon que deseas obtener

const getAllPokemon = async () => {
  try {
    const allPokemon = [];

    // Calcular el número total de páginas necesarias
    const totalPages = Math.ceil(totalPokemon / limit);

    // Verificar si la página actual excede el número total de páginas
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    // Calcular los parámetros de la API para obtener los Pokémon de la página actual
    const offset = (currentPage - 1) * limit;
    const endpoint = `${baseURL}/pokemon?offset=${offset}&limit=${limit}`;

    const response = await fetch(endpoint);
    const data = await response.json();

    // Extraer los Pokémon de la respuesta
    data.results.forEach((pokemon) => {
      allPokemon.push(pokemon);
    });

    return allPokemon;
  } catch (error) {
    throw new Error("Error en la obtención de los Pokémon");
  }
};

const getPokemonInfo = async (pokemonUrl) => {
  try {
    const response = await fetch(pokemonUrl);
    const pokemonData = await response.json();
    return pokemonData;
  } catch (error) {
    throw new Error("Error en la obtención de la información del Pokémon");
  }
};

const renderPokemonList = async (pokemonList) => {
  const pokemonListElement = document.getElementById("pokemon-list");
  pokemonListElement.innerHTML = "";

  for (const pokemon of pokemonList) {
    const listItem = document.createElement("li");
    const name = document.createElement("span");
    const image = document.createElement("img");

    name.textContent = pokemon.name;

    const pokemonData = await getPokemonInfo(pokemon.url);

    listItem.addEventListener("click", () => {
      openModal(pokemonData);
    });

    const imageSrc = pokemonData.sprites.front_default;
    image.src = imageSrc;

    listItem.appendChild(image);
    listItem.appendChild(name);
    pokemonListElement.appendChild(listItem);
  }
};

const renderPagination = () => {
  const paginationElement = document.getElementById("pagination");
  paginationElement.innerHTML = "";

  // Calcular el número total de páginas
  const totalPages = Math.ceil(totalPokemon / limit);

  // Crear los enlaces de paginación
  for (let i = 1; i <= totalPages; i++) {
    const pageLink = document.createElement("span");
    pageLink.textContent = i;
    pageLink.classList.add("page-link");
    if (i === currentPage) {
      pageLink.classList.add("active");
    }

    pageLink.addEventListener("click", () => {
      currentPage = i;
      getAllPokemon()
        .then((allPokemon) => {
          renderPokemonList(allPokemon);
          renderPagination();
        })
        .catch((error) => {
          console.error(error);
        });
    });

    paginationElement.appendChild(pageLink);
  }
};

const openModal = (pokemonData) => {
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");
  const modalClose = document.getElementById("modal-close");
  const pokemonInfo = document.getElementById("pokemon-info");

  pokemonInfo.innerHTML = `
          <h2>${pokemonData.name}</h2>
          <img src="${pokemonData.sprites.front_default}" alt="${
    pokemonData.name
  }">
          <p>ID: ${pokemonData.id}</p>
          <p>Height: ${pokemonData.height}</p>
          <p>Weight: ${pokemonData.weight}</p>
          <p>Types: ${pokemonData.types
            .map((type) => type.type.name)
            .join(", ")}</p>
        `;

  modal.style.display = "block";

  modalClose.addEventListener("click", closeModal);
  window.addEventListener("click", outsideClick);

  function closeModal() {
    modal.style.display = "none";
    modalClose.removeEventListener("click", closeModal);
    window.removeEventListener("click", outsideClick);
  }

  function outsideClick(event) {
    if (event.target === modal) {
      closeModal();
    }
  }
};

getAllPokemon()
  .then((allPokemon) => {
    renderPokemonList(allPokemon);
    renderPagination();
  })
  .catch((error) => {
    console.error(error);
  });
