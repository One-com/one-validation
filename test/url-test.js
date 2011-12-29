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
        context['should' + (shouldMatch ? "" : "n't") + ' match ' + string] = function () {
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
        'http://www.foo.com/?',
        'http://www.foo.com/?#'
    ]))
    .addBatch(createBatch('url', false, [
        'http://www.foo.cq/',
        '@.foo.com/?'
    ]))
['export'](module);

