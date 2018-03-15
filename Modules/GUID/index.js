(function () {
    var getUUID = require('uuid/v4');
    var RegisteredKey = [];
    var guid_index = {
        Init: function (emit) {
            return {
                Generate: _generateKey,
                IsKeyRegistered: _checkKey,
                GetClientIP: _getClientIP
            };

            function _generateKey(clientreq) {
                var registered = false;
                var uuid = getUUID();
                var ip = _getClientIP(clientreq);
                if (RegisteredKey.length) {
                    if (_checkKey(ip, uuid)) {
                        registered = true;
                    } else {
                        RegisteredKey.push({
                            ClientIP: ip,
                            Key: uuid
                        });
                    }
                } else {
                    RegisteredKey.push({
                        ClientIP: ip,
                        Key: uuid
                    });
                }
                return !registered ? uuid : "Unable to generated UUID";
            }

            function _checkKey(clientIP, key) {
                if (!clientIP && !key || !RegisteredKey.length) return false;
                for (var x = 0; x < RegisteredKey.length; x++) {
                    if (RegisteredKey[x].ClientIP == clientIP && RegisteredKey[x].Key == key) {
                        return true;
                    }
                }
                return false;
            }

            function _getClientIP(req) {
                var ip;
                if (req.headers['x-forwarded-for']) {
                    ip = req.headers['x-forwarded-for'].split(",")[0];
                } else if (req.connection && req.connection.remoteAddress) {
                    ip = req.connection.remoteAddress;
                } else {
                    ip = req.ip;
                }
                return ip;
            }
        }
    };

    module.exports = guid_index.Init
})();