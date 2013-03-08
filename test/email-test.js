var vows = require('vows'),
    assert = require('assert'),
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
    .describe('email validation')
    .addBatch(createBatch('email', true, [
        'foo@bar.dk'
    ]))
    .addBatch(createBatch('email', false, [
        'foo.@bar.dk'
    ]))
    .addBatch(createBatch('emailRelaxed', true, [
        'foo.@bar.dk'
    ]))
['export'](module);
