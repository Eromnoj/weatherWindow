const currentDisplay = document.querySelector('.currentWeather')
const forecastDisplay = document.querySelectorAll('.forecastDay')
const fullscreen = document.querySelector('.fullscreen')
const weatherForecast = document.querySelector('.weatherForecast')
const form = document.querySelector('.changeCity')
const city = document.querySelector('#city')
const video = document.querySelector('.video')
const cityInput = document.querySelector('#cityId')
const closeModal = document.querySelector('#closeModal')
const openModal = document.querySelector('#openModal')
const instruction = document.querySelector('.instruction')
let currentWeather = {}
let forecast = []

const formatTemp = (temp) => { //petite fonction pour formater la température
  return `${Math.round(temp)} °C`
}

const createForcast = () => { // fonction qui sera appelée dans la fonction getData, permet le formattage des données récupérées pour l'affichage
  setTimeout(() => {
  //astuce pour que la video puisse se lancer après le changement des informations
    video.pause()  // on pause
    video.innerHTML = `<source src="ressources/icons/${currentWeather.icon}.mp4" type="video/mp4">` //on change de fichier
    video.load() // on charge
    video.play() // et on joue
    currentDisplay.innerHTML = `
    <div class="bigTemp cell"><p>${currentWeather.temperature}</p></div>
    <div class="bigWeather cell"><p>${currentWeather.weather}</p></div>
    <div class="city cell"><h2>${currentWeather.city}</h2></div>`

    forecast.forEach((e, index) => {
      forecastDisplay[index].innerHTML = `<div class="date mincell"><h4>${e.date}</h2></div>
      <div class="littleIcon"><img src="ressources/icons/${e.icon}.svg" alt=""></div>
      <div class="littleTemp mincell"><p>${e.temperature}</p></div>
      <div class="littleWeather mincell"><p>${e.weather}</p></div>`
    })
  }, 500)

}

const history = (parent, value) => { //fonction pour constituer un historique des villes consultées durant la session, appelée dans getData
  let checkTable = []
  Array.from(parent.children).forEach(child => { // on regarde si la ville ne s'y trouve pas déjà /!\ .children renvoie une nodeList qu'il faut convertir en tableau, d'où l'utilisation de Array.from

    console.log(child.value + " " + value) // en parcourant l'ensemble des enfants de select
    if (child.value === value) { //si la value d'une des options est identique à l'ID recherché on rempli le tableau
      checkTable.push(true)
      console.log(checkTable)

    }
  })
  if (checkTable.length === 0) { //si le tableau est, ce qui veut dire que la ville ne s'y trouve pas déjà on crée une nouvelle option qu'on ajoute à la suite
    let option = document.createElement('option')
    option.value = value
    console.log(currentWeather.city)
    option.textContent = currentWeather.city
    parent.appendChild(option)
  }
}

const getData = (cityId = '2987914') => { //fonction qui récupère les données depuis l'API de openweathermap avec Fetch() en fonction de l'ID de la ville 
  fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&units=metric&lang=fr&appid=71364b0781d03bc97f495d5722900a5e`)
    .then(response => { return response.json() })
    .then(data => {
      currentWeather = {// on remplit l'objet currentWeather avec les données récupérées
        city: data.city.name,
        temperature: formatTemp(data.list[0].main.temp),
        weather: data.list[0].weather[0].description,
        icon: data.list[0].weather[0].icon
      }
      for (let i = 0; i < data.list.length; i++) {// boucle pour les prévisions
        if (data.list[i].dt % 86400 === 43200) { // l'API renvoie une prévision pour toutes les 3 heures, on fait un modulo pour ne recupérerer qu'une prévision toutes les 24h 
          forecast.push({                        // se base uniquement sur le timestamp donc l'heure de la prévision sera toujours à midi heure française quelque soit le pays
            date: dayjs(data.list[i].dt_txt).locale('fr').format('D MMM YYYY'),
            temperature: formatTemp(data.list[i].main.temp),
            weather: data.list[i].weather[0].description,
            icon: data.list[i].weather[0].icon
          })
        }
      }

      history(city, cityId)
      createForcast()
    })
    .catch((err) => { //on affiche une alerte si il y a eu un problème dans la requête
      alert('Mauvais identifiant, mauvais ID, ou serveur injoignable ' + err)
    })
}

getData() //on appelle une première fois getData au lancement de la page

city.addEventListener('change', () => { //Quand on change de ville dans le menu déroulant, on remplit l'input avec la value
  cityInput.value = city.value
})

form.addEventListener('submit', e => {//on envoit une nouvelle requête avec la value de l'input
  e.preventDefault()                  //on réinitialise le tableau et l'objet qui récolteront les résultats de la requête
  currentWeather = {}
  forecast = []
  getData(cityInput.value)
})

closeModal.addEventListener('click', () => { //fermeture de la fenêtre d'instruction
  instruction.style.display = 'none'
})

openModal.addEventListener('click', () => {//ouverture de la fenêtre d'instruction
  instruction.style.display = 'flex'
})
