const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const express = require('express');
const portString = process.platform === 'win32' ? 'COM3' : '/dev/ttyACM0';

const port = new SerialPort(portString);
const app = express();
const server = app.listen(3000);
const socket = require('socket.io');
const io = socket(server);

// let lastKnownGoodRPM = 6000;

app.use(express.static('gauge-display'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/gauge-display/index.html');
});

app.get('/change-night', (req, res) => {
  const brightness = req.query.brightness;
  res.status(200).end();
  printToSerial(brightness);
});

app.get('/master-warn', (req, res) => {
  const warnState = req.query.warn;
  res.status(200).end();
  printToSerial('warn');
})

const parser = port.pipe(new Readline());
parser.on('data', sendSensorData);

io.sockets.on('connection', (socket) => console.log(socket.id));

const waterTempRawData = [16, 22, 29, 39, 51, 68, 90, 121, 162, 217, 291, 379, 483, 595, 708, 808, 884, 939];

const correspondingWaterTemp = [302, 284, 266, 248, 230, 212, 194, 176, 158, 140, 122, 104, 86, 68, 50, 32, 14, -4];

const oilTempRawData = [121, 288, 435, 536, 546, 562, 578, 589, 604, 626, 646, 666, 685, 
  704, 712, 718, 729, 734, 747, 759, 771, 785, 796, 807, 818, 828, 837, 848, 861, 870, 
  880, 886, 894, 898, 905, 908, 914, 917, 920, 923, 926, 928, 929, 933, 937, 939, 941,
  944, 946, 950, 952, 955, 960, 964, 969, 974, 978];

const correspondingOilTemp = [-4, 30, 60, 80, 83, 86, 89, 91, 94, 98, 102, 106, 110, 114,
  116, 117, 120, 121, 124, 127, 130, 134, 137, 140, 144, 147, 150, 154, 159, 163, 167,
  170, 174, 178, 180, 182, 183, 185, 187, 188.5, 190, 192, 193, 195, 198, 199, 200, 203,
  205, 209, 212, 215, 220, 225, 230, 235, 240];

function sendSensorData(data) {
  const allReadings = data.split(',');
  const readingsToSend = {};

  allReadings.forEach(reading => {
    const type = reading.substring(0, 2);
    const valueString = reading.substring(2);
    const value = parseInt(valueString);

    switch (type) {
      case 'WT':
        if (value < 16){
          readingsToSend.waterTemp = 302;
        } else if (value <= 884){
          const unroundedWaterTemp = getTempInF(value, waterTempRawData, correspondingWaterTemp);
          readingsToSend.waterTemp = Math.round(unroundedWaterTemp);
        } else if (value > 884){
          readingsToSend.waterTemp = -4;
        }
        break;
      case 'OP':
        const oilPSI = value * .18 - 18.75;
        if (oilPSI > 0){
        readingsToSend.oilPressure = Math.round(oilPSI);
        } else {
          readingsToSend.oilPressure = 0;
        }
        break;
      case 'OT':
        if (value < 121){
          readingsToSend.oilTemp = -4;
        } else if (value <= 974){
          const unroundedOilTemp = getTempInF(value, oilTempRawData, correspondingOilTemp);
          readingsToSend.oilTemp = Math.round(unroundedOilTemp);
        } else if (value > 974){
          readingsToSend.oilTemp = 240;
        }
        break;
      case 'WB':
        const afr = value * .01161 + 7.312
        if (afr > 8) {
        readingsToSend.wideband = afr.toFixed(1);
        } else {
          readingsToSend.wideband = 0;
        }
        break;
      case 'BP':
        const boost = value * 0.04451 - 14.45; //convert positive psi
        readingsToSend.boostPressure = boost.toFixed(1);
        break;
      case 'ER':
        readingsToSend.rpm = value;
        break;
      case 'FP':
        const fuelPSI = value;
        readingsToSend.fuelPressure = fuelPSI;
        break;
      case 'XA':
        const xAccel = value / 100 / 9.806;
        readingsToSend.xAcceleration = xAccel.toFixed(2);
        break;
      case 'YA':
        const yAccel = value / 100 / 9.806;
        readingsToSend.yAcceleration = yAccel.toFixed(2);
        break;
      case 'ZA':
        const zAccel = value / 100 / 9.806;
        readingsToSend.zAcceleration = zAccel.toFixed(2);
        break;
      case 'EM':
        console.log(valueString);
      // default:
      //   console.log('sensor not found');
    }
  });

  readingsToSend.timestamp = new Date();

    io.emit('sensor', readingsToSend);
}

function getTempInF(value, rawDataSet, correspondingDataSet) {
  for (let i = 0; i < rawDataSet.length - 1; i++) {
  if (value >= rawDataSet[i] && value < rawDataSet[i + 1]) {
      const sensorMax = rawDataSet[i + 1];
      const sensorMin = rawDataSet[i];
      const sensorRange = sensorMax - sensorMin;
      const differenceToReading = value - sensorMin;

      const percentile = differenceToReading / sensorRange;

      const responseMax = correspondingDataSet[i + 1];
      const responseMin = correspondingDataSet[i];
      const responseRange = responseMax - responseMin;

      return responseRange * percentile + responseMin;
    }
  }
}

function printToSerial(message){
  port.write(message + '\n', (err) => {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
  });
}