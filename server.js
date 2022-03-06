const { SerialPort, ReadlineParser } = require('serialport');
const {ReadLineParser} = require('@serialport/parser-readline');
const client = require('prom-client');
const Registry = client.Registry;
const register = new Registry;


// server
var express = require('express');
var app = express();
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res)=>{
    res.sendFile('index.html')
});


// socket.io
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

// port open
const Port = new SerialPort({
    path: 'COM5',
    baudRate: 9600,

    // error checking
    function(err){
        if(err){
            console.log('Error: ', err.message);
        }
    },
});

const parser = Port.pipe(new ReadlineParser({delimeter: '\r\n'}));


// Prometheus Metrics
const tempCounter = new client.Gauge({
    name: 'dht_temp',
    help: 'takes in temperature of dht11',
});

const humidityCounter = new client.Gauge({
    name: 'dht_humidity',
    help: 'takes in humidity of dht11',
});

const thermCounter = new client.Gauge({
    name: 'therm_temp',
    help: 'takes in temperature of thermistor',
});

const soundCounter = new client.Gauge({
    name: 'sound',
    help: 'takes in sound level in dB',
});

const usonicCounter = new client.Gauge({
    name: 'ultrasonic',
    help: 'takes in measurement distance',
});

register.registerMetric(tempCounter);
register.registerMetric(humidityCounter);
register.registerMetric(thermCounter);
register.registerMetric(soundCounter);
register.registerMetric(usonicCounter);

register.setDefaultLabels({
    app: 'arduino-api'
});


// Data logging for server and prometheus
parser.on('data', function(data){

    console.log(data)
 
    if(data.includes("DHT-Temperature:")){
        data = data.replace("DHT-Temperature: ", "");
        io.emit('temperature-data', data);
        tempCounter.set(Number(data));
    }
    else if(data.includes("Humidity")){
        data = data.replace("Humidity: ", "");
        io.emit('humidity-data', data)
        humidityCounter.set(Number(data));
    }
    else if(data.includes("Thermistor-Temp: ")){
        data = data.replace("Thermistor-Temp: ", "");
        io.emit('thermistor-data', data)
        thermCounter.set(Number(data));
    }
    else if(data.includes("Sound: ")){
       data = data.replace("Sound: ", "");
        io.emit('sound-data', data)
        soundCounter.set(Number(data));
    }
    else if(data.includes("Distance: ")){
        data = data.replace("Distance: ", "");
        io.emit('ultras-data', data)
        usonicCounter.set(Number(data));
    }

});


//Prometheus scrape
app.get('/metrics', async(req, res) => {
    res.set('Content-Type', register.contentType)
    res.end(await register.metrics())
})

server.listen(process.env.PORT || 3000, '0.0.0.0');