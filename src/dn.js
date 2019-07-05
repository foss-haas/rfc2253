import RelativeDistinguishedName from './rdn';

export default class DistinguishedName {
  constructor(rdns) {
    this._rdns = rdns || [];
    this.size = this._rdns.length;
  }
  has(key) {
    if (typeof key === 'number') return this._rdns[key] !== undefined;
    for (let i = 0; i < this._rdns.length; i++) {
      if (this._rdns[i].has(key)) return true;
    }
    return false;
  }
  get(key) {
    if (typeof key === 'number') return this._rdns[key];
    for (let i = 0; i < this._rdns.length; i++) {
      if (!this._rdns[i].has(key)) continue;
      return this._rdns[i].get(key);
    }
  }
  getAll(key) {
    const results = [];
    for (let i = 0; i < this._rdns.length; i++) {
      if (!this._rdns[i].has(key)) continue;
      const rdnValue = this._rdns[i].get(key);
      if (results.includes(rdnValue)) continue;
      results.push(rdnValue);
    }
    return results;
  }
  set(key, value) {
    if (typeof key === 'number') {
      if (value instanceof RelativeDistinguishedName) {
        this._rdns[key] = value;
        this.size = this.count();
        return;
      } else throw new Error(`Not a RelativeDistinguishedName: ${value}`);
    }
    if (!(key instanceof Buffer)) key = String(key);
    if (!(value instanceof Buffer)) value = String(value);
    for (let i = 0; i < this._rdns.length; i++) {
      if (!this._rdns[i].has(key)) continue;
      this._rdns[i].set(key, value);
      return;
    }
    let rdn = new RelativeDistinguishedName();
    rdn.set(key, value);
    this._rdns.push(rdn);
    this.size = this.count();
    return this.size;
  }
  delete(key) {
    if (typeof key === 'number') {
      let items = this._rdns.splice(key, 1);
      this.size = this.count();
      return items.length > 0;
    }
    return this._rdns.reduce(
      (result, rdn) => rdn.has(key) ? rdn.delete(key) : result,
      false
    );
  }
  push(rdn) {
    if (rdn instanceof RelativeDistinguishedName) {
      this._rdns.push(rdn);
      this.size = this.count();
      return this.size;
    } else throw new Error(`Not a RelativeDistinguishedName: ${rdn}`);
  }
  pop() {
    if (this.size) {
      this.size -= 1;
      return this._rdns.pop();
    }
  }
  unshift(rdn) {
    if (rdn instanceof RelativeDistinguishedName) {
      this._rdns.unshift(rdn);
      this.size = this.count();
      return this.size;
    } else throw new Error(`Not a RelativeDistinguishedName: ${rdn}`);
  }
  shift() {
    if (this.size) {
      this.size -= 1;
      return this._rdns.shift();
    }
  }
  count() {
    return this._rdns.length;
  }
  match(dn) {
    if (!(dn instanceof DistinguishedName)) return false;
    if (dn.count() !== this.count()) return false;
    return this._rdns.every((rdn, i) => rdn.match(dn._rdns[i]));
  }
  format() {
    return this._rdns.map(rdn => rdn.format()).join(',');
  }
  toString() {
    return this._rdns.map(rdn => rdn.toString()).join(', ');
  }
}
