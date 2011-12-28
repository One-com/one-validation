/*global require*/

var fs = require('fs'),
    path = require('path'),
    punycode = require('punycode');

(function () {
    'use strict';

    var http = require('http'),
        options = {
            host: 'data.iana.org',
            path: '/TLD/tlds-alpha-by-domain.txt',
            method: 'GET'
        },
        tldText = '';

    http.get(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            tldText += chunk;
        });
        res.on('end', function () {
            var tlds = tldText.trim().split('\n'),
                buckets = {};
                
            tlds.shift();
            
            for (var i = 0; i < tlds.length; i++) {
                var first = tlds[i].substring(0, 1),
                    rest = tlds[i].substring(1);

                if (!buckets[first]) {
                    buckets[first] = [];
                }

                buckets[first].push(rest);
            }

            var regexes = [];
            for (var prop in buckets) {
                var chars = [],
                    strings = [],
                    puny = [],
                    idn = [],
                    arr = buckets[prop];

                for (var j = 0; j < arr.length; j++) {
                    if (prop === 'X' && arr[j].substring(0,3) === 'N--') {
                        puny.push(arr[j].substring(3));
                        idn.push(punycode.decode(arr[j].substring(3)));
                    } else if (arr[j].length === 1) {
                        chars.push(arr[j]);
                    } else {
                        strings.push(prop + arr[j]);
                    }
                }

                var results = [];
                if (chars.length)   { results.push(prop + (chars.length > 1 ? '[' + chars.join('') + ']' : chars[0])); }
                if (strings.length) { results.push(strings.join('|')); }
                if (puny.length)    { results.push('XN--(?:' + puny.join('|') + ')'); }
                if (idn.length)     { results.push(idn.join('|')); }

                regexes.push(results.join('|'));
            }

            var regexString = '(?:' + regexes.join('|').toLowerCase() + ')';
            
            console.log(regexString);
            var validationJsContents = fs.readFileSync(path.resolve(__dirname, '../validation.js'), 'utf-8');
            validationJsContents = validationJsContents.replace(/tld = \/\(\?:.*?\/i,/, "tld = /" + regexString + "/i,");
            fs.writeFileSync(path.resolve(__dirname, '../validation.js'), validationJsContents, 'utf-8');
        });
    });
}());

