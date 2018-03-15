(function () {
    var getUUID = require('uuid/v4');


    var socket_index = {
        Initialize: function (listener, Global) {
            var io_server = require('socket.io').listen(listener);
            var io_client = require('socket.io-client');

            var quote_module = require('./Quotes')(io_client);
            // io_server.set('authorization', function (handshakeData, cb) {
            //     debugger;
            //     //use handshakeData to authorize this connection
            //     //Node.js style "cb". ie: if auth is not successful, then cb('Not Successful');
            //     //else cb(null, true); //2nd param "true" matters, i guess!!
            // });
            //For Tracking When User Connects:
            io_server.sockets.on("connection", function (client) {

                client.on('subscribe_quotes', function (data) {
                    if (data.symbols && data.key) {
                        if (Global.GUID.IsKeyRegistered(Global.GUID.GetClientIP(client.request), data.key)) {
                            quote_module.InitClientQuotes(data.symbols, Emitter);
                        }
                    }
                    console.log('client %s joined...', client.id);
                });

                //ServerTime
                require('./ServerTime')(Emitter);

                //RegisterClientID
                Emitter('generatekey', Global.GUID.Generate(client.request));


                //HELPER

                /**
                 * 
                 * @param {*} method 
                 * @param {*} data 
                 */
                function Emitter(method, data) {
                    if (method == undefined || data == undefined) return;
                    client.emit(method, data);
                }
            });

            io_server.sockets.on("disconnection", function (client) {
                console.log('Client Disconnected');
            });
        }
    }

    module.exports = socket_index.Initialize;
})();