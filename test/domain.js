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
