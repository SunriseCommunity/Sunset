import { UserGrades as UserGradesType } from "@/lib/hooks/api/user/types";
import { getGradeColor } from "@/lib/utils/getGradeColor";

const USER_GRADES_TO_IGNORE = ["B", "C", "D", "F"];

export default function UserGrades({ grades }: { grades: UserGradesType }) {
  if (!grades) return null;

  return (
    <div className="grid grid-cols-5 gap-4">
      {Object.entries(grades)
        .map(([key, value]) => ({
          grade: (key.split("_").pop() ?? "F").toUpperCase(),
          value,
        }))
        .filter((data) => !USER_GRADES_TO_IGNORE.includes(data.grade))
        .map((data) => {
          return UserGrade(data.grade, data.value);
        })}
    </div>
  );
}

function UserGrade(gradeName: string, gradeCount: number) {
  return (
    <div
      className={`bg-terracotta-700 p-2 rounded text-center w-full `}
      key={`user-grade-${gradeName}`}
    >
      <p className={`text-${getGradeColor(gradeName)} font-bold`}>
        {gradeName}
      </p>
      <p className="text-xs">{gradeCount}</p>
    </div>
  );
}
