const gradeBackgrounds: { [key: string]: string } = {
  XH: "sky-50",
  X: "sky-100",
  SH: "yellow-300",
  S: "yellow-300",
  A: "green-300",
  B: "blue-300",
  C: "pink-300",
  D: "red-400",
  F: "red-400",
};

export function getGradeColor(grade: string) {
  return gradeBackgrounds[grade] || "gray-400";
}
