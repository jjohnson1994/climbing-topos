export interface UserRegisterForm {
  username: string,
  password: string,
  givenName: string,
  familyName: string,
  email: string,
  birthdate: string,
  phoneNumber: string
}

export interface UserRegisterConfirmationForm {
  username: string,
  confirmationCode: string
}

export interface OsmData {
  place_id: string;
  address: {
    city: string;
    country: string;
    country_code: string;
    county: string;
    state: string;
  }
}

export interface CarPark {
  title: string;
  description: string;
  latitude: string;
  longitude: string;
}

export interface Crag {
  slug: string; 
  title: string; 
  climbCount: number; 
  areaCount: number; 
  tickCount: number; 
  likeCount: number;
  access: string;
  accessDetails: string;
  accessLink: string;
  approachNotes: string;
  carParks: CarPark[];
  description: string;
  latitude: string;
  longitude: string;
  osmData: OsmData;
  tags: string[];
}

export interface CragView extends Crag {
  routes: Route[];
  areas: Area[];
  logsCount: number;
  userLogs: Log[];
}

export interface Climb {
  title: string;
  slug: string;
  topoSlug: string;
}

export interface Area {
  access: string;
  accessDetails: string;
  approachNotes: string;
  cragSlug: string;
  description: string;
  latitude: string;
  longitude: string;
  slug?: string;
  tags: string[],
  title: string;
}

export interface AreaView extends Area {
  topos: Topo[];
  routes: Route[];
  userLogs: Log[];
}

export interface Topo {
  areaSlug: string;
  cragSlug: string;
  image: File | string;
  orientation: string;
  slug?: string;
}

export interface Route {
  areaSlug: string;
  cragSlug: string;
  description: string;
  drawing: RouteDrawing;
  grade: string;
  gradingSystem: string;
  rating?: number;
  routeType: string;
  slug?: string;
  tags: string[],
  title: string;
  topoSlug: string;
}

export interface RouteView extends Route {
  area: Area;
  topo: Topo;
  siblingRoutes: Route[];
  userLogs: Log[];
}

export interface RouteDrawing {
  path: number[][];
  linkFrom?: {
    routeSlug: string,
    x: number;
    y: number;
  },
  linkTo?: {
    routeSlug: string;
    x: number;
    y: number;
  }
}


export interface GradingSystem {
  title: string;
  grades: string[];
}

export interface LogRequest {
  areaSlug: string;
  attempts: number;
  comment: string;
  cragSlug: string;
  dateSent: string;
  grade: string;
  gradeTaken: string;
  gradingSystem: string;
  routeSlug: string;
  routeTitle: string;
  routeType: string;
  stars: number;
  tags: string[];
  topoSlug: string;
}

export interface Log extends LogRequest {
  title: string;
};
