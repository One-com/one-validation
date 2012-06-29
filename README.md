one-validation
==============
This is a collection of regular expressions for general validation purposes.
The basic design concept is to split up the regexes into semantic parts of the pattern to match.
As an example a url consists of many parts like scheme, optional userinfo, subdomain, domain, toplevel domain, path, query and fragment.
It is a lot easier to write a maintainable and reusable regular expression by mathing each of these parts individually and write a regex that combines the individual later.

This module works as a NodeJS CommonJS module, a require.js AMD module and falls back to exposing itself in the global scope on `one.validation` if included directly in the page.

Supported patterns
==================
* domain
* subdomain
* email
* url


