'use strict';
const slice = Array.prototype.slice;
const RESERVED = ',+"\\<>;';
const SPECIAL = '\n\r=/';

function pad(str) {
  if (str.length % 2 === 0) return str;
  return '0' + str;
}

export default function escape(value) {
  if (value instanceof Buffer) {
    return '#' + value::slice().map(num => pad(num.toString(16))).join('');
  }
  let tokens = value.split('');
  let result = [];
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    if (RESERVED.indexOf(token) !== -1) result.push('\\' + token);
    else if (SPECIAL.indexOf(token) === -1) result.push(token);
    else result.push('\\' + pad(token.charCodeAt(0).toString(16)));
  }
  if (result[0] === '#') {
    result[0] = '\\#';
  } else if (result[0] === ' ') {
    let i;
    for (i = 1; i < result.length; i++) {
      if (result[i] !== ' ') break;
    }
    let head = result.splice(0, i);
    result.unshift(...head.map(ch => '\\' + ch));
  }
  let n = result.length;
  if (result[n - 1] === ' ') {
    let i;
    for (i = n - 2; i > 0; i--) {
      if (result[i] !== ' ') break;
    }
    let tail = result.splice(i + 1, n);
    result.push(...tail.map(ch => '\\' + ch));
  }
  return result.join('');
}
