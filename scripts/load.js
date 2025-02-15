/* load */
let url = "https://pokeapi.co/api/v2/pokemon/";
let PokemonInfo = [];
let content = document.getElementById('content');

async function loadPokemonFromServer(pokemonOrId) {
    is_loading = true;
    let response = await fetch(`${url}${pokemonOrId}`);
    let responseAsJson = await response.json();

    let pokemonData = {
        id: responseAsJson.id,
        name: responseAsJson.name,
        img: responseAsJson["sprites"]["front_default"],
    };
    is_loading = false;
    PokemonInfo.push(pokemonData);
    pokemonID = parseInt(pokemonData.id);
}

/* help functions */
let pokemonID = 1;
let maxNumberOfExistingPokemon = 1017;
let is_currently_loading_the_next20 = false;

async function loadNext20() {
    if (is_currently_loading_the_next20 === false && pokemonID <= 1017) {
        is_currently_loading_the_next20 = true;
        for (let i = 0; i < 20; i++) {
            pokemonIdCheck();
            await loadPokemonFromServer(pokemonID);
            content.innerHTML += generateSectionHtml();
            await renderPokemon(pokemonID);
            updateProgressBar(20);
            pokemonID++;
        }
        is_currently_loading_the_next20 = false;
    }
}

function pokemonIdCheck() {
    if (pokemonID >= 1018) {
        pokemonID = 1;
    }
}

function setPokemonIDto1() {
    pokemonID = 1;
}

/* load more Pokemon */
let was_scrolled_at_bottom = false;

window.addEventListener("scroll", async function () {
    if (!was_scrolled_at_bottom && window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        was_scrolled_at_bottom = true;

        await loadNext20();
        was_scrolled_at_bottom = false;
    }
});

async function checkIfPokemonIsInArray(id) {
    let foundPokemon = PokemonInfo.find(pokemon => pokemon.id === id);
    if (foundPokemon === undefined) {
        await loadPokemonFromServer(id);
    } else {
        return true;
    }
}

/* search Pokemon */
let searchPokemonTimer = null;

async function searchPokemonOnKeyDown() {
    if (searchPokemonTimer) {
        clearTimeout(searchPokemonTimer);
    }

    searchPokemonTimer = setTimeout(async () => {
        await searchPokemonOnChange();
        searchPokemonTimer = null;
    }, 500);
}

async function searchPokemonOnChange() {
    let searchInput = document.getElementById("search-input");
    if (searchInput.value == ``) {
        content.innerHTML = `<div><h2>Es gibt keine namenlose Pokemon :/</h2></div>`;
    } else {
        if (searchInput.value.length > 1) {
            await searchPokemon();
            pokemonID++;
        }
    }
}

async function searchPokemon() {
    let searchInput = document.getElementById("search-input");
    searchInput = searchInput.value.toLowerCase();
    content.innerHTML = ``;
    for (let i = 0; i < pokemonNames.length; i++) {
        if (pokemonNames[i].includes(searchInput)) {
            await loadPokemonFromServer(pokemonNames[i]);
            content.innerHTML += generateSectionHtml();
            await renderPokemon(pokemonID);
        }
    }
    if (content.innerHTML == ``) {
        content.innerHTML = `<div><h2>Leider keine Pokemon unter diesen Namen gefunden :/</h2></div>`

    }
}

/* render functions */
let is_pokemon_rendering = false;

async function renderPokemon(id) {
    if (await checkIfPokemonIsInArray(id)) {
        is_pokemon_rendering = true;
        let toRenderedPokemon = PokemonInfo.find(pokemon => pokemon.id === id);
        let section = document.getElementById(`searched-pokemon-data${sectionID}`); 
        section.innerHTML += `<div class="dpflex"><h1 class="m-t16">${toRenderedPokemon.name} #${toRenderedPokemon["id"]}</h1></div>`;
        section.innerHTML += `<img class="m-t16 m-b16" src="${toRenderedPokemon.img}">`;
        sectionID++; 
    }
    is_pokemon_rendering = false;
}

/* HTML genration */
let sectionID = 0; 

function generateSectionHtml() {
    let html = `
      <section class="section-margin section-HTML">
          <div onclick="openDetailView('${pokemonID}')" id="searched-pokemon-data${sectionID}" class="section-content-pokemon-div dpflex-column m-t16">
          
          </div>
      </section>
      `; 
    return html;
}

function generateLoadingScreenHTML() {
    content.innerHTML = ``;
    sectionID = 0;
    let html = ` 
           <div id="loadingScreen">
              <svg xmlns="http://www.w3.org/2000/svg" width="300" height="40" viewBox="0 0 300 40">
              <!-- Hintergrund des Ladebalkens -->
              <rect x="0" y="0" width="100%" height="100%" fill="#eee" />
  
              <!-- Fortschrittsbalken -->
              <rect id="progressBar" x="0" y="0" width="0%" height="100%" fill="#ffcc00">
      
              </rect>
  
              <!-- Textanzeige des Fortschritts (optional) -->
              <text x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" fill="#333" font-size="16">
                Loading...
              </text>
          </svg>`;
    return html;
}

/* Loading Screen */
async function loadingScreen(toLoadedGen) {
    document.getElementById("tool").innerHTML = generateLoadingScreenHTML();
    await toLoadedGen;
    document.getElementById("loadingScreen").classList.add("display-none");
}

/* Progressbar */
let progress = 0;

function updateProgressBar(howManyPokemonsWhereLoaded) {
    if (progress < 100) {
        let progressBar = document.getElementById("progressBar");
        progress += 100 / howManyPokemonsWhereLoaded;
        progressBar.style.width = progress + "%";
    } else {
        progress = 0;
        updateProgressBar(howManyPokemonsWhereLoaded);
    }
}

/* lock aand unlock display */
let inputField = document.getElementById('search-input');
function lockInput() {
    if (searchPokemonTimer && inputField.value == ``) {
        inputField.disabled = true;
    }

}

function unlockInput() {
    inputField.disabled = false;
}