import {
  areaTags,
  cragTags,
  gradingSystems,
  rockTypes,
  routeTags,
  routeTypes
} from "core/globals";

export async function getCragTags() {
  return cragTags;
}

export async function getAreaTags() {
  return areaTags;
}

export async function getRockTypes() {
  return rockTypes;
}

export async function getRouteTags() {
  return routeTags;
}

export async function getRouteTypes() {
  return routeTypes;
}

export async function getGradingSystems() {
  return gradingSystems;
}
