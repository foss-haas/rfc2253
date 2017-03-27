import DistinguishedName from './dn';
import RelativeDistinguishedName from './rdn';

export default function format(dn) {
  if (Array.isArray(dn)) return new DistinguishedName(dn.map(rdn => new RelativeDistinguishedName(rdn))).format();
  return new RelativeDistinguishedName(dn).format();
}
