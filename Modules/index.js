(function () {
    var socket_index = {
        Initialize: function (listener) {
            var io_server = require('socket.io').listen(listener);
            var io_client = require('socket.io-client');

            var quote_module = require('./Quotes')(io_client);
            
            //For Tracking When User Connects:
            io_server.sockets.on("connection", function (client) {

                client.on('join', function (data) {
                    if (data.symbols) {
                        quote_module.InitClientQuotes(data.symbols, client);
                    }
                    console.log('client joined...');
                });
                
                require('./ServerTime')(client);
            });

            io_server.sockets.on("disconnect", function (client) {
                console.log('Client Disconnected');
            });
        }
    }

    module.exports = socket_index.Initialize;
})();