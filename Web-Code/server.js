var fs          =   require('fs');
var http        =   require('http');
var socketio    =   require('socket.io');
var url         =   require("url");
var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor

var socketServer;
var serialPort;
var portName  =  '/dev/ttyACM0';
var sendData  =  "";
var i = 0;

function startServer(route,handle,debug)
{
	function onRequest(request, response) { 
		var pathname = url.parse(request.url).pathname; 
		console.log("Request for " + pathname + " received");
		var content = route(handle,pathname,response,request,debug);
	}
	
	var httpServer = http.createServer(onRequest).listen(8080, function() {
		console.log("Server listening at: http://localhost:8080");
	}); 
	
	serialListener(debug);
	initSocketIO(httpServer,debug);
}

function initSocketIO(httpServer,debug)
{
	socketServer = socketio.listen(httpServer);
	
	if(debug == false)
	{
		socketServer.set('log level', 1); // socket.io debug OFF
	}
	
	socketServer.on('connection', function (socket) {
		console.log("user connected");
		socket.emit('onconnection', {pollOneValue:sendData});		
		
    });
}

function serialListener(debug)
{
	var receivedData = "";

	serialPort = new SerialPort(portName, {
		parser: serialport.parsers.readline("\n"),
		baudrate    :  9600,
		dataBits    :  8,
		parity      : 'none',
		stopBits    :  1,
		flowControl :  false
	});

	serialPort.on("open", function () 
	{	    
	    console.log('Iniciando Comunicação Serial');
	    
	    serialPort.on('data', function(data) 
	    {
			var receivedData = data;

			sendData = receivedData.split('.')  //Split data by '.'
		
			for(i=0; i<sendData.length; i++)     //transmit the sendData array
			{
			
				socketServer.emit('updateData', {pollOneValue:sendData[i]});

			}
	   });       
   });  
}

exports.start = startServer;

