(function () {
    var quotes_index = {
        Init: _init
    };

    module.exports = quotes_index.Init;

    /*****
     * INIT VARIABLES
     */

    var Quotes = [];
    var _client;

    function _init(ioclient) {
        var quotesSocket = ioclient.connect(process.env.quotes_endpoint);

        quotesSocket.on('connect', function (data) {
            console.info('Quotes Server Connected!');
        });

        quotesSocket.on('disconnect', function (data) {
            console.info('Quotes Server Disconnected!');
        });


        quotesSocket.on('quotes6', function (data) {
            var quote = data.msg;
            if (quote) {
                _processQuotes(quote);
            }
            _onQuote();
        });

        return {
            InitClientQuotes: _initClientQuotes,
            GetQuotes: _getQuotes,
        };

        function _initClientQuotes(symbols, client) {
            quotesSocket.emit('subscribe', symbols, process.env.quotes_type, 6);
            _client = client;
        }
    }

    function _processQuotes(currentQuote) {
        currentQuote.Bid = currentQuote.bid;
        delete currentQuote.bid;
        currentQuote.Stamp = new Date(currentQuote.lasttime * 1000);
        currentQuote.Stamp.setHours(currentQuote.Stamp.getHours() - 10);
        if (Quotes.length) {
            for (var x = 0; x < Quotes.length; x++) {
                if (Quotes[x].symbol == currentQuote.symbol) {
                    Quotes[x] = currentQuote;
                    return;
                }
            }
        }
        Quotes.push(currentQuote);
    }

    function _getQuotes() {
        return Quotes;
    }

    function _onQuote() {
        if (_client) {
            _client.emit('newquote', Quotes);
        }
    }
})();