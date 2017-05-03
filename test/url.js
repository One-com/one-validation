/*global beforeEach, describe, it*/
var unexpected = require('unexpected'),
    oneValidation = require('../validation');

describe('url validation', function () {
    var regExp,
        expect = unexpected.clone().addAssertion('[not] to pass', function (expect, subject) {
            expect(subject, '[not] to match', regExp);
        });

    describe('#httpUrl', function () {
        beforeEach(function () {
            regExp = oneValidation.httpUrl;
        });

        it('should accept valid input', function () {
            expect('http://www.foo.com/', 'to pass');
            expect('http://www.foo.com?query=simple', 'to pass');
            expect('http://www.foo.com?query=where&is=theTruth', 'to pass');
            expect('http://www.foo.com?query=where&is=theTruth#in=the&world=true', 'to pass');
            expect('http://www.foo.com/~username/', 'to pass');
            expect('http://www.foo.com/?', 'to pass');
            expect('http://www.foo.com/?#', 'to pass');
            expect('http://example.com/foo/bar&something=blah', 'to pass');
            expect('http://foo.com/blah_blah', 'to pass');
            expect('http://foo.com/blah_blah/', 'to pass');
            expect('http://foo.com/blah_blah_(wikipedia)', 'to pass');
            expect('http://foo.com/blah_blah_(wikipedia)_(again)', 'to pass');
            expect('http://www.example.com/wpstyle/?p=364', 'to pass');
            expect('https://www.example.com/foo/?bar=baz&inga=42&quux', 'to pass');
            expect('http://userid:password@example.com:8080', 'to pass');
            expect('http://userid:password@example.com:8080/', 'to pass');
            expect('http://userid@example.com', 'to pass');
            expect('http://userid@example.com/', 'to pass');
            expect('http://userid@example.com:8080', 'to pass');
            expect('http://userid@example.com:8080/', 'to pass');
            expect('http://userid:password@example.com', 'to pass');
            expect('http://userid:password@example.com/', 'to pass');
            expect('http://foo.com/blah_(wikipedia)#cite-1', 'to pass');
            expect('http://foo.com/blah_(wikipedia)_blah#cite-1', 'to pass');
            expect('http://foo.com/(something)?after=parens', 'to pass');
            expect('http://code.google.com/events/#&product=browser', 'to pass');
            expect('http://j.mp', 'to pass');
            expect('http://foo.com/?q=Test%20URL-encoded%20stuff', 'to pass');
            expect('http://-.~_!$&\'()*+,;=:%40:80%2f::::::@example.com', 'to pass');
            expect('http://1337.net', 'to pass');
            expect('http://a.b-c.de', 'to pass');
            expect('http://www.hitta.se/karta#tool=coordinate&vkid=dWR_Xnqbbk&center=6411726:1290882&zl=9&type=map&bounds=6411510:1290540,6411943:1291224', 'to pass');
            // IP addresses for hostnames
            expect('http://142.42.1.1/', 'to pass');
            expect('http://142.42.1.1:8080/', 'to pass');
            expect('http://223.255.255.254', 'to pass');
            // New TLDs
            expect('http://www.foo.cq/', 'to pass');
            expect('http://www.foo.randomtld/', 'to pass');
            // SLDs
            expect('http://foo.co.uk', 'to pass');
            expect('http://foo.org.uk', 'to pass');
        });

        it('should reject invalid input', function () {
            expect('http://localhost/', 'not to pass');
            expect('@.foo.com/?', 'not to pass');
            expect('http://1.1.256.1', 'not to pass');
            expect('http://1.1.1.300', 'not to pass');
        });
    });

    describe('#httpUrlIdn', function () {
        beforeEach(function () {
            regExp = oneValidation.httpUrlIdn;
        });

        it('should accept valid input', function () {
            expect('http://✪df.ws/123', 'to pass');
            expect('http://⌘.ws', 'to pass');
            expect('http://⌘.ws/', 'to pass');
            expect('http://☺.damowmow.com/', 'to pass');
            expect('http://مثال.إختبار', 'to pass');
            expect('http://例子.测试', 'to pass');
            expect('http://उदाहरण.परीक्षा', 'to pass');
        });

        it('should reject invalid input', function () {
            expect('http://foo.com/unicode_(✪)_in_parens', 'not to pass');
            expect('http://➡.ws/䨹', 'not to pass');
            expect('http://1.1.256.1', 'not to pass');
            expect('http://1.1.1.300', 'not to pass');
        });
    });

    describe('#domainIdn', function () {
        beforeEach(function () {
            regExp = oneValidation.domainIdn;
        });

        it('should accept valid input');

        it('should reject invalid input', function () {
            expect('foo:bar.com', 'not to pass');
            expect('foo/bar.com', 'not to pass');
            expect('foo%bar.com', 'not to pass');
        });
    });

    describe('#rootRelativeUrl', function () {
        beforeEach(function () {
            regExp = oneValidation.rootRelativeUrl;
        });

        it('should accept valid input', function () {
            expect('/', 'to pass');
            expect('/foo.bar', 'to pass');
            expect('/foo.bar/baz.quux?foo=bar&quux=zoo#pronk', 'to pass');
        });

        it('should reject invalid input', function () {
            expect('', 'not to pass');
        });
    });
});
