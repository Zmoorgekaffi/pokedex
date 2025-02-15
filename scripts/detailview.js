let types = [
    {
        bug: "rgb(135,148,22)",
        dark: "rgb(60,47,34)",
        dragon: "rgb(111,91,213)",
        electric: "rgb(248,184,23)",
        fairy: "rgb(225,146,223)",
        fighting: "rgb(128,53,26)",
        fire: "rgb(197,35,2)",
        flying: "rgb(110,134,220)",
        ghost: "rgb(94,95,172)",
        grass: "rgb(112,195,54)",
        ground: "rgb(208,177,85)",
        ice: "rgb(152,227,249)",
        normal: "rgb(198,191,181)",
        poison: "rgb(149,73,151)",
        psychic: "rgb(220,74,123)",
        rock: "rgb(183,161,86)",
        steel: "rgb(182,182,196)",
        water: "rgb(33,130,220)",
    },
];

/* detail view */
async function openDetailView(id) {
    displayDetailView();
    await loadPokemon(`${id}`);
    renderPokemonDetailViewName();
    renderType();
    renderStats();
}

function displayDetailView() {
    const backgroundDiv = document.querySelector(
        ".pokemon-detail-view_background-div"
    );
    const frame = document.querySelector(".pokemon-detail-view_frame");

    backgroundDiv.classList.remove("display-none");
    frame.classList.remove("display-none");
    backgroundDiv.classList.add("animateOpacity");
    frame.classList.add("animateOpacity");

    is_DetailviewHide_active = true;
}

function closeDetailView() {
    if (is_DetailviewHide_active == true) {
        hideDetailView();
    }
    selectNavItem(0);
    renderStats();
}

function hideDetailView() {
    const backgroundDiv = document.querySelector(
        ".pokemon-detail-view_background-div"
    );
    const frame = document.querySelector(".pokemon-detail-view_frame");
    backgroundDiv.classList.add("display-none");
    frame.classList.add("display-none");
    backgroundDiv.classList.remove("animateOpacity");
    frame.classList.remove("animateOpacity");

    is_DetailviewHide_active = true;
}

async function changeToClickedEvolution(pokemonOrId) {
    await loadPokemon(`${pokemonOrId}`);
    renderPokemonDetailViewName();
    renderType();
    renderStats();
    selectNavItem(0);
  }

/* selsect nav item */
function selectNavItem(p_1til3) {
    let navDivs = ["stats-a-div", "abilitys-a-div", "evolutions-a-div"];
    let navAs = ["nav-a-stats", "nav-a-abilitys", "nav-a-evolutions"];
    let toSelectedDiv = document.getElementById(`${navDivs[p_1til3]}`);
    let toSelectedA = document.getElementById(`${navAs[p_1til3]}`);

    for (let i = 0; i < navDivs.length; i++) {
        let navDiv = document.getElementById(`${navDivs[i]}`);
        navDiv.classList.remove("highlight-link-div-border");
    }

    for (let i = 0; i < navAs.length; i++) {
        let navDiv = document.getElementById(`${navAs[i]}`);
        navDiv.classList.remove("color-red");
    }

    toSelectedDiv.classList.add("highlight-link-div-border");
    toSelectedA.classList.add("color-red");
}

/* load pokemon info */
let currentPokemon;
let currentPokemonSpecies;
let currentPokemonEvolution;

async function loadPokemon(pokemonOrId) {
    let response = await fetch(`${url + `${pokemonOrId}`}`);
    let responseAsJson = await response.json();
    currentPokemon = responseAsJson;
    pokeID = pokemonOrId;
    pokeCounter = parseInt(currentPokemon["id"]);
}

async function loadPokemonEvo() {
    await loadSpecies(`${currentPokemon["species"]["url"]}`);
    await loadEvolution(`${currentPokemonSpecies["evolution_chain"]["url"]}`);
}

async function loadSpecies(urlLink) {
    let response = await fetch(urlLink);
    let responseAsJson = await response.json();
    currentPokemonSpecies = responseAsJson;
}

async function loadEvolution(urlLink) {
    let response = await fetch(urlLink);
    let responseAsJson = await response.json();
    currentPokemonEvolution = responseAsJson;
}

/* render functions */
function renderPokemonDetailViewName() {
    document.querySelector(".pokemon-detail-view_frame img").src =
        currentPokemon["sprites"]["front_default"];
    document.getElementById("detail-view-pokeName").innerHTML =
        currentPokemon["name"] + ` #${currentPokemon["id"]}`;
}

