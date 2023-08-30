/*global beforeEach, describe, it*/
var unexpected = require('unexpected'),
    oneValidation = require('../validation');

describe('domain validation', function () {
    var regExp,
        expect = unexpected.clone().addAssertion('[not] to pass', function (expect, subject) {
            expect(subject, '[not] to match', regExp);
        });

    describe('#domain', function () {
        beforeEach(function () {
            regExp = oneValidation.domain;
        });

        it('should allow a two char tld', function () {
            expect('bar.ab', 'to pass');
        });

        it('should disallow a single char tld', function () {
            expect('bar.a', 'not to pass');
        });

        it('should disallow underscore in domain with no subdomain', function () {
            expect('_example.com', 'not to pass');
        });

        it('should disallow underscore in domain with valid subdomain', function () {
            expect('_sub._example.com', 'not to pass');
        });

        it('should allow underscore at start of subdomain', function () {
            expect('_sub.example.com', 'to pass');
        });

        it('should allow underscore in middle of subdomain', function () {
            expect('sub_domain.example.com', 'to pass');
        });

        it('should allow underscore in end of subdomain', function () {
            expect('sub_.example.com', 'to pass');
        });

        it('should allow underscore in multiple subdomains', function () {
            expect('_sub1.sub_2.sub3_.example.com', 'to pass');
        });

        it('should allow a punycode tld', function () {
            expect('bar.xn--fjq720a', 'to pass');
        });

        it('should disallow an invalid tld', function () {
            expect('bar.c7a', 'not to pass');
        });

        it('should disallow an invalid punycode tld', function () {
            expect('bar.xn--6ca', 'not to pass');
        });
    });

    describe('#domainIdn', function () {
        beforeEach(function () {
            regExp = oneValidation.domainIdn;
        });

        it('should allow a two char tld', function () {
            expect('bar.ab', 'to pass');
        });

        it('should disallow a single char tld', function () {
            expect('bar.a', 'not to pass');
        });
    });
});
