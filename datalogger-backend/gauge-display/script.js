import Gauge from './draw-gauges.js';
import Gmeter from './g-meter.js';
import Readout from './readouts.js';
let chart;
let chartInterval = 0;
let isSweepDone = false;
let rollingWaterTemp = [];
let rollingOilPressure = [];
let rollingWideband = [];
// let rollingFuelPressure = [];
let rollingBoostPressure = [];
let rollingRPM = [];
let rollingGForce = [];
let rollingTimestamp = [];

window.onload = function () {
    const socket = io.connect('http://localhost:3000');
    socket.on('sensor', (data) => {
        socket.emit('my other event', { my: 'data' });
        if (isSweepDone) {
            calculateAndDisplay(data);
        }
    });

    for (let i = 0; i < 400; i++) {
        rollingTimestamp.push(new Date());
        rollingWaterTemp.push(0);
        rollingBoostPressure.push(0);
        rollingGForce.push(0);
        rollingOilPressure.push(0);
        rollingRPM.push(0);
        rollingWideband.push(0);
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
    gmeter.updateGauge(sensorData.xAcceleration, sensorData.yAcceleration);

    let totalGForce = Math.abs(sensorData.xAcceleration) + Math.abs(sensorData.yAcceleration);

    if (chartInterval === 4){
        rollingWaterTemp.push(sensorData.waterTemp);
        rollingWaterTemp.shift();
        rollingOilPressure.push(sensorData.oilPressure);
        rollingOilPressure.shift();
        rollingWideband.push(sensorData.wideband);
        rollingWideband.shift();
        // rollingFuelPressure.push(sensorData.fuelPressure);
        // rollingFuelPressure.shift();
        rollingBoostPressure.push(sensorData.boostPressure);
        rollingBoostPressure.shift();
        rollingRPM.push(sensorData.rpm);
        rollingRPM.shift();
        rollingGForce.push(totalGForce.toFixed(2));
        rollingGForce.shift();
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
    const xAxes = [{
        type: 'time',
        distribution: 'series',
        gridLines: {
            color: '#2e2e2e',
        },
        time: {
            displayFormats: {
                second: 'h:mm'
            },
            unit: 'second',
        },
        ticks: {
            maxTicksLimit: 8,
            maxRotation: 0,
            autoSkip: true,
        }
    }];

    const yAxes = [{
        id: 'deg',
        position: 'left',
        gridLines: {
            color: '#9c9c9c',
        },
        ticks: {
            max: 240,
            min: 0,
        }
    }, {
        id: 'oil-psi',
        position: 'right',
        gridLines: {
            color: '#2e2e2e',
            borderDash: [2,8],
        },
        ticks: {
            max: 180,
            min: 0,
        }
    }, {
        id: 'boost',
        gridLines: {
            color: '#2e2e2e',
            borderDash: [2,8],
        },
        display: false,
        ticks: {
            max: 14,
            min: -14,
        }
    }, {
        id: 'afr',
        gridLines: {
            color: '#2e2e2e',
            borderDash: [2,8],
        },
        display: false,
        ticks: {
            max: 20,
            min: 8,
        }
    }, {
        id: 'RPM',
        gridLines: {
            color: '#2e2e2e',
            borderDash: [2,8],
        },
        display: false,
        ticks: {
            max: 9000,
            min: 0,
        }
    }, {
        id: 'Gs',
        gridLines: {
            color: '#2e2e2e',
            borderDash: [2,8],
        },
        display: false,
        ticks: {
            max: 2,
            min: 0,
        }
    }];

    const ctx = document.getElementById('linechart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Engine Temp',
                yAxisID: 'deg',
                data: rollingWaterTemp,
                showLine: true,
                borderColor: '#FF0061',
            }, {
                label: 'Oil PSI',
                yAxisID: 'oil-psi',
                data: rollingOilPressure,
                showLine: true,
                borderColor: '#FFAA00',
            }, {
                label: 'Boost',
                yAxisID: 'boost',
                data: rollingBoostPressure,
                showLine: true,
                borderColor: '#8AE800',
            }, {
                label: 'Wideband',
                yAxisID: 'afr',
                data: rollingWideband,
                showLine: true,
                borderColor: '#7734EA',
            }, {
                label: 'RPM',
                yAxisID: 'RPM',
                data: rollingRPM,
                showLine: true,
                borderColor: '#00A7EA',
            }, {
                label: 'G-force',
                yAxisID: 'Gs',
                data: rollingGForce,
                showLine: true,
                borderColor: '#949494',
            }]
        },

        options: {
            scales: {
                xAxes,
                yAxes,
            }
        }
    });
}


