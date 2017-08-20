(function()
{

    const chromeLauncher = require("chrome-launcher");
    const CDP = require("chrome-remote-interface");
    const StaticServer = require("static-server");

    var chromePort = 9992;
    var chrome;

    this.usePort = (port) =>
    {
        chromePort = port;
    };

    async function staticServer()
    {
        var server = new StaticServer({
            rootPath: __dirname + "/../",
            port: 8889,
            cors: "*"
        });
        server.on("request", function (req, res) {
        });
        server.start();

        return server;
    }

    this.staticServer = staticServer;

    this.prepareChrome = () =>
    {
        return new Promise(resolve =>
        {
            if (chrome)
                resolve(chrome);

            chromeLauncher.launch({
                port: chromePort,
                chromeFlags: [
                    "--window-size=1024,768",
                    "--disable-gpu",
                    "--headless"
                ]
            }).then(_chrome =>
            {
                chrome = _chrome;
                resolve(_chrome);
            });
        });
    }

    this.newPage = (url) =>
    {
        return new Promise(resolve =>
        {
            CDP({port: chrome.port}).then((protocol) =>
            {
                protocol.Network.enable();
                var page = protocol.Page;
                page.enable();
                page.navigate({url: "http://localhost:8889/tests/" + url});

                page.loadEventFired(async () =>
                {
                    resolve(protocol);
                });
            });
        });
    };

    this.prepareForEval = (fn) =>
    {
        fn = fn.toString();
        return { expression: `(${fn})()` };
    };


}).apply(module.exports);