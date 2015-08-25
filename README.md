**rfc2253** is a parser and formatter for X.500/X.501 distinguished names based on [RFC 2253](http://www.ietf.org/rfc/rfc2253.txt) as used in LDAPv3 and SSL certificates.

[![license - MIT](https://img.shields.io/npm/l/rfc2253.svg)](http://foss-haas.mit-license.org) [![Dependencies](https://img.shields.io/david/foss-haas/rfc2253.svg)](https://david-dm.org/foss-haas/rfc2253)

[![NPM status](https://nodei.co/npm/rfc2253.png?compact=true)](https://www.npmjs.com/package/rfc2253)

# Install

This module requires an ES2015 (formerly known as ES6) compatible `Map` implementation to be globally available. For older versions of Node.js you may have to use an appropriate shim, e.g. [core-js](https://npmjs.org/package/core-js).

## With NPM

```sh
npm install rfc2253
```

## From source

```sh
git clone https://github.com/foss-haas/rfc2253.git
cd rfc2253
npm install
npm run dist
```

# API

## parse

Parses an RFC 2253 string representation of a distinguished name and returns a `DistinguishedName` object.

**Arguments**

* **str**: *string*

  A UTF-8 encoded distinguished name.

**Examples**

```js
const str = 'CN=Wayne\\, Bruce,DC=Wayne Enterprises';
let dn = rfc2253.parse(str);
dn.get('DC'); // 'Wayne Enterprises'
str === dn.format(); // true
```

## format

Formats a `DistinguishedName` or `RelativeDistinguishedName` instance according to RFC 2253 and returns a UTF-8 encoded string.

**Arguments**

* **dn**: *DistinguishedName* or *RelativeDistinguishedName*

  The distinguished name or relative distinguished name to format as a string.

**Examples**

*TODO*

## escape

Escapes an attribute key or value and returns the escaped string.

**Arguments**

* **value**: *any*

  The value to escape. If the value is a `Buffer` it will be formatted as an octothorpe (`#`) followed by the hexadecimal representation of each byte in the buffer. Otherwise the value will be converted to a string and escaped according to RFC 2253.

**Examples**

```js
rfc2253.escape(' "hello", <world> '); // '\\ \\"hello\\"\\, \\<world\\>\\ '
rfc2253.escape(new Buffer([1,2,3,16,255])); // '#01020310ff'
```

## class DistinguishedName

Represents a distinguished name consisting of zero or more relative distinguished names.

### match

Determines whether the given `DistinguishedName` is identical with this DN. Returns `true` if both DNs contain the same number of RDNs in the same order and each pair of RDNs shares exactly the same keys and values (regardless of order). Returns `false` otherwise.

**Arguments**

* **dn**: *DistinguishedName*

  Another `DistinguishedName` to compare to.

**Example**

```js
let dn1 = rfc2253.parse(str);
let dn2 = rfc2253.parse(str);
dn1.match(dn2); // true
dn2.match(dn1); // true
```

### format

Formats this DN according to RFC 2253. Equivalent to passing the DN to the `format` function.

**Examples**

*TODO*

### toString

Converts the DN to a human-readable string representation. Note that RDNs will appear in reverse order.

**Examples**

*TODO*

### has

Checks whether a `RelativeDistinguishedName` exists for the given offset or whether any of the RDNs has the given key.

**Arguments**

* **key**: *any*

  If `key` is a number, it is the offset of a `RelativeDistinguishedName`. Otherwise it is a key in at least one RDN.

**Examples**

*TODO*

### get

Returns the `RelativeDistinguishedName` at the given offset or looks up the given key and returns the first value.

**Arguments**

* **key**: *any*

  If `key` is a number, it is the offset of a `RelativeDistinguishedName`. Otherwise it is a key in at least one RDN.

**Examples**

```js
let dn = rfc2253.parse('CN=Wayne\\, Bruce,DC=Wayne Enterprises');
dn.get('DC'); // 'Wayne Enterprises'
let rdn = dn.get(0); // <RelativeDistinguishedName>
rdn.get('CN'); // 'Wayne, Bruce'
```

### set

Sets the given offset to the given `RelativeDistinguishedName` or sets the given key to the given value.

If the key does not yet exist on any of the RDNs, a new `RelativeDistinguishedName` will be created for the given key and value and appended to the DN.

**Arguments**

* **key**: *any*

  If `key` is a number, it is the offset of the `RelativeDistinguishedName`. Otherwise it is the key in a `RelativeDistinguishedName`.

* **value**: *any*

  If `key` is a number, this is the `RelativeDistinguishedName` the given offset will be set to. Otherwise this is the value the key will be set to.

**Examples**

*TODO*

### delete

*TODO*

### push

*TODO*

### pop

*TODO*

### unshift

*TODO*

### shift

*TODO*

### count

Returns the number of RDNs that are part of this DN. Also available as the `size` property.

## RelativeDistinguishedName

*TODO*

### match

*TODO*

### format

*TODO*

### toString

*TODO*

### has

*TODO*

### get

*TODO*

### set

*TODO*

### delete

*TODO*

### count

Returns the number of attributes of this RDN. Also available as the `size` property.

# License

The MIT/Expat license. For more information, see http://foss-haas.mit-license.org/ or the accompanying [LICENSE](https://github.com/foss-haas/rfc2253/blob/master/LICENSE) file.
