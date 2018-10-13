/**
 * © 2018 Justin Schlump
 * This code is licensed under MIT license (see LICENSE.txt for details)
 * 
 * This app fetches weather data using the OpenWeather API. It creates
 * a visual representation of the data in a responsive canvas window.
 */

/**
 * API HANDLING
 **/
let defaultApi = `http://api.openweathermap.org/data/2.5/weather?q=seattle&APPID=d438c6c016bcdcf60c6d2534559d8b07`;
weatherData(defaultApi);

document.getElementById("city-form").addEventListener("submit", function (e) {
    e.preventDefault();
    let city = document.getElementById("city-field").value;
    let api = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=d438c6c016bcdcf60c6d2534559d8b07`;
    weatherData(api);
});

//CANVAS VARS
let canvas = document.getElementById('game');
let context = canvas.getContext('2d');
let screenWidth = canvas.width;
let screenHeight = canvas.height;

//GLOBAL VARS
let lastTime = (new Date()).getTime();
let currentTime = 0;
let delta = 0;
let running = false;
let tempScale = 'fahrenheit';
let humidityScale = 5;
let barScale = 15;
let barWidth = 150;
let barHeight;
let barPaddingX = 20;
let barPaddingY = 10;
let textPaddingX = 50;
let textPaddingY = 25;
let barNamePadding = 10;

//API VARS
let temp;
let maxTemp;
let minTemp;
let humidity;

/**
 * FETCH DATA FROM OPENWEATHER
 */
async function weatherData(api) {
    let response = await fetch(api);
    let json = await response.json();
    console.log(json);
    temp = Math.floor(json.main.temp - 273.15);
    maxTemp = Math.floor(json.main.temp_max - 273.15);
    minTemp = Math.floor(json.main.temp_min - 273.15);
    humidity = json.main.humidity;
}

/**
 * CONVERT TEMPERATURE DATA SCALE
 */
const convert = (s, t) => {
    if (s === 'celsius') {
        barScale = 14.6;
        return t;
    } else if (s === 'fahrenheit') {
        barScale = 5;
        return Math.floor(t * 1.8 + 32);
    }
}

/**
 * INITIALIZE PROGRAM
 */
const init = () => {
    if (running) {
        return;
    } else {
        running = true;
        run();
    }
}

/**
 * MAIN LOOP
 */
const run = () => {
    if (running) {
        requestAnimationFrame(run);
        currentTime = (new Date()).getTime();
        delta = (currentTime - lastTime) / 1000 * 60;
        render();
        lastTime = currentTime;
    }
}

/**
 * RENDERING
 */
const render = () => {
    /**
     * RENDER BACKGROUND
     **/

    //DAY GRADIENT
    let dayGradient = context.createLinearGradient(0, screenHeight, 0, 100);
    dayGradient.addColorStop(0, "cyan");
    dayGradient.addColorStop(1, "blue");

    //NIGHT GRADIENT
    let nightGradient = context.createLinearGradient(0, screenHeight, 0, 100);
    nightGradient.addColorStop(0, "darkslateblue");
    nightGradient.addColorStop(1, "black");


    context.fillStyle = dayGradient;
    context.fillRect(0, 0, screenWidth, screenHeight);

    /**
     * RENDER BARS
     **/

    //MAX GRADIENT
    let maxGradient = context.createLinearGradient(0, screenHeight, 0, 10);
    maxGradient.addColorStop(0, "black");
    maxGradient.addColorStop(1, "red");

    //MIN GRADIENT
    let minGradient = context.createLinearGradient(0, screenHeight, 0, 10);
    minGradient.addColorStop(0, "black");
    minGradient.addColorStop(1, "cyan");

    //TEMP GRADIENT
    let tempGradient = context.createLinearGradient(0, screenHeight, 0, 10);
    tempGradient.addColorStop(0, "black");
    tempGradient.addColorStop(1, "orange");

    //HUMIDITY GRADIENT
    let humGradient = context.createLinearGradient(0, screenHeight, 0, 60);
    humGradient.addColorStop(0, "black");
    humGradient.addColorStop(1, "green");

    //MAXTEMP
    context.fillStyle = maxGradient;
    context.fillRect(barPaddingX, screenHeight - convert(tempScale, maxTemp) * barScale, barWidth / 2, convert(tempScale, maxTemp) * barScale);

    //TEMP
    context.fillStyle = tempGradient;
    context.fillRect((barWidth / 2) + barPaddingX, screenHeight - convert(tempScale, temp) * barScale, barWidth, convert(tempScale, temp) * barScale);

    //MINTEMP
    context.fillStyle = minGradient;
    context.fillRect(barWidth + barPaddingX + barWidth / 2, screenHeight - convert(tempScale, minTemp) * barScale, barWidth / 2, convert(tempScale, minTemp) * barScale);

    //HUMIDITY
    context.fillStyle = humGradient;
    context.fillRect(barPaddingX * 20, screenHeight - humidity * humidityScale, barWidth, humidity * humidityScale);

    /**
     * RENDER TEXT
     **/

    //MAXTEMP
    context.fillStyle = 'black';
    context.font = 'normal bold 30px Courier';
    context.fillText(`${convert(tempScale, maxTemp)}°`, barPaddingX + (textPaddingX / 4), (screenHeight - convert(tempScale, maxTemp) * barScale) + textPaddingY, 50);

    //MAXTEMP NAME
    context.fillStyle = 'white';
    context.font = 'normal 25px Courier';
    context.fillText('HIGH', barPaddingX + (textPaddingX / 4), (screenHeight - barNamePadding), 50);

    //MINTEMP
    context.fillStyle = 'black';
    context.font = 'normal bold 30px Courier';
    context.fillText(`${convert(tempScale, minTemp)}°`, (textPaddingX * 2.2) + barWidth, (screenHeight - convert(tempScale, minTemp) * barScale) + textPaddingY, 50);

    //MINTEMP NAME
    context.fillStyle = 'white';
    context.font = 'normal 25px Courier';
    context.fillText('LOW', (textPaddingX * 2.2) + barWidth, (screenHeight - barNamePadding), 50);

    //TEMP
    context.fillStyle = 'black';
    context.font = 'normal bold 30px Courier';
    context.fillText(`${convert(tempScale, temp)}°`, (barWidth / 2) + barPaddingX + textPaddingX, (screenHeight - convert(tempScale, temp) * barScale) + textPaddingY, 50);

    //TEMP NAME
    context.fillStyle = 'white';
    context.font = 'normal 25px Courier';
    context.fillText('TEMPERATURE', (barWidth / 2) + (textPaddingX / 1.5), (screenHeight - barNamePadding), 120);

    //HUMIDITY
    context.fillStyle = 'black';
    context.font = 'normal bold 30px Courier';
    context.fillText(`${humidity}%`, barPaddingX * 20 + textPaddingX, (screenHeight - humidity * humidityScale) + textPaddingY, 50);

    //HUMIDITY NAME
    context.fillStyle = 'white';
    context.font = 'normal 25px Courier';
    context.fillText('HUMIDITY', barPaddingX * 18.3 + textPaddingX, (screenHeight - barNamePadding), 120);
}

// ENTRY POINT
init();