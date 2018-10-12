/**
 * © 2018 Justin Schlump
 * This code is licensed under MIT license (see LICENSE.txt for details)
 * 
 * This app fetches weather data using the OpenWeather API. It creates
 * a visual representation of the data in a responsive canvas window.
 */

//API
const api = 'http://api.openweathermap.org/data/2.5/weather?q=seattle&APPID=d438c6c016bcdcf60c6d2534559d8b07';

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
let tempScale = 'celsius';
let barWidth;
let barHeight;
let barPaddingX = 20;
let barPaddingY = 10;
let textPaddingX = 28;
let textPaddingY = 25;

//API VARS
let temp;
let maxTemp;
let minTemp;
let humidity;

/**
 * FETCH DATA FROM OPENWEATHER
 */
async function weatherData() {
    let response = await fetch(api);
    let json = await response.json();
    console.log(json);
    temp = Math.floor(json.main.temp - 273.15);
    maxTemp = json.main.temp_max;
    minTemp = json.main.temp_min;
    humidity = json.main.humidity;
}

/**
 * CONVERT TEMPERATURE DATA SCALE
 */
const convert = (s, t) => {
    if (s === 'celsius') {
        return t;
    } else if (s === 'fahrenheit') {
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
        weatherData();
    }
}

/**
 * MAIN LOOP
 */
const run = () => {
    if (running) {
        requestAnimationFrame(run);
        currentTime = (new Date()).getTime();
        delta = (currentTime - lastTime) / 1000;
        update();
        render();
        lastTime = currentTime;
    }
}

/**
 * RENDERING
 */
const render = () => {
    //CLEAR SCREEN
    context.fillStyle = '#000';
    context.fillRect(0, 0, screenWidth, screenHeight);

    //RENDER TEMPERATURE BARS
    context.fillStyle = '#fff';
    context.fillRect(barPaddingX, screenHeight - barHeight, barWidth, barHeight);

    //RENDER HUMIDITY BARS
    context.fillStyle = '#888';
    context.fillRect(barPaddingX + 120, screenHeight - humidity, barWidth, humidity);

    //RENDER TEMPERATURE TEXT
    context.fillStyle = 'black';
    context.font = 'normal bold 30px Courier';
    context.fillText(`${convert(tempScale, temp)}°`, barPaddingX + textPaddingX, (screenHeight - barHeight) + textPaddingY, 50);

    //RENDER HUMIDITY TEXT
    context.fillStyle = 'blue';
    context.font = 'normal bold 30px Courier';
    context.fillText(`${humidity}%`, barPaddingX + 118 + textPaddingX, (screenHeight - humidity) + textPaddingY, 50);
}

const update = () => {
    barWidth = 100;
    barHeight = convert(tempScale, temp) * 10;
}

// ENTRY POINT
init();