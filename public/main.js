const socket = io();

socket.on('temperature-data', function(data){
    console.log(data);
    str_temp = JSON.stringify(data).replace("\\r", " °C").replace(/\"/g, "");
    document.getElementById("DHTtemp").innerHTML = str_temp;
});

socket.on('humidity-data', function(data){
    console.log(data);
    str_temp_humid = JSON.stringify(data).replace("\\r", " %").replace(/\"/g, "");
    document.getElementById("Humid").innerHTML = str_temp_humid;
});

socket.on('thermistor-data', function(data){
    console.log(data);
    str_temp_therm = JSON.stringify(data).replace("\\r", " °C").replace(/\"/g, "");
    document.getElementById("Therm").innerHTML = str_temp_therm;
});

socket.on('sound-data', function(data){
    console.log(data);
    str_temp_sound = JSON.stringify(data).replace("\\r", " dB").replace(/\"/g, "");
    document.getElementById("Soundy").innerHTML = str_temp_sound;
});

socket.on('ultras-data', function(data){
    console.log(data);
    str_temp_uso = JSON.stringify(data).replace("\\r", " cm").replace(/\"/g, "");
    document.getElementById("usonic").innerHTML = str_temp_uso;
});