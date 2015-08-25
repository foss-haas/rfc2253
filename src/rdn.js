'use strict';
import escape from './escape';

function imap(fn) {
  const result = [];
  for (let value of this) {
    result.push(fn(value));
  }
  return result;
}

function deriveInternalKey(key) {
  if (key instanceof Buffer) return escape(key);
  return String(key).toUpperCase();
}

export default class RelativeDistinguishedName {
  constructor(map) {
    this._values = new Map();
    this._names = new Map();
    this.size = 0;
    if (map) {
      if (typeof map.entries === 'function') {
        for (let [key, value] of map.entries()) {
          this.set(key, value);
        }
      } else {
        Object.keys(map).forEach(key => {
          this.set(key, map[key])
        });
      }
    }
  }
  has(key) {
    const internalKey = deriveInternalKey(key);
    return this._values.has(internalKey);
  }
  get(key) {
    const internalKey = deriveInternalKey(key);
    return this._values.get(internalKey);
  }
  set(key, value) {
    const internalKey = deriveInternalKey(key);
    this._names.set(internalKey, key);
    this._values.set(internalKey, String(value));
    this.size = this.count();
  }
  delete(key) {
    const internalKey = deriveInternalKey(key);
    if (!this._names.has(internalKey)) return false;
    this._names.delete(internalKey);
    this._values.delete(internalKey);
    this.size = this.count();
    return true;
  }
  count() {
    return this._names.size;
  }
  match(rdn) {
    if (!(rdn instanceof RelativeDistinguishedName)) return false;
    if (this._names.size !== rdn._names.size) return false;
    for (let [key, value] of this._values.entries()) {
      if (rdn.get(key) !== value) return false;
    }
    return true;
  }
  format() {
    return this._names.keys()::imap(
      key => `${escape(this._names.get(key))}=${escape(this._values.get(key))}`
    ).reverse().join('+');
  }
  toString() {
    return this._names.keys()::imap(
      key => `${this._names.get(key)}=${this._values.get(key)}`
    ).join('/');
  }
}
