import * as yup from "yup";
export * as yup from "yup";
export declare const NewCragSchema: () => yup.ObjectSchema<{
    title: string;
    description: string;
    tags: string[];
    latitude: number;
    longitude: number;
    access: string;
    carParks: {
        title?: string;
        description?: string;
        latitude?: number;
        longitude?: number;
    }[];
    accessLink: string;
    acceptTerms: boolean;
}, yup.AnyObject, {
    title: undefined;
    description: undefined;
    tags: "";
    latitude: undefined;
    longitude: undefined;
    access: undefined;
    carParks: "";
    accessLink: undefined;
    acceptTerms: undefined;
}, "">;
export declare const UpdateCragSchema: () => yup.ObjectSchema<{
    title: string;
    description: string;
    newTags: string[];
    removeTags: string[];
    latitude: number;
    longitude: number;
    access: string;
    accessLink: string;
}, yup.AnyObject, {
    title: undefined;
    description: undefined;
    newTags: "";
    removeTags: "";
    latitude: undefined;
    longitude: undefined;
    access: undefined;
    accessLink: undefined;
}, "">;
export declare const NewAreaSchema: () => yup.ObjectSchema<{
    title: string;
    description: string;
    tags: string[];
    latitude: number;
    longitude: number;
    access: string;
    rockType: string;
}, yup.AnyObject, {
    title: undefined;
    description: undefined;
    tags: "";
    latitude: undefined;
    longitude: undefined;
    access: undefined;
    rockType: undefined;
}, "">;
export declare const UpdateAreaSchema: () => yup.ObjectSchema<{
    title: string;
    description: string;
    addTags: string[];
    removeTags: string[];
    latitude: number;
    longitude: number;
    access: string;
    rockType: string;
    verified: boolean;
}, yup.AnyObject, {
    title: undefined;
    description: undefined;
    addTags: "";
    removeTags: "";
    latitude: undefined;
    longitude: undefined;
    access: undefined;
    rockType: undefined;
    verified: undefined;
}, "">;
export declare const NewTopoSchema: () => yup.ObjectSchema<{
    orientation: string;
    imageFileName: string;
    image: string;
    areaSlug: string;
    cragSlug: string;
}, yup.AnyObject, {
    orientation: undefined;
    imageFileName: undefined;
    image: undefined;
    areaSlug: undefined;
    cragSlug: undefined;
}, "">;
export declare const UpdateTopoSchema: () => yup.ObjectSchema<{
    orientation: string;
    imageFileName: string;
    image: string;
    verified: boolean;
}, yup.AnyObject, {
    orientation: undefined;
    imageFileName: undefined;
    image: undefined;
    verified: undefined;
}, "">;
export declare const NewRouteScheme: () => yup.ObjectSchema<{
    title: string;
    description: string;
    tags: string[];
    drawing: {
        points?: any[];
    };
    routeType: string;
    gradingSystem: string;
    grade: string;
    cragSlug: string;
    areaSlug: string;
    topoSlug: string;
}, yup.AnyObject, {
    title: undefined;
    description: undefined;
    tags: "";
    drawing: {
        points: undefined;
    };
    routeType: undefined;
    gradingSystem: undefined;
    grade: undefined;
    cragSlug: undefined;
    areaSlug: undefined;
    topoSlug: undefined;
}, "">;
export declare const UpdateRouteScheme: () => yup.ObjectSchema<{
    title: string;
    description: string;
    newTags: string[];
    removeTags: string[];
    drawing: {
        points?: any[];
    };
    routeType: string;
    gradingSystem: string;
    grade: string;
    verified: boolean;
}, yup.AnyObject, {
    title: undefined;
    description: undefined;
    newTags: "";
    removeTags: "";
    drawing: {
        points: undefined;
    };
    routeType: undefined;
    gradingSystem: undefined;
    grade: undefined;
    verified: undefined;
}, "">;
export declare const NewLogsSchema: () => yup.ObjectSchema<{
    logs: {
        tags?: string[];
        areaSlug?: string;
        cragSlug?: string;
        routeType?: string;
        gradingSystem?: string;
        grade?: number;
        attempts?: string;
        comment?: string;
        dateSent?: string;
        gradeModal?: number;
        gradeTaken?: number;
        routeSlug?: string;
        routeTitle?: string;
        rating?: number;
    }[];
}, yup.AnyObject, {
    logs: "";
}, "">;
export declare const NewListSchema: () => yup.ObjectSchema<{
    title: string;
}, yup.AnyObject, {
    title: undefined;
}, "">;
export declare const UpdateListSchema: () => yup.ObjectSchema<{
    routes: {
        areaSlug?: string;
        cragSlug?: string;
        topoSlug?: string;
        routeSlug?: string;
    }[];
}, yup.AnyObject, {
    routes: "";
}, "">;
