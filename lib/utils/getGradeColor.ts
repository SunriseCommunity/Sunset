const gradeColors: { [key: string]: string } = {
  XH: "sky-100",
  X: "yellow-300",
  SH: "sky-100",
  S: "yellow-300",
  A: "green-300",
  B: "blue-300",
  C: "pink-300",
  D: "red-400",
  F: "red-400",
};

export function getGradeColor(grade: string) {
  return gradeColors[grade] || "gray-400";
}
