import { gradingSystems } from "core/globals";

export const useGradeHelpers = () => {
  const convertGradeValueToGradeLabel = (grade: number, gradingSystemTitle: string) => {
    const gradingSystem = gradingSystems.find(({ title }) => title === gradingSystemTitle)

    if (!gradingSystem) {
      throw new Error(`Error, cannot convert grade value to grade label. Grading system '${gradingSystemTitle}' does not exist`)
    }

    const grades = gradingSystem.grades
    const systemGrade = grades[grade];
    return systemGrade;
  }

  return {
    convertGradeValueToGradeLabel,
  };
}
