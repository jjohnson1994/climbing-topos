export interface AccessType {
  id: string;
  title: string;
}

export interface RockType {
  id: string;
  title: string;
}

export interface Orientation {
  id: string;
  title: string;
}

export interface Tag {
  id: string;
  title: string;
}

export interface RouteType {
  id: string;
  title: string;
  defaultGradingSystemId: string;
}

export interface UserRegisterForm {
  username: string;
  password: string;
  givenName: string;
  familyName: string;
  email: string;
  birthdate: string;
  phoneNumber: string;
}

export interface UserRegisterConfirmationForm {
  username: string;
  confirmationCode: string;
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
  accessDetails: string;
  accessTypeId: string;
  approachDetails: string;
  carParks: CarPark[];
  description: string;
  latitude: string;
  longitude: string;
  osmData: OsmData;
  rockTypeId: string;
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
  access: AccessType;
  areas: Area[];
  owner: string;
  routes: Route[];
  slug: string; 
  topos: Topo[];
  userLogs: Log[];
  rockTypeTitle: string;
}

export interface AreaRequest {
  approachDetails: string;
  cragSlug: string;
  description: string;
  latitude: string;
  longitude: string;
  tags: string[],
  title: string;
}

export interface Area extends AreaRequest {
  country: string;
  county: string;
  cragTitle: string;
  id: string;
  logCount: number;
  routeCount: number;
  routes: Route[];
  slug: string;
  topos: Topo[];
  userLogs: Log[];
  osmData: OsmData;
}

export interface TopoRequest {
  areaSlug: string;
  image: File | string;
  imageFileName: string;
  orientationId: string;
}

export interface Topo extends TopoRequest {
  id: string;
  areaId: string;
  slug: string;
  orientationTitle: string;
}

export interface RouteRequest {
  description: string;
  drawing: RouteDrawing;
  gradeIndex: string;
  gradingSystemId: string;
  rating: number;
  routeTypeId: string;
  tags: string[],
  title: string;
  topoSlug: string;
}

export interface Route extends RouteRequest {
  area: Area;
  areaSlug: string;
  areaTitle: string;
  country: string;
  cragSlug: string;
  cragTitle: string;
  logCount: number;
  siblingRoutes: Route[];
  slug: string;
  topoId: string;
  topoImage: string;
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
  id: string;
  title: string;
  grades: string[];
}

export interface LogRequest {
  attempts: number;
  comment: string;
  dateSent: string;
  gradeSuggested: string;
  gradeTaken: string;
  routeSlug: string;
  stars: number;
  tags: string[];
}

export interface Log extends LogRequest {
  id: string;
  areaSlug: string;
  areaTitle: string;
  country: string;
  countryCode: string;
  county: string;
  cragSlug: string;
  cragTitle: string;
  gradingSystemTitle: string;
  gradingSystemId: string;
  region: string;
  rockTypeTitle: string;
  routeTitle: string;
  routeTypeTitle: string;
  state: string;
  topoSlug: string;
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
  gradingSystemId: string;
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
  routeCount: number;
  routes: ListRoute[];
}

export interface Globals {
  accessTypes: AccessType[];
  areaTags: Tag[];
  cragTags: Tag[];
  gradingSystems: GradingSystem[];
  orientations: Orientation[];
  rockTypes: RockType[];
  routeTags: Tag[];
  routeTypes: RouteType[];
}
