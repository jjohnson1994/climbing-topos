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
  latitidue: string;
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

export interface Climb {
  title: string;
  slug: string;
  topoSlug: string;
}

export interface Area {
  access: string;
  accessDetails: string;
  approachNotes: string;
  climbs?: Climb[];
  cragSlug: string;
  description: string;
  latitude: string;
  longitude: string;
  slug?: string;
  tags: string[],
  title: string;
  topos?: Topo[];
  routes?: Route[];
}

export interface Topo {
  areaSlug: string;
  cragSlug: string;
  description: string;
  image: File | string | null;
  orientation: string;
  slug?: string;
}

export interface Route {
  areaSlug: string;
  cragSlug: string;
  topoSlug: string;
  title: string;
  description: string;
  routeType: string;
  gradingSystem: string;
  grade: string;
  tags: string[],
  rating?: number;
  drawing?: object;
}

export interface GradingSystem {
  title: string;
  grades: string[];
}
