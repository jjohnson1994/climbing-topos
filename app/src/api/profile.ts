import { gradingSystems, routeTypeDefaultGradingSystem } from "core/globals";
import { useEffect, useState } from "react";

export async function getPreferedGradingSystems() {
  const userPreferedGradingSystems = window.localStorage.getItem("preferedGradingSystems");

  if (userPreferedGradingSystems) {
    return JSON.parse(userPreferedGradingSystems);
  } else {
    return routeTypeDefaultGradingSystem;
  }
}

export async function setPreferedGradingSystems(preferences: { [key: string]: string }) {
  window.localStorage.setItem("preferedGradingSystems", JSON.stringify(preferences));
}

export const useUserPreferences = () => {
  const [preferedGradingSystems, setPreferedGradingSystems] = useState<{ [key: string]: string }>(routeTypeDefaultGradingSystem);

  useEffect(() => {
    const getGradingSystems = async () => {
      const gradingSystems = await getPreferedGradingSystems();
      setPreferedGradingSystems(gradingSystems);
    };

    getGradingSystems();
  }, []);

  const convertGradeToUserPreference = (grade: number, routeType: string) => {
    const gradingSystem = preferedGradingSystems[routeType];
    const gradingSystemGrades = gradingSystems.find(system => system.title === gradingSystem)?.grades;
    const systemGrade = Array.from(new Set(gradingSystemGrades))[grade];
    return systemGrade;
  }

  return {
    convertGradeToUserPreference,
    preferedGradingSystems,
  };
}
