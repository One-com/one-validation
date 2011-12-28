/*global one, Ext*/
(function () {
    "use strict";

    var messages = {
        domain: "is not a valid domain name",
        subdomain: "is not a valid domain name",
        email: "is not a valid email address",
        url: "is not a valid URL",
        mailto: "is not a valid mailto-URL"
    };

    if (typeof Ext !== 'undefined') {
        Ext.require('Ext.data.validations', function () {
            var name,
                functions = one.validation.functions;

            for (name in functions) {
                if (functions.hasOwnProperty(name)) {
                    Ext.data.validations[name] = function (config, value) {
                        return (value === null && config.optional) || functions[name](value);
                    };
                    if (messages[name]) {
                        Ext.data.validations[name + 'Message'] = messages[name];
                    }
                }
            }
        });
    }
}());
