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
  description: string;
  latitude: string;
  longitude: string;
  title: string;
}

export interface CragRequest {
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
  title: string; 
}

export interface CragBrief extends CragRequest {
  areaCount: number;
  logCount: number; 
  routeCount: number;
  slug: string; 
  userLogCount: number;
}

export interface Crag extends CragBrief {
  areas: Area[];
  owner: string;
  routes: Route[];
  slug: string; 
  topos: Topo[];
  userLogs: Log[];
}

export interface Climb {
  title: string;
  slug: string;
  topoSlug: string;
}

export interface AreaRequest {
  access: string;
  accessDetails: string;
  approachNotes: string;
  country: string;
  countryCode: string;
  county: string;
  cragSlug: string;
  cragTitle: string;
  description: string;
  latitude: string;
  longitude: string;
  rockType: string;
  state: string;
  tags: string[],
  title: string;
}

export interface Area extends AreaRequest {
  routeCount: number;
  logCount: number;
  routes: Route[];
  topos: Topo[];
  userLogs: Log[];
  slug: string;
}

export interface Topo {
  areaSlug: string;
  cragSlug: string;
  image: File | string;
  imageFileName: string;
  orientation: string;
  slug?: string;
}

export interface RouteRequest {
  areaSlug: string;
  areaTitle: string;
  country: string;
  countryCode: string;
  county: string;
  cragSlug: string;
  cragTitle: string;
  description: string;
  drawing: RouteDrawing;
  grade: string;
  gradingSystem: string;
  latitude: string;
  longitude: string;
  rating: number;
  rockType: string;
  routeType: string;
  state: string;
  tags: string[],
  title: string;
  topoSlug: string;
}

export interface Route extends RouteRequest {
  area: Area;
  logCount: number;
  siblingRoutes: Route[];
  slug: string;
  topo: Topo;
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
  areaTitle: string;
  attempts: number;
  comment: string;
  country: string;
  countryCode: string;
  county: string;
  cragSlug: string;
  cragTitle: string;
  dateSent: string;
  grade: string;
  gradeTaken: string;
  gradingSystem: string;
  region: string;
  rockType: string;
  routeSlug: string;
  routeTitle: string;
  routeType: string;
  stars: number;
  state: string;
  tags: string[];
  topoSlug: string;
}

export interface Log extends LogRequest {
  title: string;
  slug: string;
};

export interface ListRequest {
  title?: string;
}

export interface ListAddRouteRequest {
  cragSlug: string;
  areaSlug: string;
  topoSlug: string;
  routeSlug: string;
}

export interface ListRoutePartial extends ListAddRouteRequest {
  areaTitle: string;
  country: string;
  countryCode: string;
  county: string;
  cragTitle: string;
  grade: string;
  gradingSystem: string;
  latitude: string;
  listSlug: string;
  listTitle: string;
  longitude: string;
  rockType: string;
  routeType: string;
  state: string;
  title: string;
}

export interface ListRoute extends ListRoutePartial {
  listSlug: string;
  slug: string;
}

export interface List {
  title: string;
  slug: string;
  routes: ListRoute[];
}
