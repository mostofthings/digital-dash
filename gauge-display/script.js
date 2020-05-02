import Gauge from './draw-gauges.js';
let gaugeData;
let gauges;
let gaugeOptions;
let chart;
let isSweepDone = false;
let rollingWaterTemp = [];
let rollingTimestamp = [];



window.onload = function () {
    const socket = io.connect('http://localhost:3000');
    socket.on('sensor', (data) => {
        socket.emit('my other event', { my: 'data' });
        if (isSweepDone) {
            tempCalculateAndDisplay(data);
        }
    });

    for (let i = 0; i < 400; i++){
        rollingTimestamp.push(new Date());
        rollingWaterTemp.push(0);
    }



    drawLineChart();
}

function tempCalculateAndDisplay(sensorData) {
    // console.log(calculatedTemp);
    if (gaugeData) {
        gaugeData.setValue(0, 1, sensorData.waterTemp);
        gauges.draw(gaugeData, gaugeOptions);
        tempGauge.updateGauge(sensorData.waterTemp);
        oilTempGauge.updateGauge(sensorData.oilTemp)
        rollingWaterTemp.push(sensorData.waterTemp);
        rollingWaterTemp.shift();
        rollingTimestamp.push(new Date(sensorData.timestamp));
        rollingTimestamp.shift();

        chart.data.datasets[0].data = rollingWaterTemp;
        chart.data.labels = rollingTimestamp;
        chart.update();
    }
}

let tempGauge = new Gauge("temp", "temp", 80, 240, 0, 0, 190, 205, 205, 240, [80, 100, 120, 140, 160, 180, 200, 220, 240], 5);
let oilTempGauge = new Gauge("oil", "oil psi", 0, 140, 0, 0, 16, 20, 0, 16, [0, 20, 40, 60, 80, 100, 120, 140], 5);
let boostGauge = new Gauge("boost", "boost", -20, 20, 0, 0, 0, 0, 0, 0, [-20, -10, 0, 5, 10, 15, 20], 5);
let fuelGauge = new Gauge("fuel", "fuel", 25, 50, 0, 0, 35, 38, 25, 35, [25, 30, 35, 40, 45, 50], 5);
let widebandGauge = new Gauge("o2", "o2", 8, 20, 8, 12, 12, 16, 16, 20, [8, 10, 12, 14, 16, 18, 20], 10);
let rpmGauge = new Gauge("rpm", "rpm", 0, 9000, 0, 0, 0, 0, 7200, 9000, [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000], 5);

function drawLineChart(){
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
                            second:'h:mm:ss'
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