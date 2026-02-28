export interface CragEditFields {
  title: string;
  description: string;
  access: string;
  accessDetails: string;
  accessLink: string;
  approachNotes: string;
  latitude: string;
  longitude: string;
}

export interface AreaEditFields {
  title: string;
  description: string;
  access: string;
  accessDetails: string;
  approachNotes: string;
  rockType: string;
  latitude: string;
  longitude: string;
}

export interface RouteEditFields {
  title: string;
  description: string;
  grade: string;
  gradingSystem: string;
  routeType: string;
  rockType: string;
}

export type ActionResult = { success: true } | { success: false; error: string };
