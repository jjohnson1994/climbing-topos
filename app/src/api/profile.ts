import { routeTypeDefaultGradingSystem } from "core/globals";
import { useEffect, useState } from "react";
import { useGlobals } from "./globals";

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
  const { gradingSystems, routeTypes } = useGlobals();
  const [preferedGradingSystems, setPreferedGradingSystems] = useState<{ [key: string]: string }>(routeTypeDefaultGradingSystem);

  useEffect(() => {
    const getGradingSystems = async () => {
      const gradingSystems = await getPreferedGradingSystems();
      setPreferedGradingSystems(gradingSystems);
    };

    getGradingSystems();
  }, []);

  const convertGradeToUserPreference = (gradeIndex: number, gradingSystemId: string, routeTypeId: string) => {
    const routeGradingSystem = gradingSystems.find(({ id }) => id === gradingSystemId);

    if (routeGradingSystem) {
      return routeGradingSystem.grades[gradeIndex];
    }
  }

  return {
    convertGradeToUserPreference,
    preferedGradingSystems,
  };
}
