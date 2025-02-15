let url = "https://pokeapi.co/api/v2/pokemon/";

let content = document.getElementById("content");

let currentPokemon;
let currentPokemonSpecies;
let currentPokemonEvolution;

let is_loadPokemon_finish = false;
let is_DetailviewHide_active = false;

let pokeID;
let pokeCounter = 0;

/* types */
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


/* Loading Screen */
async function loadingScreen(toLoadedGen) {
  document.getElementById("tool").innerHTML = generateLoadingScreenHTML();
  await toLoadedGen;
  document.getElementById("loadingScreen").classList.add("display-none");
}

/* load more Pokemon */
let is_loading = false;

window.addEventListener("scroll", function () {
  if (
    !is_loading &&
    window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    is_loading = true;
    loadNext20tool();
    is_loading = false;
  }
});

/* hilfe funktion */
async function loadNext20tool() {
  if (pokeCounter >= 1016) {
    pokeCounter = 1;
  }
  if (!pokeCounter == 0) {
    pokeID = 1;
    for (let i = 1; i < 21; i++) {
      pokeCounter++;
      await loadNext(pokeCounter);
      content.innerHTML += generateSectionHtml();
      renderPokemon();
      pokeID++;
    }
    pokeID--;
  } else {
    pokeCounter = 1;
  }
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

/* detail view */
async function changeToClickedEvolution(pokemonOrId) {
  await loadPokemon(`${pokemonOrId}`);
  renderPokemonDetailViewName();
  renderType();
  renderStats();
  selectNavItem(0);
}

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

function closeDetailView() {
  if (is_DetailviewHide_active == true) {
    hideDetailView();
  }
  selectNavItem(0);
  renderStats();
}

async function openDetailView(pokeId) {
  displayDetailView();
  await loadPokemon(`${pokeId}`);
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

/* load functions */
async function loadFirst(number) {
  pokeCounter = 1;
  pokeID = 1;
  content.innerHTML = "";
  for (let i = 1; i < number + 1; i++) {
    await loadPokemon(i);
    content.innerHTML += generateSectionHtml();
    renderPokemon();
    updateProgressBar(number);
    pokeID++;
  }
  pokeID--;
}

let is_searchPokemon_active = false;

async function searchPokemonOnChange() {
  let searchInput = document.getElementById("search-input");
  if (searchInput.value == ``) {
    content.innerHTML = `<div><h2>Es gibt keine namenlose Pokemon :/</h2></div>`;
  } else {
    if (searchInput.value.length > 1 && !is_searchPokemon_active) {
      is_searchPokemon_active = true;
      await searchPokemon();
    }
    is_searchPokemon_active = false;
  }
}

    /* help function */
    let searchPokemonTimer; 

    function searchPokemonOnKeyDown() {
      clearTimeout(searchPokemonTimer);
      searchPokemonTimer = setTimeout(() => {
        searchPokemonOnChange();
      }, 500);
    }

async function searchPokemon() {
  let searchInput = document.getElementById("search-input");
  content.innerHTML = ``;
  for (let i = 0; i < pokemonNames.length; i++) {
    if (pokemonNames[i].toLowerCase().includes(searchInput.value)) {
      await loadPokemon(pokemonNames[i]);
      content.innerHTML += generateSectionHtml();
      renderPokemon();
    }
  }
  if (content.innerHTML == ``) {
    content.innerHTML = `<div><h2>Leider keine Pokemon unter diesen Namen gefunden :/</h2></div>`
  }
}

async function loadPokemon(pokemonOrId) {
  let response = await fetch(`${url + `${pokemonOrId}`}`);
  let responseAsJson = await response.json();
  currentPokemon = responseAsJson;
  pokeID = pokemonOrId;
  pokeCounter = parseInt(currentPokemon["id"]);
}

async function loadNext(pokemonOrId) {
  if (pokeCounter >= 1017) {
    pokeCounter = 0;
  }
  let response = await fetch(`${url + `${pokemonOrId}`}`);
  let responseAsJson = await response.json();
  currentPokemon = responseAsJson;
  pokeID = pokemonOrId;
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

/* Pokemon render functions */
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

let is_pokemon_rendering = false;

function renderPokemon() {
  if (!is_pokemon_rendering) {
    is_pokemon_rendering = true;
    let section = document.getElementById(`searched-pokemon-data${pokeID}`);
    section.innerHTML += `<div class="dpflex"><h1 class="m-t16">${currentPokemon["name"]} #${currentPokemon["id"]}</h1></div>`;
    section.innerHTML += `<img class="m-t16 m-b16" src="${currentPokemon["sprites"]["front_default"]}">`;
  }
  is_pokemon_rendering = false;
}

/* generate html funktionen */
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

function generateSectionHtml() {
  let html = `
    <section class="section-margin section-HTML">
        <div onclick="openDetailView('${pokeID}')" id="searched-pokemon-data${pokeID}" class="section-content-pokemon-div dpflex-column m-t16">
        
        </div>
    </section>
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

function generateLoadingScreenHTML() {
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
