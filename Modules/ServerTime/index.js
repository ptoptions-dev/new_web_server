(function () {
    var _servertime_index = {
        Init: function (client) {
            setInterval(function () {
                client.emit('servertime', new Date());
            }, 999);
        }
    };

    module.exports = _servertime_index.Init
})();