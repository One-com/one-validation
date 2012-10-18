/*global module, window, define*/

(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.one = root.one || {};
        root.one.validation = factory();
    }
}(this, function () {
    "use strict";

    // Poor man's /x flag:
    // new RegExp(concatRegExps(
    //    /blabla/,
    //    /blablabla/
    // ), "i").test(string);
    function concatRegExps() { // ...
        var source = '',
        i = 0;
        for (; i < arguments.length; i += 1) {
            if (Object.prototype.toString.call(arguments[i]) === '[object RegExp]') {
                source += arguments[i].source;
            } else {
                source += arguments[i];
            }
        }
        return source;
    }

    var ipv4DigitRegExpSource = /([0-9]|1?[0-9][0-9]|2[0-4][0-9]|25[0-5])/.source,
        validation = {
            functions: {}
        },
        fragments = {
            tld: "__TLD_REGEX__", // See /lib/tld.js
            domainPart: /[a-z0-9](?:[\-a-z0-9]*[a-z0-9])?/i,
            port: /\d{1,5}/,
            localpart: /[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+(?:\.[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+)*/i, // taken from: http://www.regular-expressions.info/email.html
            user: /[^:@\/]+/i,
            uuid: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
            lowerCaseUuid: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/,
            upperCaseUuid: /[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}/,
            password: /[^@\/]+?/i,
            pathname: /[\w\-\.~%!$&'\(\)*+,;=:@\/]*/,
            search:   /[\w\-\.~%!$&'\(\)*+,;=:@\/?]*/,
            hash:     /[\w\-\.~%!$&'\(\)*+,;=:@\/?#]*/,
            ipv4: new RegExp('(?:' + ipv4DigitRegExpSource + '\\.){3}' + ipv4DigitRegExpSource)
        },
        name;

    // Highlevel regexes composed of regex fragments
    fragments.domain = new RegExp(fragments.domainPart.source + "\\." + fragments.tld.source, "i");
    fragments.subdomain = new RegExp("(?:" + fragments.domainPart.source + "\\.)*" + fragments.domain.source, "i");
    fragments.subdomainRelaxed = new RegExp("(?:" + fragments.domainPart.source + "\\.)+" + fragments.domainPart.source, "i");
    fragments.email = new RegExp(fragments.localpart.source + "@" + fragments.subdomain.source, "i");
    fragments.emailRelaxed = new RegExp(fragments.localpart.source + "@" + fragments.subdomainRelaxed.source, "i");
    fragments.mailtoUrl = new RegExp("mailto:" + fragments.email.source, "i"); // TODO: This needs to be improved
    fragments.mailtoUrlRelaxed = new RegExp("mailto:" + fragments.emailRelaxed.source, "i"); // TODO: This needs to be improved

    // Same as location.pathname + location.search + location.hash in the browser:
    fragments.pathnameSearchHash = new RegExp(concatRegExps(
        "(?:/", fragments.pathname,
            "(?:\\?", fragments.search, ")?",
            "(?:#", fragments.hash, ")?",
        ")?" // See http://www.ietf.org/rfc/rfc1738.txt
    ));

    function createHttpishUrlRegExp(schemeRegExp, isRelaxed) {
        // [protocol"://"[username[":"password]"@"]hostname[":"port]"/"?][path]["?"querystring]["#"fragment]
        return new RegExp(concatRegExps(
            schemeRegExp, "://",
            "(?:",
                fragments.user,
                "(?::",
                    fragments.password,
                ")?@",
            ")?",
            "(?:",
                isRelaxed ? fragments.subdomainRelaxed : fragments.subdomain,
                "|",
                fragments.ipv4,
            ")",
            "(?::", fragments.port, ")?",
            fragments.pathnameSearchHash
        ), "i");
    }

    fragments.httpUrl = createHttpishUrlRegExp(/https?/);
    fragments.httpUrlRelaxed = createHttpishUrlRegExp(/https?/, true);
    fragments.ftpUrl = createHttpishUrlRegExp(/ftp/);
    fragments.ftpUrlRelaxed = createHttpishUrlRegExp(/ftp/, true);

    // Alias 'httpUrl' as 'url' for backwards compatibility:
    fragments.url = fragments.httpUrl;

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

    return validation;
}));
