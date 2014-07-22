# one-validation

[![NPM version](https://badge.fury.io/js/one-validation.png)](http://badge.fury.io/js/one-validation)
[![Build Status](https://travis-ci.org/One-com/one-validation.png?branch=master)](https://travis-ci.org/One-com/one-validation)
[![Coverage Status](https://coveralls.io/repos/One-com/one-validation/badge.png)](https://coveralls.io/r/One-com/one-validation)
[![Dependency Status](https://david-dm.org/One-com/one-validation.png)](https://david-dm.org/One-com/one-validation)

This is a collection of regular expressions for general validation purposes.
The basic design concept is to split up the regexes into semantic parts of the pattern to match.
As an example a url consists of many parts like scheme, optional userinfo, subdomain, domain, toplevel domain, path, query and fragment.
It is a lot easier to write a maintainable and reusable regular expression by mathing each of these parts individually and write a regex that combines the individual later.

The library includes a TLD whitelist that can be updated using make.

This module works as a NodeJS CommonJS module, a require.js AMD module and falls back to exposing itself in the global scope on `one.validation` if included directly in the page.

Package managers:
* npm: `npm install one-validation`
* bower: `bower install validation`

## Supported patterns

* domain
* email
* url

## Examples

### domain and domainIdn

```
validation.domain.test('foo.co.uk');
return true;
```

```
validation.domainIdn.test('hällo-test.de');
return true;
```

### email and emailIdn

```
validation.email.test('test@foo.co.uk');
return true;
```

```
validation.domainIdn.test('test@hällo-test.de');
return true;
```

## Building

```
npm install
make
```
