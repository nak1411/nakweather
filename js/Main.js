/**
 * © 2018 Justin Schlump
 * This code is licensed under MIT license (see LICENSE.txt for details)
 * 
 * This app fetches weather data using the OpenWeather API. It creates
 * a visual representation of the data in a responsive canvas window.
 */

import Data from './Data.js';

//CANVAS VARS
let canvas = document.getElementById('game');
let context = canvas.getContext('2d');
let screenWidth = canvas.width;
let screenHeight = canvas.height;

//GLOBAL VARS
let date;
let currentDate;
let cityTime;
let localTime;
let lastTime = (new Date()).getTime();
let now = 0;
let delta = 0;
let running = false;
let tempScale = 'fahrenheit';
let humidityScale = 5;
let barScale = 15;
let barWidth = 150;
let barPaddingX = 20;
let textPaddingX = 50;
let barNamePadding = 10;
let currentGradient;
let dayGradient;
let nightGradient;

//API VARS
let temp;
let maxTemp;
let minTemp;
let humidity;
let timeZone;
let data;
let city;
let utcOff;

document.getElementById("city-form").addEventListener("submit", function (e) {
    e.preventDefault();
    city = document.getElementById("city-field").value;
    document.getElementById("city-field").value = '';
    data = new Data(city);
    data.weather.then(function (result) {
        temp = result.temp;
        maxTemp = result.maxTemp;
        minTemp = result.minTemp;
        humidity = result.humidity;
    });
    data.timeZone.then(function (result) {
        timeZone = result.timezone;
        utcOff = result.tzOff;
    });
});
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
        city = 'Seattle';
        data = new Data(city);
        data.weather.then(function (result) {
            temp = result.temp;
            maxTemp = result.maxTemp;
            minTemp = result.minTemp;
            humidity = result.humidity;
        });
        data.timeZone.then(function (result) {
            timeZone = result.timezone;
            utcOff = result.tzOff;
        });

        createGradients();
        run();
    }
}

/**
 * MAIN LOOP
 */
const run = () => {
    if (running) {
        requestAnimationFrame(run);
        now = (new Date()).getTime();
        delta = (now - lastTime) / 1000 * 60;
        update();
        render();
        lastTime = now;
    }
}

const createGradients = () => {
    //DAY GRADIENT
    dayGradient = context.createLinearGradient(0, screenHeight, 0, 100);
    dayGradient.addColorStop(0, "cyan");
    dayGradient.addColorStop(1, "blue");

    //NIGHT GRADIENT
    nightGradient = context.createLinearGradient(0, screenHeight, 0, 100);
    nightGradient.addColorStop(0, "darkslateblue");
    nightGradient.addColorStop(1, "black");
}

/**
 * RENDERING
 */
const render = () => {
    /**
     * RENDER BACKGROUND
     **/

    context.fillStyle = currentGradient;
    context.fillRect(0, 0, screenWidth, screenHeight);

    /**
     * RENDER BARS
     **/

    //MAX GRADIENT
    let maxGradient = context.createLinearGradient(0, screenHeight, 0, 100);
    maxGradient.addColorStop(0, "black");
    maxGradient.addColorStop(1, "red");

    //MIN GRADIENT
    let minGradient = context.createLinearGradient(0, screenHeight, 0, 100);
    minGradient.addColorStop(0, "black");
    minGradient.addColorStop(1, "cyan");

    //TEMP GRADIENT
    let tempGradient = context.createLinearGradient(0, screenHeight, 0, 100);
    tempGradient.addColorStop(0, "black");
    tempGradient.addColorStop(1, "orange");

    //HUMIDITY GRADIENT
    let humGradient = context.createLinearGradient(0, screenHeight, 0, 100);
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
    context.fillText(`${convert(tempScale, maxTemp)}°`, barPaddingX + (textPaddingX / 4), (screenHeight - convert(tempScale, maxTemp) * barScale), 50);

    //MAXTEMP NAME
    context.fillStyle = 'white';
    context.font = 'normal 25px Courier';
    context.fillText('HIGH', barPaddingX + (textPaddingX / 4), (screenHeight - barNamePadding), 50);

    //MINTEMP
    context.fillStyle = 'black';
    context.font = 'normal bold 30px Courier';
    context.fillText(`${convert(tempScale, minTemp)}°`, (textPaddingX * 2.2) + barWidth, (screenHeight - convert(tempScale, minTemp) * barScale), 50);

    //MINTEMP NAME
    context.fillStyle = 'white';
    context.font = 'normal 25px Courier';
    context.fillText('LOW', (textPaddingX * 2.2) + barWidth, (screenHeight - barNamePadding), 50);

    //TEMP
    context.fillStyle = 'black';
    context.font = 'normal bold 30px Courier';
    context.fillText(`${convert(tempScale, temp)}°`, (barWidth / 2) + barPaddingX + textPaddingX, (screenHeight - convert(tempScale, temp) * barScale), 50);

    //TEMP NAME
    context.fillStyle = 'white';
    context.font = 'normal 25px Courier';
    context.fillText('TEMPERATURE', (barWidth / 2) + (textPaddingX / 1.5), (screenHeight - barNamePadding), 120);

    //HUMIDITY
    context.fillStyle = 'black';
    context.font = 'normal bold 30px Courier';
    context.fillText(`${humidity}%`, barPaddingX * 20 + textPaddingX, (screenHeight - humidity * humidityScale), 50);

    //HUMIDITY NAME
    context.fillStyle = 'white';
    context.font = 'normal 25px Courier';
    context.fillText('HUMIDITY', barPaddingX * 18.3 + textPaddingX, (screenHeight - barNamePadding), 120);

    //CITY TIME
    context.fillStyle = 'white';
    context.font = 'normal 20px Courier';
    context.fillText(`City Time: ${cityTime}`, 5, 65, 220);

    //LOCAL TIME
    context.fillStyle = 'white';
    context.font = 'normal 20px Courier';
    context.fillText(`Local Time: ${localTime}`, 5, 85, 220);

    //DATE
    context.fillStyle = 'white';
    context.font = 'normal 20px Courier';
    context.fillText(`Date: ${currentDate}`, 5, 45, 220);

    //TIMEZONE
    context.fillStyle = 'white';
    context.font = 'normal 20px Courier';
    context.fillText(timeZone, 5, 105, 220);

    //CITY
    context.fillStyle = 'white';
    context.font = 'normal 30px Courier';
    context.fillText(city.toUpperCase(), 5, 25, 180);
}

const update = () => {
    date = new Date();
    currentDate = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
    cityTime = `${date.getHours() + ((date.getTimezoneOffset() / -60 - 1) - utcOff) * -1}:${date.getMinutes()}:${date.getSeconds()}`;
    localTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    if (date.getHours() >= 19 || date.getHours() <= 5) {
        currentGradient = nightGradient;

    } else {
        currentGradient = dayGradient;
    }
}

// ENTRY POINT
init();