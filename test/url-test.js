var vows = require('vows'),
    assert = require('assert'),
//    _ = require('underscore'),
    validation = require('../validation');

function createBatch(name, shouldMatch, strings) {
    var regExp = validation[name],
        context = {
            topic: regExp
        },
        batch = {};
    batch['the ' + name + ' regexp'] = context;
    strings.forEach(function (string) {
        context['should' + (shouldMatch ? '' : "n't") + ' match ' + string] = function () {
            if (shouldMatch) {
                assert.ok(regExp.test(string));
            } else {
                assert.ok(!regExp.test(string));
            }
        };
    });
    return batch;
}

vows
    .describe('url validation')
    .addBatch(createBatch('url', true, [
        'http://www.foo.com/',
        'http://www.foo.com/~username/',
        'http://www.foo.com/?',
        'http://www.foo.com/?#',
        'http://example.com/foo/bar&something=blah',
        'http://foo.com/blah_blah',
        'http://foo.com/blah_blah/',
        'http://foo.com/blah_blah_(wikipedia)',
        'http://foo.com/blah_blah_(wikipedia)_(again)',
        'http://www.example.com/wpstyle/?p=364',
        'https://www.example.com/foo/?bar=baz&inga=42&quux',
        'http://userid:password@example.com:8080',
        'http://userid:password@example.com:8080/',
        'http://userid@example.com',
        'http://userid@example.com/',
        'http://userid@example.com:8080',
        'http://userid@example.com:8080/',
        'http://userid:password@example.com',
        'http://userid:password@example.com/',
        'http://foo.com/blah_(wikipedia)#cite-1',
        'http://foo.com/blah_(wikipedia)_blah#cite-1',
        'http://foo.com/(something)?after=parens',
        'http://code.google.com/events/#&product=browser',
        'http://j.mp',
        'http://foo.com/?q=Test%20URL-encoded%20stuff',
        'http://-.~_!$&\'()*+,;=:%40:80%2f::::::@example.com',
        'http://1337.net',
        'http://a.b-c.de',
        'http://www.hitta.se/karta#tool=coordinate&vkid=dWR_Xnqbbk&center=6411726:1290882&zl=9&type=map&bounds=6411510:1290540,6411943:1291224',
        // IP addresses for hostnames
        'http://142.42.1.1/',
        'http://142.42.1.1:8080/',
        'http://223.255.255.254'
    ]))
    .addBatch(createBatch('url', false, [
        'http://localhost/',
        'http://www.foo.cq/',
        '@.foo.com/?',
        'http://1.1.256.1',
        'http://1.1.1.300'
    ]))
    .addBatch(createBatch('httpUrlRelaxed', true, [
        'http://localhost/'
    ]))
    .addBatch(createBatch('httpUrlIdn', true, [
        'http://✪df.ws/123',
        'http://⌘.ws',
        'http://⌘.ws/',
        'http://☺.damowmow.com/',
        'http://مثال.إختبار',
        'http://例子.测试',
        'http://उदाहरण.परीक्षा'
    ]))
    .addBatch(createBatch('httpUrlIdn', false, [
        'http://foo.com/unicode_(✪)_in_parens',
        'http://➡.ws/䨹'
    ]))
['export'](module);
