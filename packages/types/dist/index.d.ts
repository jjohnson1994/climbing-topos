export interface UserPublicData {
    sub: string;
    nickname: string;
    picture: string;
}
export interface User extends UserPublicData {
    email: string;
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
    };
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
    image: File | string;
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
    model: 'Crag';
    routes: Route[];
    slug: string;
    topos: Topo[];
    userLogs: Log[];
    verified: boolean;
    managedBy: UserPublicData;
    createdBy: UserPublicData;
}
export interface CragPatch {
    title?: string;
    description?: string;
    newTags?: string[];
    removeTags?: string[];
    latitude?: string;
    longitude?: string;
    access?: string;
    accessLink?: string;
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
    tags: string[];
    title: string;
}
export interface AreaPatch {
    title?: string;
    description?: string;
    addTags?: string[];
    removeTags?: string[];
    latitude?: string;
    longitude?: string;
    acess?: string;
    rockType?: string;
    verified?: boolean;
}
export interface Area extends AreaRequest {
    model: 'area';
    routeCount: number;
    logCount: number;
    routes: Route[];
    slug: string;
    topos: Topo[];
    userLogs: Log[];
    verified: boolean;
    createdBy: UserPublicData;
}
export interface TopoRequest {
    areaSlug: string;
    cragSlug: string;
    image: File | string;
    imageFileName: string;
    orientation: string;
    slug?: string;
}
export interface Topo extends TopoRequest {
    model: 'topo';
    verified: boolean;
    createdBy: UserPublicData;
}
export interface TopoPatch {
    orientation?: string;
    imageFileName?: string;
    image?: string;
    verified?: boolean;
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
    drawing: {
        points: [number, number][];
    };
    grade: string;
    gradingSystem: string;
    latitude: string;
    longitude: string;
    rockType: string;
    routeType: string;
    state: string;
    tags: string[];
    title: string;
    topoSlug: string;
}
export interface Route extends RouteRequest {
    area: Area;
    model: 'route';
    gradeModal: number;
    gradeTally: {
        [key: number]: number;
    };
    logCount: number;
    rating: number;
    ratingTally: {
        [key: number]: number;
    };
    siblingRoutes: Route[];
    drawing: {
        points: [number, number][];
        backgroundImage: string;
    };
    slug: string;
    topo: Topo;
    userLogs: Log[];
    verified: boolean;
    recentLogs: {
        sub: string;
        picture: string;
        nickname: string;
        createdAt: string;
    }[];
    createdBy: UserPublicData;
}
export interface RoutePatch {
    title?: string;
    description?: string;
    newTags?: string[];
    removeTags?: string[];
    drawing?: Pick<Route, 'drawing'>;
    routeType?: string;
    gradingSystem?: string;
    grade?: string;
    verified?: boolean;
}
export interface RouteDrawing {
    points: [number, number][];
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
    gradeModal: number;
    gradeTaken: string;
    gradingSystem: string;
    rating: number;
    region: string;
    rockType: string;
    routeSlug: string;
    routeTitle: string;
    routeType: string;
    state: string;
    tags: string[];
    topoSlug: string;
}
export interface Log extends LogRequest {
    title: string;
    slug: string;
    user: UserPublicData;
}
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
    gradeModal: number;
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
    routeCount: number;
    routes: ListRoute[];
}
