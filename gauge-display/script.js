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
        rollingWaterTemp.push(sensorData.waterTemp);
        rollingWaterTemp.shift();
        rollingTimestamp.push(new Date(sensorData.timestamp));
        rollingTimestamp.shift();

        chart.data.datasets[0].data = rollingWaterTemp;
        chart.data.labels = rollingTimestamp;
        chart.update();
    }
}

google.charts.load('current', { 'packages': ['gauge'] });
google.charts.setOnLoadCallback(drawGauges);

function drawGauges() {
    gaugeData = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['Temp', 80],
        ['Oil PSI', 175],
        ['RPM', 180],
        ['Boost', 160],
        ['Fuel PSI', 110],
    ]);

    gaugeOptions = {
        width: 920, height: 620,
        max: 240,
        min: 80,
        redFrom: 215, redTo: 240,
        yellowFrom: 200, yellowTo: 215,
        majorTicks: ['80', '100', '120', '140', '160', '180', '200', '220', '240'],
        minorTicks: 10
    };

    gauges = new google.visualization.Gauge(document.getElementById('chart-div'));

    gauges.draw(gaugeData, gaugeOptions);

    setTimeout(() => {
        gaugeData.setValue(0, 1, 240)
        gauges.draw(gaugeData, gaugeOptions);
    }, 400)
    setTimeout(() => {
        gaugeData.setValue(0, 1, 80)
        gauges.draw(gaugeData, gaugeOptions);
    }, 800)
    setTimeout(() => isSweepDone = true, 1400);

}

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