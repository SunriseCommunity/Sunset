export default function numberWith(number: number | string, separator = " ") {
  return number.toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, separator);
}
