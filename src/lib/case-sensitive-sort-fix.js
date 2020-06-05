export default function byCaseSensitive(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();

  if (a === b) return 0;

  return a < b ? -1 : 1;
}
