import DistinguishedName from './dn';
import RelativeDistinguishedName from './rdn';
const slice = Array.prototype.slice;

export default function parse(seq) {
  let dn = new DistinguishedName();
  if (!seq) return dn;
  let rdn = new RelativeDistinguishedName();
  dn.push(rdn);

  let binary = false;
  let quoted = false;
  let key = null;
  let token = [];
  let nextNonSpace = 0;

  for (let i = 0; i <= seq.length; i++) {
    if (i === seq.length) {
      if (key !== null) rdn.set(key, typeof token[0] === 'number' ? new Buffer(token) : token.join(''));
      break;
    }
    let ch = seq[i];
    if (binary) {
      let byte = parseInt(seq.slice(i, i + 2), 16);
      if (!Number.isNaN(byte)) {
        i += 1;
        token.push(byte);
        continue;
      } else binary = false;
    }
    if (quoted) {
      if (ch === '"') {
        quoted = false;
        continue;
      }
    } else {
      if (ch === '"') {
        quoted = true;
        continue;
      }
      if (ch === '#') {
        if (typeof token[0] === 'string') {
          token = new Buffer(token.join(''))::slice();
        }
        binary = true;
        continue;
      }
      if (ch === '\\') {
        i += 1;
        let ord = parseInt(seq.slice(i, i + 2), 16);
        if (!Number.isNaN(ord)) {
          i += 1;
          token.push(String.fromCharCode(ord));
        } else token.push(seq[i]);
        continue;
      }
      if (key === null && ch === '=') {
        key = typeof token[0] === 'number' ? new Buffer(token) : token.join('');
        token = [];
        if (seq[i + 1] === '#') {
          i += 1;
          binary = true;
        }
        continue;
      }
      if (ch === ',' || ch === ';' || ch === '+') {
        if (key !== null) rdn.set(key, typeof token[0] === 'number' ? new Buffer(token) : token.join(''));
        key = null;
        token = [];
      }
      if (ch === ',' || ch === ';') {
        rdn = new RelativeDistinguishedName();
        dn.push(rdn);
        continue;
      }
    }
    if (ch === ' ' && !quoted) {
      if (!token.length) continue;
      if (i > nextNonSpace) {
        let j = i;
        while (seq[j] === ' ') j++;
        nextNonSpace = j;
      }
      if (
        nextNonSpace >= seq.length
        || seq[nextNonSpace] === ','
        || seq[nextNonSpace] === ';'
        || (key === null && seq[nextNonSpace] === '=')
        || (key !== null && seq[nextNonSpace] === '+')
      ) {
        i = nextNonSpace - 1;
        continue;
      }
    }
    if (typeof token[0] === 'number') {
      token.push(...new Buffer(ch)::slice());
    } else token.push(ch);
  }

  return dn;
}
