import Gauge from './gauge.js';
import Gmeter from './g-meter.js';
import Readout from './readouts.js';
import { xAxes, yAxes, chartData, engineTempDataset, oilPressureDataset, 
    widebandDataset, rpmDataset, gforceDataset, boostPressureDataset } from './chart-settings.js';
let chart;
let chartInterval = 0;
let isSweepDone = false;
let currentAccelX;
let currentAccelY;
let accelXOffset = 0;
let accelYOffset = 0;


const rollingTimestamp = [];

window.onload = function () {
    const socket = io.connect('http://localhost:3000');
    socket.on('sensor', (data) => {
        if (isSweepDone) {
            calculateAndDisplay(data);
        }
    });

    for (let i = 0; i < 400; i++) {
        rollingTimestamp.push(new Date());
        engineTempDataset.data.push(0);
        boostPressureDataset.data.push(0);
        gforceDataset.data.push(0);
        oilPressureDataset.data.push(0);
        rpmDataset.data.push(0);
        widebandDataset.data.push(0);
    };

    if (localStorage.getItem('xOffset')){ //check for local gmeter reset
        accelXOffset = localStorage.getItem('xOffset');
        accelYOffset = localStorage.getItem('yOffset');
        console.log(localStorage.getItem('xOffset'));
        console.log(localStorage.getItem('yOffset'));
    }

    drawLineChart();
}

function calculateAndDisplay(sensorData) {
    engineTempGauge.updateGauge(sensorData.waterTemp);
    oilPressureGauge.updateGauge(sensorData.oilPressure);
    boostGauge.updateGauge(sensorData.boostPressure);
    // fuelGauge.updateGauge(sensorData.fuelPressure);
    rpmGauge.updateGauge(sensorData.rpm);
    widebandGauge.updateGauge(sensorData.wideband);
    const offsetXAccel = sensorData.xAcceleration - accelXOffset
    const offsetYAccel = sensorData.yAcceleration - accelYOffset
    gmeter.updateGauge(offsetXAccel, offsetYAccel);

    const totalGForce = Math.abs(sensorData.xAcceleration - accelXOffset) + Math.abs(sensorData.yAcceleration - accelYOffset);
    currentAccelX = sensorData.xAcceleration;
    currentAccelY = sensorData.yAcceleration;

    if (chartInterval === 4){
        engineTempDataset.data.push(sensorData.waterTemp);
        engineTempDataset.data.shift();
        oilPressureDataset.data.push(sensorData.oilPressure);
        oilPressureDataset.data.shift();
        widebandDataset.data.push(sensorData.wideband);
        widebandDataset.data.shift();
        // rollingFuelPressure.push(sensorData.fuelPressure);
        // rollingFuelPressure.shift();
        boostPressureDataset.data.push(sensorData.boostPressure);
        boostPressureDataset.data.shift();
        rpmDataset.data.push(sensorData.rpm);
        rpmDataset.data.shift();
        gforceDataset.data.push(totalGForce.toFixed(2));
        gforceDataset.data.shift();
        rollingTimestamp.push(new Date(sensorData.timestamp));
        rollingTimestamp.shift();

        chart.data.labels = rollingTimestamp;
        chart.update();

        chartInterval = 0;
    } else {
    chartInterval++;
    };

    engineTempReadout.updateReadout(sensorData.waterTemp);
    oilPressureReadout.updateReadout(sensorData.oilPressure);
    boostReadout.updateReadout(sensorData.boostPressure);
    // fuelReadout.updateReadout(sensorData.fuelPressure);
    widebandReadout.updateReadout(sensorData.wideband);
    rpmReadout.updateReadout(sensorData.rpm);
    gmeterReadout.updateReadout(totalGForce.toFixed(2));
}

let engineTempGauge = new Gauge('temp', 'temp', 80, 240, 0, 0, 190, 205, 205, 240, [80, 100, 120, 140, 160, 180, 200, 220, 240], 5);
let oilPressureGauge = new Gauge('oil', 'oil psi', 0, 140, 0, 0, 16, 20, 0, 16, [0, 20, 40, 60, 80, 100, 120, 140], 5);
let boostGauge = new Gauge('boost', 'boost', -15, 15, 0, 0, 0, 0, 0, 0, [-15, -10, -5, 0, 5, 10, 15], 5);
// let fuelGauge = new Gauge('fuel', 'fuel', 25, 50, 0, 0, 35, 38, 25, 35, [25, 30, 35, 40, 45, 50], 5);
let widebandGauge = new Gauge('o2', 'o2', 8, 20, 8, 12, 12, 16, 16, 20, [8, 10, 12, 14, 16, 18, 20], 10);
let rpmGauge = new Gauge('rpm', 'rpm', 0, 9000, 0, 0, 0, 0, 7200, 9000, [0, 1000, 2000, 3000, , 5000, 6000, 7000, 8000, 9000], 5);
let gmeter = new Gmeter('main');

let engineTempReadout = new Readout('temp-readout', 'temp');
let oilPressureReadout = new Readout('oil-psi-readout', 'oil psi');
let boostReadout = new Readout('boost-readout', 'boost');
// let fuelReadout = new Readout('fuel-readout', 'fuel');
let widebandReadout = new Readout('o2-readout', 'o2',);
let rpmReadout = new Readout('rpm-readout', 'rpm');
let gmeterReadout = new Readout('g-readout', 'Gs');

setTimeout(() => {
    engineTempGauge.updateGauge(engineTempGauge.max);
    oilPressureGauge.updateGauge(oilPressureGauge.max);
    boostGauge.updateGauge(boostGauge.max);
    // fuelGauge.updateGauge(fuelGauge.max);
    widebandGauge.updateGauge(widebandGauge.max);
    rpmGauge.updateGauge(rpmGauge.max);
}, 400)

