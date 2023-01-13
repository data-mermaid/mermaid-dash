export default function numberWithCommas(x) {
  if (x !== null) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return x
}
