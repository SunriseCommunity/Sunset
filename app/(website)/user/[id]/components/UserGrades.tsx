import type { GetUserByIdGradesResponse } from "@/lib/types/api";
import { getGradeColor } from "@/lib/utils/getGradeColor";

const USER_GRADES_TO_IGNORE = new Set(["B", "C", "D", "F"]);

export default function UserGrades({ grades }: { grades: GetUserByIdGradesResponse }) {
  if (!grades)
    return null;

  return (
    <div className="grid grid-cols-5 gap-4">
      {Object.entries(grades)
        .map(([key, value]) => ({
          grade: (key.split("_").pop() ?? "F").toUpperCase(),
          value,
        }))
        .filter(data => !USER_GRADES_TO_IGNORE.has(data.grade))
        .map((data) => {
          return UserGrade(data.grade, data.value);
        })}
    </div>
  );
}

function UserGrade(gradeName: string, gradeCount: number) {
  return (
    <div
      className={`rounded bg-card p-1 text-center `}
      key={`user-grade-${gradeName}`}
    >
      <p className={`text-${getGradeColor(gradeName)} text-shadow`}>
        {gradeName}
      </p>
      <p className="text-xs">{gradeCount}</p>
    </div>
  );
}
