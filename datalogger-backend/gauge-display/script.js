import Gauge from './draw-gauges.js';
let chart;
// let isSweepDone = true;
let isSweepDone = false;
let rollingWaterTemp = [];
let rollingOilPressure = [];
let rollingWideband = [];
let rollingFuelPressure = [];
let rollingBoostPressure = [];
let rollingRPM = [];
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
    }



    drawLineChart();
}

function calculateAndDisplay(sensorData) {
    // console.log(calculatedTemp);
    engineTempGauge.updateGauge(sensorData.waterTemp);
    oilPressureGauge.updateGauge(sensorData.oilPressure);
    boostGauge.updateGauge(sensorData.boostPressure);
    fuelGauge.updateGauge(sensorData.fuelPressure);
    rpmGauge.updateGauge(sensorData.rpm);
    widebandGauge.updateGauge(sensorData.wideband);

    rollingWaterTemp.push(sensorData.waterTemp);
    rollingWaterTemp.shift();
    rollingOilPressure.push(sensorData.oilPressure);
    rollingOilPressure.shift();
    rollingWideband.push(sensorData.wideband);
    rollingWideband.shift();
    rollingFuelPressure.push(sensorData.fuelPressure);
    rollingFuelPressure.shift();
    rollingBoostPressure.push(sensorData.boostPressure);
    rollingBoostPressure.shift();
    rollingRPM.push(sensorData.rpm);
    rollingRPM.shift();
    rollingTimestamp.push(new Date(sensorData.timestamp));
    rollingTimestamp.shift();

    chart.data.datasets[0].data = rollingWaterTemp;
    chart.data.labels = rollingTimestamp;
    chart.update();

}

let engineTempGauge = new Gauge("temp", "temp", 80, 240, 0, 0, 190, 205, 205, 240, [80, 100, 120, 140, 160, 180, 200, 220, 240], 5);
let oilPressureGauge = new Gauge("oil", "oil psi", 0, 140, 0, 0, 16, 20, 0, 16, [0, 20, 40, 60, 80, 100, 120, 140], 5);
let boostGauge = new Gauge("boost", "boost", -14, 14, 0, 0, 0, 0, 0, 0, [-30, -20, -10, 0, 5, 10, 15], 5);
let fuelGauge = new Gauge("fuel", "fuel", 25, 50, 0, 0, 35, 38, 25, 35, [25, 30, 35, 40, 45, 50], 5);
let widebandGauge = new Gauge("o2", "o2", 8, 20, 8, 12, 12, 16, 16, 20, [8, 10, 12, 14, 16, 18, 20], 10);
let rpmGauge = new Gauge("rpm", "rpm", 0, 9000, 0, 0, 0, 0, 7200, 9000, [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000], 5);

setTimeout(() => {
    engineTempGauge.updateGauge(engineTempGauge.max);
    oilPressureGauge.updateGauge(oilPressureGauge.max);
    boostGauge.updateGauge(boostGauge.max);
    fuelGauge.updateGauge(fuelGauge.max);
    widebandGauge.updateGauge(widebandGauge.max);
    rpmGauge.updateGauge(rpmGauge.max);
}, 400)

setTimeout(() => {
    engineTempGauge.updateGauge(engineTempGauge.min);
    oilPressureGauge.updateGauge(oilPressureGauge.min);
    boostGauge.updateGauge(boostGauge.min);
    fuelGauge.updateGauge(fuelGauge.min);
    widebandGauge.updateGauge(widebandGauge.min);
    rpmGauge.updateGauge(rpmGauge.min);
}, 800)
setTimeout(() => isSweepDone = true, 1400);

function drawLineChart() {
    const ctx = document.getElementById('linechart').getContext('2d');
    chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: rollingTimestamp,
            datasets: [{
                label: 'Engine Temp',
                // backgroundColor: 'rgb(255, 99, 132)',
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                data: rollingWaterTemp,
                pointRadius: 0,
            }]
        },

        // Configuration options go here
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    distribution: 'series',
                    time: {
                        displayFormats: {
                            second: 'h:mm:ss'
                        },
                        unit: 'second',
                    },
                    ticks: {
                        maxTicksLimit: 8,
                        autoSkip: true,
                    }

                }],
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 240,
                    }
                }]
            }


        }
    });
}