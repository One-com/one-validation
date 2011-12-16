/*global module, window*/
/*jslint regexp:false*/

(function () {
    var validation = {
            regex: {}
        },
        install = {
        },
        name,
        tld = /(?:a[cdefgilmnoqrstuwxz]|aero|arpa|asia|b[abdefghijmnorstvwyz]|biz|c[acdfghiklmnoruvwxyz]|cat|com|coop|d[ejkmoz]|e[cegrstu]|edu|f[ijkmor]|g[abdefghilmnpqrstuwy]|gov|h[kmnrtu]|i[delmnoqrst]|info|int|j[emop]|jobs|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|mil|mobi|museum|n[acefgilopruz]|name|net|om|org|p[aefghklmnrstwy]|pro|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnoprtvwz]|tel|travel|u[agksyz]|v[aceginu]|w[fs]|xxx|xn--(?:0zwm56d|11b5bs3a9aj6g|3e0b707e|45brj9c|80akhbyknj4f|90a3ac|9t4b11yi5a|clchc0ea0b2g2a9gcd|deba0ad|fiqs8s|fiqz9s|fpcrj9c3d|fzc2c9e2c|g6w251d|gecrj9c|h2brj9c|hgbk6aj7f53bba|hlcj6aya9esc7a|j6w193g|jxalpdlp|kgbechtv|kprw13d|kpry57d|lgbbat1ad8j|mgbaam7a8h|mgbayh7gpa|mgbbh1a71e|mgbc0a9azcg|mgberp4a5d4ar|o3cw4h|ogbpf8fl|p1ai|pgbs0dh|s9brj9c|wgbh1c|wgbl6a|xkc2al3hye2a|xkc2dl3a5ee0h|yfro4i67o|ygbi2ammx|zckzah)|y[et]|z[amw])/i, // See /lib/tld.js
        domainPart = /[a-z0-9](?:[\-a-z0-9]*[a-z0-9])?/i,
        port = /\d{1,5}/,
        localpart = /[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+(?:\.[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+)*/i, // taken from: http://www.regular-expressions.info/email.html
        user = /[^:@\/]+/i,
        password = /[^:@\/]+?/i,
        scheme = /(?:ftp|https?|tel|sms)/i,
        path = /(?:\/[^ ]*)*/i;

    install.domain = new RegExp(domainPart.source + "\\." + tld.source, "i");
    install.subdomain = new RegExp("(?:" + domainPart.source + "\\.)*" + install.domain.source, "i");
    install.email = new RegExp(localpart.source + "@" + install.subdomain.source, "i");
    install.url = new RegExp(scheme.source + "://(?:" + user.source + "(?::" + password.source + ")?@)?" + install.subdomain.source + "(?::" + port.source + ")?(?:" + path.source + ")?", "i"); // See http://www.ietf.org/rfc/rfc1738.txt
    install.mailto = new RegExp("mailto:" + install.email.source, "i"); // TODO: This needs to be improved

/*jslint floop:true*/
    for (name in install) {
        if (install.hasOwnProperty(name)) {
            (function (name) {
                if (install[name].test) {
                    validation.regex[name] = new RegExp("^" + install[name].source + "$", "i");
                    validation[name] = function (value) {
                        return validation.regex[name].test(value);
                    };
                } else {
                    validation[name] = install[name];
                }
            }(name));
        }
    }
/*jslint floop:false*/

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
