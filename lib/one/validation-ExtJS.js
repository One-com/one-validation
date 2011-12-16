/*global Ext*/
(function () {
    var messages = {
        domain: "is not a valid domain name",
        subdomain: "is not a valid domain name",
        email: "is not a valid email address",
        url: "is not a valid URL",
        mailto: "is not a valid mailto-URL"
    };

    if (typeof Ext !== 'undefined') {
        Ext.require('Ext.data.validations', function () {
            Ext.data.validations[name] = function (config, value) {
                return (value === null && config.optional) || validation[name](value);
            };
            if (messages[name]) {
                Ext.data.validations[name + 'Message'] = messages[name];
            }
        });
    }
}());
