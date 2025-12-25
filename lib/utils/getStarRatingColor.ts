/* eslint-disable no-param-reassign -- intentional */
export function getStarRatingColor(rating: number): string {
  const ratingRange = [0.1, 1.25, 2, 2.5, 3.3, 4.2, 4.9, 5.8, 6.7, 7.7, 9];
  const colorRange = [
    [66, 144, 251],
    [79, 192, 255],
    [79, 255, 213],
    [124, 255, 79],
    [246, 240, 92],
    [255, 128, 104],
    [255, 78, 111],
    [198, 69, 184],
    [101, 99, 222],
    [24, 21, 142],
    [0, 0, 0],
  ];
  const gamma = 2.2;

  function hex(n: number): string {
    return (n < 16 ? "0" : "") + n.toString(16);
  }

  function exponential(a: number, b: number, y: number): (t: number) => number {
    return (
      (a = Math.pow(a, y)),
      (b = Math.pow(b, y) - a),
      (y = 1 / y),
      function (t) {
        return Math.pow(a + t * b, y);
      }
    );
  }

  function interpolate(start: number[], end: number[]): (t: number) => string {
    const r = exponential(start[0], end[0], gamma);
    const g = exponential(start[1], end[1], gamma);
    const b = exponential(start[2], end[2], gamma);
    return t =>
      `#${
      hex(Math.round(r(t)))
      }${hex(Math.round(g(t)))
      }${hex(Math.round(b(t)))}`;
  }

  if (rating < 0.1)
    return "#AAAAAA";
  if (rating >= 9)
    return "#000000";

  for (let i = 0; i < ratingRange.length; i++) {
    if (rating < ratingRange[i]) {
      return interpolate(
        colorRange[i - 1],
        colorRange[i],
      )((rating - ratingRange[i - 1]) / (ratingRange[i] - ratingRange[i - 1]));
    }
  }

  return "#000000";
}
