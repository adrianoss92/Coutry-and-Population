let tabCountries = null;
let tabFavorites = null;

let allCountries = [];
let favoriteCountries = [];

let countContries = 0;
let countFavorites = 0;

let totalPopulationList = 0;
let totalPopulationFavorites = 0;

let numberFormat = null;

window.addEventListener('load', () => {
  tabCountries = document.querySelector('#tabCountries')
  tabFavorites = document.querySelector('#tabFavorites')

  countContries = document.querySelector('#countContries')
  countFavorites = document.querySelector('#countFavorites')

  totalPopulationList = document.querySelector('#totalPopulationList')
  totalPopulationFavorites = document.querySelector('#totalPopulationFavorites')

  numberFormat = Intl.NumberFormat('pt-BR');

  fetchCountriess();
})

async function fetchCountriess(){  // Buscando dados e montando a lista de paises com os campos desejados
  const response = await fetch('https://restcountries.eu/rest/v2/all')
  const json = await response.json();
  allCountries = await json.map(pais => {

    const {numericCode, translations, population, flag} = pais;

    return {
      id: numericCode,
      name: translations.pt,
      population,
      formatNumberPopulation: formatNumber(population),
      flag
    }
  })

  console.log(allCountries)
  render();
}

function render(){
  renderCountryList();
  renderSummary();
  renderFavorites();
  handlerCountryButtons();
}

function renderCountryList(){
  let countriesHTML = '<div>';

  allCountries.forEach(pais => {
    const {id, name, flag, population, formatNumberPopulation} = pais;

    const countryHTML = `
      <div class="country">
        <div>
          <a id="${id}" class="waves-effect waves-light btn">+</a>
        </div>
        <div>
          <img src="${flag}" alt="${name}">
        </div>
        <div>
          <ul>
            <li>${name}</li>
            <li>${formatNumberPopulation}</li>
          </ul>
        </div>
      </div>
    `;
    countriesHTML += countryHTML; 
  })
  tabCountries.innerHTML = countriesHTML;

  countriesHTML += '</div>'
}

function renderFavorites(){
  let favortiesHTML = '<div>'

    favoriteCountries.forEach(pais => {
      const {id, name, flag, population, formatNumberPopulation} = pais;

      const favorityCountryHTML = `
        <div class="country">
          <div>
            <a id="${id}" class="waves-effect waves-light btn red darken-4">-</a>
          </div>
          <div>
            <img src="${flag}" alt="${name}">
          </div>
          <div>
            <ul>
              <li>${name}</li>
              <li>${formatNumberPopulation}</li>
            </ul>
          </div>
        </div>
      `;
      favortiesHTML += favorityCountryHTML; 
    })

  favortiesHTML += '</div>'

  tabFavorites.innerHTML = favortiesHTML;
}

function renderSummary(){
  countContries.textContent = allCountries.length;
  countFavorites.textContent = favoriteCountries.length;

  const totaPopulation = allCountries.reduce((acumulador, corente) => {
    return acumulador + corente.population
  }, 0)

  const totalPopulationFavority = favoriteCountries.reduce((acumulador, corente) => {
    return acumulador + corente.population
  }, 0);

  totalPopulationList.textContent = formatNumber(totaPopulation);
  totalPopulationFavorites.textContent = formatNumber(totalPopulationFavority);
}

function handlerCountryButtons(){
  const countryButtons = Array.from(tabCountries.querySelectorAll('.btn'));
  const favoriteButtons = Array.from(tabFavorites.querySelectorAll('.btn'));
  
  countryButtons.forEach(button => {
    button.addEventListener('click', () => addToFavorites(button.id));
  });

  favoriteButtons.forEach(button => {
    button.addEventListener('click', () => removeFromFavorites(button.id));
  });
}

function addToFavorites(id){
  const countryToAdd = allCountries.find( pais => pais.id === id); //Localizando o pais
  favoriteCountries = [...favoriteCountries, countryToAdd]; // Adicionando no array de paises favoritos

  favoriteCountries.sort((a, b)=> {  // Organizando a lista
    return a.name.localeCompare(b.name);
  })

  allCountries = allCountries.filter(pais => pais.id !== id);

  render();
}

function removeFromFavorites(id){

  countryToRemove = favoriteCountries.find(pais => pais.id === id);

  allCountries = [...allCountries, countryToRemove];

  allCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  })
  
  favoriteCountries = favoriteCountries.filter( pais => pais.id !== id);

  render();
}

function formatNumber(number){
  return numberFormat.format(number);
}