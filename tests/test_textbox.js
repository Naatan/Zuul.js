const helpers = require('./helpers');
const assert = require("assert");
const path = require('path');

(async function()
{

    describe("textbox", () =>
    {
        var protocol, server, chrome;

        before(async () =>
        {
            server = await helpers.staticServer();
            chrome = await helpers.prepareChrome();
            protocol = await helpers.newPage(path.basename(__filename, ".js") + ".html");
        });

        after(() =>
        {
            protocol.close();
            chrome.kill();
            server.stop();
        });

        it("should exist in the dom", async function ()
        {
            var testCode = function () {
                return document.getElementById('ele1');
            };
            var data = await protocol.Runtime.evaluate(helpers.prepareForEval(testCode));
            assert.equal(data.result.className, "HTMLElement");
        });

        it("should be a Zuul element", async function ()
        {
            var testCode = function () {
                return document.getElementById('ele1').isZuul;
            };
            var data = await protocol.Runtime.evaluate(helpers.prepareForEval(testCode));
            assert.equal(data.result.value, true);
        });
    });

})();