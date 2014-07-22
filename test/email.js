/*global beforeEach, describe, it*/
var unexpected = require('unexpected'),
    oneValidation = require('../validation');

describe('email validation', function () {
    var regExp,
        expect = unexpected.clone().addAssertion('[not] to pass', function (expect, subject) {
            expect(subject, '[not] to match', regExp);
        });

    describe('#email', function () {
        beforeEach(function () {
            regExp = oneValidation.email;
        });

        it('should accept valid input', function () {
            expect('foo@bar.dk', 'to pass');
            expect('foo@bar.somenewtld', 'to pass');
            expect('foo.@bar.dk', 'to pass');
        });

        it('should reject invalid input', function () {
            expect('foo@bar', 'not to pass');
            expect('foo@dk', 'not to pass');
            expect('foo@例子.测试', 'not to pass');
            expect('foo@उदाहरण.परीक्षा', 'not to pass');
        });
    });

    describe('#emailIdn', function () {
        beforeEach(function () {
            regExp = oneValidation.emailIdn;
        });

        it('should accept valid input', function () {
            expect('foo@bar.dk', 'to pass');
            expect('foo@bar.somenewtld', 'to pass');
            expect('foo.@bar.dk', 'to pass');
            expect('foo@例子.测试', 'to pass');
            expect('foo.@उदाहरण.परीक्षा', 'to pass');
        });

        it('should reject invalid input', function () {
            expect('foo@bar', 'not to pass');
            expect('foo@dk', 'not to pass');
        });
    });
});
