/*global module, window*/
/*jslint regexp:false*/

(function () {
    "use strict";

    // Poor man's /x flag:
    // new RegExp(concatRegExps(
    //    /blabla/,
    //    /blablabla/
    // ), "i").test(string);
    function concatRegExps() { // ...
        var source = '';
        for (var i = 0 ; i < arguments.length ; i += 1) {
            if (Object.prototype.toString.call(arguments[i]) === '[object RegExp]') {
                source += arguments[i].source;
            } else {
                source += arguments[i];
            }
        }
        return source;
    }

    var name,
        validation = {
            functions: {}
        },
        fragments = {
            tld: /(?:a[cdefgilmnoqrstuwxz]|aero|arpa|asia|b[abdefghijmnorstvwyz]|biz|c[acdfghiklmnoruvwxyz]|cat|com|coop|d[ejkmoz]|e[cegrstu]|edu|f[ijkmor]|g[abdefghilmnpqrstuwy]|gov|h[kmnrtu]|i[delmnoqrst]|info|int|j[emop]|jobs|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|mil|mobi|museum|n[acefgilopruz]|name|net|om|org|p[aefghklmnrstwy]|pro|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnoprtvwz]|tel|travel|u[agksyz]|v[aceginu]|w[fs]|xxx|xn--(?:0zwm56d|11b5bs3a9aj6g|3e0b707e|45brj9c|80akhbyknj4f|90a3ac|9t4b11yi5a|clchc0ea0b2g2a9gcd|deba0ad|fiqs8s|fiqz9s|fpcrj9c3d|fzc2c9e2c|g6w251d|gecrj9c|h2brj9c|hgbk6aj7f53bba|hlcj6aya9esc7a|j6w193g|jxalpdlp|kgbechtv|kprw13d|kpry57d|lgbbat1ad8j|mgbaam7a8h|mgbayh7gpa|mgbbh1a71e|mgbc0a9azcg|mgberp4a5d4ar|o3cw4h|ogbpf8fl|p1ai|pgbs0dh|s9brj9c|wgbh1c|wgbl6a|xkc2al3hye2a|xkc2dl3a5ee0h|yfro4i67o|ygbi2ammx|zckzah)|测试|परीक्षा|한국|ভারত|испытание|срб|테스트|சிங்கப்பூர்|טעסט|中国|中國|భారత్|ලංකා|測試|ભારત|भारत|آزمایشی|பரிட்சை|香港|δοκιμή|إختبار|台湾|台灣|الجزائر|امارات|الاردن|بھارت|المغرب|السعودية|ไทย|سورية|рф|تونس|ਭਾਰਤ|مصر|قطر|இலங்கை|இந்தியா|新加坡|فلسطين|テスト|y[et]|z[amw])/i, // See /lib/tld.js
            domainPart: /[a-z0-9](?:[\-a-z0-9]*[a-z0-9])?/i,
            port: /\d{1,5}/,
            localpart: /[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+(?:\.[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+)*/i, // taken from: http://www.regular-expressions.info/email.html
            user: /[^:@\/]+/i,
            password: /[^:@\/]+?/i,
            scheme: /(?:ftp|https?|tel|sms)/i,
            pathname: /[\w%+@*\-\.\/\(\)]*/i,
            search: /[\w%+@*\-\.\/\(\)\?&=;]*/,
            hash: /[\w%+@*\-\.\/\(\)\?#&=;]*/
        };

    // Highlevel regexes composed of regex fragments
    fragments.domain = new RegExp(fragments.domainPart.source + "\\." + fragments.tld.source, "i");
    fragments.subdomain = new RegExp("(?:" + fragments.domainPart.source + "\\.)*" + fragments.domain.source, "i");
    fragments.email = new RegExp(fragments.localpart.source + "@" + fragments.subdomain.source, "i");
    fragments.url = new RegExp(fragments.scheme.source + "://(?:" + fragments.user.source + "(?::" + fragments.password.source + ")?@)?" + fragments.subdomain.source + "(?::" + fragments.port.source + ")?(?:" + fragments.pathname.source + "(?:" + fragments.search.source + ")?(?:" + fragments.hash.source + ")?)?", "i"); // See http://www.ietf.org/rfc/rfc1738.txt
    fragments.mailto = new RegExp("mailto:" + fragments.email.source, "i"); // TODO: This needs to be improved

    // [protocol"://"[username[":"password]"@"]hostname[":"port]"/"?][path]["?"querystring]["#"fragment]
    fragments.url = new RegExp(concatRegExps(
        fragments.scheme, "://",
        "(?:",
            fragments.user,
            "(?::",
                fragments.password,
            ")?@",
        ")?",
        fragments.subdomain,
        "(?::", fragments.port, ")?",
        "(?:/", fragments.pathname,
            "(?:\\?", fragments.search, ")?",
            "(?:#", fragments.hash, ")?",
        ")?" // See http://www.ietf.org/rfc/rfc1738.txt
    ), "i");

    // Add convenience regexes and functions
    for (name in fragments) {
        if (fragments.hasOwnProperty(name)) {
            validation[name] = new RegExp("^" + fragments[name].source + "$", "i");
            validation.functions[name] = (function (name) {
                return function (value) {
                    return validation[name].test(value);
                };
            }(name));
        }
    }

    // Expose regex fragments for matching inside larger texts
    validation.fragments = fragments;

    // Browser
    if (typeof window !== 'undefined') {
        window.one = window.one || {};
        window.one.validation = validation;
    }

    // CommonJS
    if (typeof module !== 'undefined') {
        module.exports = validation;
    }
}());
