const apiKey = `2d9b09aed15c6d5d9188fa30f2124ab6`;

// get elements from html
const form = document.querySelector(`form`);
const weatherDiv = document.querySelector(`#infoWeather`);
const weatherHoursDiv = document.querySelector(`#infoWeatherHours`);
const errorH3 = document.querySelector(`#error`);
const body = document.querySelector(`body`);
const h3City = document.querySelector(`#putCityName`);

// add event to submit button 
form.addEventListener(`submit`, function (event) {
    event.preventDefault();
    // make website clear after every  new search
    weatherDiv.innerHTML = ``;
    weatherHoursDiv.innerHTML = ``;
    h3City.innerText = ``;
    errorH3.innerText = ``;

    // take the citys name from search bar put into variable
    const inputCity = document.querySelector(`#city`);
    const city = inputCity.value;
    form.reset();

    const lonLatUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;

    fetch(lonLatUrl)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw `Something went wrong`;
            }
        })
        .then(findLonLatToGetCityName);
});

// take lon and lat into variables to get city info
function findLonLatToGetCityName(lonLat) {
    if (lonLat[0] == undefined) {
        errorH3.innerText = `Cannot find the city`;
    } else {
        const lat = lonLat[0].lat;
        const lon = lonLat[0].lon;

        h3City.innerText = lonLat[0].name;

        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        fetch(currentWeatherUrl)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw `Something went wrong`;
                }
            })
            .then(createListOfInfoCurrentWeather)
            .catch(handleError);

        const weatherEveryThreeHoursUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        fetch(weatherEveryThreeHoursUrl)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw `Something went wrong`;
                }
            })
            .then(createDivWithInfoWeatherEveryThreeHours)
            .catch(handleError);
    }
}

// put info of current weather into a list (if temp higher than 15 make text red otherwise blue)
function createListOfInfoCurrentWeather(currentWeather) {
    const allInfoWeatherArr = [
        currentWeather.weather[0].description,
        currentWeather.main.temp + ` celsius`,
        currentWeather.wind.speed + ` m/s`,
    ];

    const ul = document.createElement(`ul`);
    weatherDiv.append(ul);

    for (let i = 0; i < allInfoWeatherArr.length; i++) {
        const li = document.createElement(`li`);
        ul.append(li);
        li.innerText = allInfoWeatherArr[i];

        if (currentWeather.main.temp < 15) {
            li.style.color = `blue`;
        } else {
            li.style.color = `red`;
        }
    }

    const img = document.createElement(`img`);
    weatherDiv.append(img);
    const imgUrl = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`;
    img.src = imgUrl;
}

// add event to select 3h, 6h, 9h, 12h (show temp and icon)
function createDivWithInfoWeatherEveryThreeHours(weatherHoursObj) {
    const selectHours = document.querySelector(`#selectHours`);

    selectHours.addEventListener(`change`, (event) => {
        const chosenHour = event.target.value;

        weatherHoursDiv.innerHTML = ``;

        let hours = 0;

        for (let i = 0; i < chosenHour; i++) {
            hours += 3;

            // create a div for every 3 hours with p for time and p for temp and img for icon in the div
            const prognosisDiv = document.createElement(`div`);
            weatherHoursDiv.append(prognosisDiv);

            const showTime = document.createElement(`p`);
            prognosisDiv.append(showTime);

            const tempHours = document.createElement(`p`);
            prognosisDiv.append(tempHours);

            showTime.innerText = hours + ` h`;

            tempHours.innerText =
                weatherHoursObj.list[i].main.temp + ` celcius`;

            const imgHours = document.createElement(`img`);
            prognosisDiv.append(imgHours);
            const imgHoursUrl = `https://openweathermap.org/img/wn/${weatherHoursObj.list[i].weather[0].icon}@2x.png`;
            imgHours.src = imgHoursUrl;

            if (weatherHoursObj.list[i].main.temp < 15) {
                tempHours.style.color = `blue`;
            } else {
                tempHours.style.color = `red`;
            }
        }
    });
}

function handleError(error) {
    errorH3.innerText = error;
}
