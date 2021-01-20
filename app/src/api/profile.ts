import { routeTypeDefaultGradingSystem } from "core/globals";

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
