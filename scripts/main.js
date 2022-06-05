const currentDisplay = document.querySelector('.currentWeather')
const forecastDisplay = document.querySelectorAll('.forecastDay')
const fullscreen = document.querySelector('.fullscreen')
const weatherForecast = document.querySelector('.weatherForecast')
const form = document.querySelector('.changeCity')
const city = document.querySelector('#city')
const video = document.querySelector('.video')
const cityInput = document.querySelector('#cityId')
let currentWeather = {}
let forecast = []

const formatTemp = (temp) => {
  return `${Math.round(temp)} °C`
}

const createForcast = () => {
  setTimeout(() => {
    video.pause()
    video.innerHTML = `<source src="ressources/icons/${currentWeather.icon}.mp4" type="video/mp4">`
    video.load()
    video.play()
    currentDisplay.innerHTML = `
    <div class="bigTemp cell"><p>${currentWeather.temperature}</p></div>
    <div class="bigWeather cell"><p>${currentWeather.weather}</p></div>
    <div class="city cell"><h2>${currentWeather.city}</h2></div>`

    forecast.forEach((e, index) => {
      forecastDisplay[index].innerHTML = `<div class="littleIcon"><img src="ressources/icons/${e.icon}.svg" alt=""></div>
      <div class="littleTemp mincell"><p>${e.temperature}</p></div>
      <div class="littleWeather mincell"><p>${e.weather}</p></div>
      <div class="date mincell"><h4>${e.date}</h2></div>`
    })
  }, 500)

}

const history = (parent, value) => {
  let checkTable = []
  Array.from(parent.children).forEach(child => {

    console.log(child.value + " " + value)
    if (child.value === value) {
      checkTable.push(true)
      console.log(checkTable)

    }
  })
  if (checkTable.length === 0) {
    let option = document.createElement('option')
    option.value = value
    console.log(currentWeather.city)
    option.textContent = currentWeather.city
    parent.appendChild(option)
  }
}

const getData = (cityId = '2987914') => {
  fetch(`http://api.openweathermap.org/data/2.5/forecast?id=${cityId}&units=metric&lang=fr&appid=71364b0781d03bc97f495d5722900a5e`)
    .then(response => { return response.json() })
    .then(data => {
      currentWeather = {
        city: data.city.name,
        temperature: formatTemp(data.list[0].main.temp),
        weather: data.list[0].weather[0].description,
        icon: data.list[0].weather[0].icon
      }
      for (let i = 0; i < data.list.length; i++) {
        if (data.list[i].dt % 86400 === 43200) {
          forecast.push({
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
    .catch(() => {
      alert('Mauvais identifiant')
      getData()
    })
}

getData()

city.addEventListener('change', () => {
  cityInput.value = city.value
})

form.addEventListener('submit', e => {
  e.preventDefault()
  currentWeather = {}
  forecast = []
  getData(cityInput.value)
})