async function renderEvolutions() {
    await loadSpecies(`${currentPokemon["species"]["url"]}`);
    await loadEvolution(`${currentPokemonSpecies["evolution_chain"]["url"]}`);
    let display = document.getElementById("detail-view_render-content");

    display.innerHTML = ``;
    display.innerHTML = `<h2>Evolutions</h2>`;
    display.innerHTML += `<div class="dpflex w100" id="evoPic-frame" style="flex-grow: 1;"></div>`;

    let evoPicFrame = document.getElementById("evoPic-frame");
    let currentPoke = currentPokemonEvolution["chain"]["evolves_to"][0];

    await loadPokemon(currentPokemonEvolution["chain"]["species"]["name"]);
    evoPicFrame.innerHTML += await generateEvoImage(
        currentPokemonEvolution["chain"]["species"]["name"]
    );

    while (currentPoke) {
        evoPicFrame.innerHTML += generateEvoArrow();
        await loadPokemon(currentPoke["species"]["name"]);
        evoPicFrame.innerHTML += await generateEvoImage(
            currentPoke["species"]["name"]
        );
        currentPoke = currentPoke["evolves_to"][0];
    }
}

function renderAbilitys() {
    document.getElementById("detail-view_render-content").innerHTML = ``;
    document.getElementById(
        "detail-view_render-content"
    ).innerHTML = `<h2>Abilitys</h2>`;
    for (let i = 0; i < currentPokemon["abilities"].length; i++) {
        document.getElementById("detail-view_render-content").innerHTML +=
            generateAbilitysHTML(i);
    }
}

function renderStats() {
    document.getElementById("detail-view_render-content").innerHTML = ``;
    document.getElementById(
        "detail-view_render-content"
    ).innerHTML = `<h2>Base Stats</h2>`;
    for (let i = 0; i < currentPokemon["stats"].length; i++) {
        document.getElementById("detail-view_render-content").innerHTML +=
            generateStatsHTML(i);
    }
}

function renderType() {
    pokeCounter = 0;
    let detailViewFrame = document.getElementById("type-frame");
    detailViewFrame.innerHTML = ``;

    if (currentPokemon["types"].length < 2) {
        detailViewFrame.innerHTML += generateTypeHTML(pokeCounter, 0);
    } else {
        for (let i = 0; i < currentPokemon["types"].length; i++) {
            detailViewFrame.innerHTML += generateTypeHTML(pokeCounter, i);
            pokeCounter++;
        }
    }
}

/* generate HTML */
function generateEvoArrow() {
    let html =
        '<img class="evoArrow" src="./img/angles-right-solid.svg" alt="to"></img>';
    return html;
}

async function generateEvoImage(pokemonName) {
    await loadPokemon(`${pokemonName}`);
    let html = `
          <img style="cursor: pointer;" onclick="changeToClickedEvolution('${pokeID}')" src="${currentPokemon["sprites"]["front_default"]}" alt="">
      `;
    return html;
}

function generateAbilitysHTML(i) {
    let html = `
          <p><b>Name: ${currentPokemon["abilities"][i]["ability"]["name"]}</b></p>
      `;
    return html;
}

function generateStatsHTML(i) {
    let html = `
          <p><b>${currentPokemon["stats"][i]["stat"]["name"]}: ${currentPokemon["stats"][i]["base_stat"]}</b></p>
      `;
    return html;
}

function generateTypeHTML(pokeCounter, i) {
    let html = `
          <div style="background: ${types[0][currentPokemon["types"][i]["type"]["name"]]
        }; background-image: linear-gradient(0deg, rgba(0,0,0,0.4), rgba(0,0,0,0));" id="${pokeCounter}" class="type">
             <b>${currentPokemon["types"][i]["type"]["name"]}</b>
          </div>
      `;
    return html;
}

/* arrow */
function scrollToHeader() {
    document.getElementById("header").scrollIntoView({ behavior: "smooth" });
  }
  
  window.addEventListener("scroll", () => {
    const arrow = document.getElementById("arrow");
    const header = document.getElementById("header");
    const headerRect = header.getBoundingClientRect();
  
    if (headerRect.bottom < 0) {
      arrow.classList.remove("display-none");
    } else {
      arrow.classList.add("display-none");
    }
  });


