let SerialPort = require('serialport');
let Readline = require('@serialport/parser-readline');
let express = require('express');
let port = new SerialPort('COM3');

let app = express();
let server = app.listen(3000);
let socket = require('socket.io');
let io = socket(server);

let tempRawData = [536, 546, 562, 578, 589, 604, 626, 646, 666, 685, 704, 712, 718, 729,
  734, 747, 759, 771, 785, 796, 807, 818, 828, 837, 848, 861, 870, 880, 886, 894, 898,
  905, 908, 914, 917, 920, 923, 926, 928, 929, 933, 937, 939, 941, 944, 946, 950, 952,
  955, 960, 964, 969, 974, 978];

let correspondingTemp = [80, 83, 86, 89, 91, 94, 98, 102, 106, 110, 114, 116, 117, 120,
  121, 124, 127, 130, 134, 137, 140, 144, 147, 150, 154, 159, 163, 167, 170, 174, 178,
  180, 182, 183, 185, 187, 188.5, 190, 192, 193, 195, 198, 199, 200, 203, 205, 209, 212,
  215, 220, 225, 230, 235, 240];

app.use(express.static('public'));

const parser = port.pipe(new Readline());
parser.on('data', sendSensorData);

io.sockets.on('connection', (socket) => console.log(socket.id));


function sendSensorData(data) {
  let allReadings = data.split(',');
  const readingsToSend = {};

  allReadings.forEach(reading => {
    let type = reading.substring(0, 2);
    let valueString = reading.substring(2);
    let value = parseInt(valueString);
    if (type === "WT") {
      const unroundedTemp = getTempInF(value);
      readingsToSend.waterTemp = Math.round(unroundedTemp);
    } else if (type === "OT") {
      readingsToSend.oilTemp = value;
    }
  });

  function getTempInF(value) {
    for (i = 0; i < tempRawData.length - 1; i++) {
      if (value < 536) {
        return 80
      } else if (value >= tempRawData[i] && value < tempRawData[i + 1]) {
        let sensorMax = tempRawData[i + 1];
        let sensorMin = tempRawData[i];
        let sensorRange = sensorMax - sensorMin;
        let differenceToReading = value - sensorMin;

        let percentile = differenceToReading / sensorRange;

        let responseMax = correspondingTemp[i + 1];
        let responseMin = correspondingTemp[i];
        let responseRange = responseMax - responseMin;

        return responseRange * percentile + responseMin;

      } else if (value > 936) {
        return 'error';
      }
    }
  }

  readingsToSend.timestamp = new Date();

  console.log(data);
  io.emit('sensor', readingsToSend);
}
