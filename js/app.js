const url = 'https://pokeapi.co/api/v2';
const category = 'pokemon';

const form = document.querySelector('form');
const input = document.querySelector('input');

const name = document.querySelector("#name");
const img = document.querySelector("#image");
const type = document.querySelector("#type");
const height = document.querySelector("#height");
const weight = document.querySelector("#weight");
const abilities = document.querySelector("#abilities");

const xhr = new XMLHttpRequest();

const apiPokemon = (pokemonName) => {
    xhr.open('GET', `${url}/${category}/${pokemonName}`);
    xhr.send();

    return new Promise((resolve, reject) => {
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const data = JSON.parse(xhr.response);
                    resolve(data);
                } else {
                    reject(new Error('Error en la petición'));
                }
            }
        };
    });
};

apiPokemon('pikachu')
    .then(response => {
        console.log(response);
        return format(response); // Devolver el resultado de format()
    })
    .catch(err => console.error(err));

const format = data => {
    let abilitiesArr = data.abilities.map(
        ability => ability.ability.name.replace("-", " ")
    ).join(", ");

    name.textContent = `${data.name.replace('-', ' ')}`;
    image.innerHTML = `<img src=${data.sprites.front_default}>`;
    type.textContent = `${data.types[0].type.name}`;
    height.textContent = `${Math.round(data.height / 3)}'`;
    weight.textContent = `${Math.round(data.weight / 4)}lbs`;
    abilities.textContent = `${abilitiesArr}`;
};

function search(e) {
    e.preventDefault();
    let pokemonName = input.value.toLowerCase().trim().replace('.', '').replace(' ', '-');

    this.reset();
    apiPokemon(pokemonName)
        .then(response => format(response))
        .catch(err => console.error(err));
}

form.addEventListener('submit', search);