setTimeout(() => {
    engineTempGauge.updateGauge(engineTempGauge.min);
    oilPressureGauge.updateGauge(oilPressureGauge.min);
    boostGauge.updateGauge(boostGauge.min);
    // fuelGauge.updateGauge(fuelGauge.min);
    widebandGauge.updateGauge(widebandGauge.min);
    rpmGauge.updateGauge(rpmGauge.min);
}, 800)
setTimeout(() => isSweepDone = true, 1400);

function drawLineChart() {

    const chartContext = document.getElementById('linechart').getContext('2d');
    chart = new Chart(chartContext, {
        type: 'line',
        data: chartData,

        options: {
            scales: {
                xAxes,
                yAxes,
            }
        }
    });
}

let tempReadoutButton = document.getElementById('temp-readout');
let oilPressureReadoutButton = document.getElementById('oil-psi-readout');
let boostReadoutButton = document.getElementById('boost-readout');
let o2ReadoutButton = document.getElementById('o2-readout');
let rpmReadoutButton = document.getElementById('rpm-readout');
let gReadoutButton = document.getElementById('g-readout');
// let fuelReadoutButton = document.getElementById('fuel-readout');

tempReadoutButton.addEventListener('click', () => showHideLine(engineTempDataset));
oilPressureReadoutButton.addEventListener('click', () => showHideLine(oilPressureDataset));
boostReadoutButton.addEventListener('click', () => showHideLine(boostPressureDataset));
o2ReadoutButton.addEventListener('click', () => showHideLine(widebandDataset));
rpmReadoutButton.addEventListener('click', () => showHideLine(rpmDataset));
gReadoutButton.addEventListener('click', () => showHideLine(gforceDataset));
// fuelReadoutButton.addEventListener('click', () => showHideLine(6));

function showHideLine(dataset){
    dataset.showLine = !dataset.showLine;
    const matchingYAxisIndex = yAxes.findIndex(yAxis => yAxis.id === dataset.yAxisID);
    const matchingYAxis = chart.options.scales.yAxes[matchingYAxisIndex];
    if (dataset.showLine) {
        resetChartScales(matchingYAxis);
        matchingYAxis.position = 'right';
        matchingYAxis.display = true;
        matchingYAxis.gridLines.borderDash = [2,8];
    } else {
        matchingYAxis.display = false;
    }
}

function resetChartScales(){

    for (let i = 0; i < 6; i++){
        if (chart.options.scales.yAxes[i].position === 'left'){
            chart.options.scales.yAxes[i].display = false;
            chart.options.scales.yAxes[i].gridLines.color = '#2e2e2e'

        } else if (chart.options.scales.yAxes[i].position === 'right' && chart.options.scales.yAxes[i].gridLines.display) {
            chart.options.scales.yAxes[i].position = 'left';
            chart.options.scales.yAxes[i].gridLines.color = '#9c9c9c';
            chart.options.scales.yAxes[i].gridLines.borderDash = [];
        }
    }

}

let night = false;

const nightModeButton = document.getElementById('night-mode');
nightModeButton.addEventListener('click', switchNight);

function switchNight(event){
    let chartBackground = document.getElementById('chart');
    let readoutElements = document.querySelectorAll('.readout');
    let readoutLabelElements = document.querySelectorAll('.readout-label');
    let readoutDisplayElements = document.querySelectorAll('.number-display');
    let gaugePageBackground = document.getElementById('gauges');

    if (night) { //switching to day
        nightModeButton.classList.remove('icono-sun');
        nightModeButton.classList.remove('night');
        nightModeButton.classList.add('icono-moon');
        chartBackground.classList.remove('night');
        gaugePageBackground.classList.remove('night');
        readoutLabelElements.forEach(readoutLabel => readoutLabel.classList.remove('night'));
        readoutElements.forEach(readoutElement => readoutElement.classList.remove('night'));
        readoutDisplayElements.forEach(displayElement => displayElement.classList.remove('night'));
        Chart.defaults.global.defaultFontColor = 'black';
        chartNight('#CCCCCC', '#F7F7F7');
    } else { //switching to night
        nightModeButton.classList.remove('icono-moon');
        nightModeButton.classList.add('night');
        nightModeButton.classList.add('icono-sun');
        chartBackground.classList.add('night');
        gaugePageBackground.classList.add('night');
        readoutLabelElements.forEach(readoutLabel => readoutLabel.classList.add('night'));
        readoutElements.forEach(readoutElement => readoutElement.classList.add('night'));
        readoutDisplayElements.forEach(displayElement => displayElement.classList.add('night'));
        Chart.defaults.global.defaultFontColor = 'white';
        chartNight('#2e2e2e', 'black');
    }

    night= !night;
}

function chartNight(rimFill, faceColor) {
	const svgs = document.querySelectorAll('.gauge-face svg');
    svgs.forEach(svg => {
        const circles = svg.getElementsByTagName('circle');
        const gaugeRim = circles[0];
        const gaugeBackground = circles[1];

        gaugeRim.setAttribute('fill', rimFill);
        gaugeBackground.setAttribute('fill', faceColor);
       
    })
}


let longTouchTimer;
var touchduration = 500; 
const gMeterDiv = document.getElementById('gmeter-main');
gMeterDiv.addEventListener('touchstart', () => longTouchTimer = setTimeout(resetGmeter, touchduration))
gMeterDiv.addEventListener('touchend', () => clearTimeout(longTouchTimer));

let resetGmeter = function() {
    localStorage.setItem('xOffset', currentAccelX);
    localStorage.setItem('yOffset', currentAccelY);
    accelXOffset = currentAccelX;
    accelYOffset = currentAccelY;
}