Chart.defaults.global.defaultFontColor = 'black';
Chart.defaults.global.defaultFontFamily = 'Montserrat';
Chart.defaults.global.tooltips.enabled = false;
Chart.defaults.global.legend.display = false;
Chart.defaults.global.elements.point.radius = 0;
Chart.defaults.global.elements.line.fill = false;
Chart.defaults.global.animation.duration = 0;
Chart.defaults.global.hover.animationDuration = 0;
Chart.defaults.global.responsiveAnimationDuration = 0;

let tempReadoutButton = document.getElementById('temp-readout');
let oilPressureReadoutButton = document.getElementById('oil-psi-readout');
let boostReadoutButton = document.getElementById('boost-readout');
let o2ReadoutButton = document.getElementById('o2-readout');
let rpmReadoutButton = document.getElementById('rpm-readout');
let gReadoutButton = document.getElementById('g-readout');
// let fuelReadoutButton = document.getElementById('fuel-readout');

tempReadoutButton.addEventListener('click', () => showHideLine(0));
oilPressureReadoutButton.addEventListener('click', () => showHideLine(1));
boostReadoutButton.addEventListener('click', () => showHideLine(2));
o2ReadoutButton.addEventListener('click', () => showHideLine(3));
rpmReadoutButton.addEventListener('click', () => showHideLine(4));
gReadoutButton.addEventListener('click', () => showHideLine(5));
// fuelReadoutButton.addEventListener('click', () => showHideLine(6));

function showHideLine(index){
    chart.data.datasets[index].showLine = !chart.data.datasets[index].showLine;
    if (chart.data.datasets[index].showLine) {
        resetChartScales();
        chart.options.scales.yAxes[index].position = 'right';
        chart.options.scales.yAxes[index].display = true;
        chart.options.scales.yAxes[index].gridLines.borderDash = [2,8];
    } else {
        chart.options.scales.yAxes[index].display = false;
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

let nightModeButton = document.getElementById('night-mode');
let chartBackground = document.getElementById('chart');
let readoutElements = document.getElementsByClassName('readout');
let readoutLabelElements = document.getElementsByClassName('readout-label');
let readoutDisplayElements = document.getElementsByClassName('number-display');

nightModeButton.addEventListener('click', switchNight);



function switchNight(event){
    if (night) { //switching to day
        nightModeButton.classList.remove('icono-sun');
        nightModeButton.classList.remove('night');
        nightModeButton.classList.add('icono-moon');
        chartBackground.classList.remove('night');
        for (let i = 0; i < readoutLabelElements.length; i++){readoutLabelElements[i].classList.remove('night');}
        for (let i = 0; i < readoutElements.length; i++){readoutElements[i].classList.remove('night');}
        for (let i = 0; i < readoutDisplayElements.length; i++){readoutDisplayElements[i].classList.remove('night');}
        Chart.defaults.global.defaultFontColor = 'black';


    } else { //switching to night
        nightModeButton.classList.remove('icono-moon');
        nightModeButton.classList.add('night');
        nightModeButton.classList.add('icono-sun');
        chartBackground.classList.add('night');
        for (let i = 0; i < readoutLabelElements.length; i++){readoutLabelElements[i].classList.add('night');}
        for (let i = 0; i < readoutElements.length; i++){readoutElements[i].classList.add('night');}
        for (let i = 0; i < readoutDisplayElements.length; i++){readoutDisplayElements[i].classList.add('night');}
        Chart.defaults.global.defaultFontColor = 'white';


    }
    night= !night;
}



