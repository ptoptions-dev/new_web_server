(function () {
    var _servertime_index = {
        Init: function (emit) {
            setInterval(function () {
                emit('servertime', new Date());
            }, 999);
        }
    };

    module.exports = _servertime_index.Init
})();