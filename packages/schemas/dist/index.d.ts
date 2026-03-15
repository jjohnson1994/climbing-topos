import * as yup from 'yup';
export * as yup from 'yup';
export declare const NewCragSchema: () => yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    title: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    description: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    latitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    longitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    access: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    carParks: import("yup/lib/array").RequiredArraySchema<yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        title: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        latitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        longitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        title: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        latitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        longitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        title: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        latitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        longitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>>, import("yup/lib/types").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        title: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        latitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        longitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>[]>;
    accessLink: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    acceptTerms: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    title: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    description: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    latitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    longitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    access: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    carParks: import("yup/lib/array").RequiredArraySchema<yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        title: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        latitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        longitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        title: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        latitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        longitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        title: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        latitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        longitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>>, import("yup/lib/types").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        title: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        latitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        longitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>[]>;
    accessLink: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    acceptTerms: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    title: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    description: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    latitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    longitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    access: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    carParks: import("yup/lib/array").RequiredArraySchema<yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        title: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        latitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        longitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        title: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        latitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        longitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        title: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        latitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        longitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>>, import("yup/lib/types").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        title: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        latitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        longitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>[]>;
    accessLink: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    acceptTerms: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}>>>;
export declare const UpdateCragSchema: () => yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    title: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    newTags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    removeTags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    latitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    longitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    access: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    accessLink: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    title: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    newTags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    removeTags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    latitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    longitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    access: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    accessLink: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    title: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    newTags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    removeTags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    latitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    longitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    access: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    accessLink: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
}>>>;
export declare const NewAreaSchema: () => yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    title: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    latitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    longitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    access: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    rockType: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    title: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    latitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    longitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    access: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    rockType: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    title: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    latitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    longitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    access: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    rockType: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
}>>>;
export declare const UpdateAreaSchema: () => yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    title: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    addTags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    removeTags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    latitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    longitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    access: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    rockType: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    verified: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    title: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    addTags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    removeTags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    latitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    longitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    access: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    rockType: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    verified: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    title: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    addTags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    removeTags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    latitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    longitude: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    access: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    rockType: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    verified: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}>>>;
export declare const NewTopoSchema: () => yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    orientation: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    imageFileName: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    image: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    orientation: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    imageFileName: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    image: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    orientation: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    imageFileName: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    image: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
}>>>;
export declare const UpdateTopoSchema: () => yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    orientation: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    imageFileName: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    image: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    verified: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    orientation: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    imageFileName: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    image: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    verified: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    orientation: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    imageFileName: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    image: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    verified: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}>>>;
export declare const NewRouteScheme: () => yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    title: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    drawing: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        points: import("yup/lib/array").RequiredArraySchema<yup.AnySchema, import("yup/lib/types").AnyObject, any[]>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        points: import("yup/lib/array").RequiredArraySchema<yup.AnySchema, import("yup/lib/types").AnyObject, any[]>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        points: import("yup/lib/array").RequiredArraySchema<yup.AnySchema, import("yup/lib/types").AnyObject, any[]>;
    }>>>;
    routeType: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    gradingSystem: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    grade: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    topoSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    rating: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    title: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    drawing: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        points: import("yup/lib/array").RequiredArraySchema<yup.AnySchema, import("yup/lib/types").AnyObject, any[]>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        points: import("yup/lib/array").RequiredArraySchema<yup.AnySchema, import("yup/lib/types").AnyObject, any[]>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        points: import("yup/lib/array").RequiredArraySchema<yup.AnySchema, import("yup/lib/types").AnyObject, any[]>;
    }>>>;
    routeType: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    gradingSystem: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    grade: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    topoSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    rating: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    title: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    drawing: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        points: import("yup/lib/array").RequiredArraySchema<yup.AnySchema, import("yup/lib/types").AnyObject, any[]>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        points: import("yup/lib/array").RequiredArraySchema<yup.AnySchema, import("yup/lib/types").AnyObject, any[]>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        points: import("yup/lib/array").RequiredArraySchema<yup.AnySchema, import("yup/lib/types").AnyObject, any[]>;
    }>>>;
    routeType: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    gradingSystem: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    grade: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    topoSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    rating: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
}>>>;
export declare const UpdateRouteScheme: () => yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    title: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    newTags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    removeTags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    drawing: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        points: import("yup/lib/array").RequiredArraySchema<yup.AnySchema, import("yup/lib/types").AnyObject, any[]>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        points: import("yup/lib/array").RequiredArraySchema<yup.AnySchema, import("yup/lib/types").AnyObject, any[]>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        points: import("yup/lib/array").RequiredArraySchema<yup.AnySchema, import("yup/lib/types").AnyObject, any[]>;
    }>>>;
    routeType: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    gradingSystem: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    grade: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    verified: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    title: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    newTags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    removeTags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    drawing: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        points: import("yup/lib/array").RequiredArraySchema<yup.AnySchema, import("yup/lib/types").AnyObject, any[]>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        points: import("yup/lib/array").RequiredArraySchema<yup.AnySchema, import("yup/lib/types").AnyObject, any[]>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        points: import("yup/lib/array").RequiredArraySchema<yup.AnySchema, import("yup/lib/types").AnyObject, any[]>;
    }>>>;
    routeType: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    gradingSystem: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    grade: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    verified: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    title: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    description: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    newTags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    removeTags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    drawing: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        points: import("yup/lib/array").RequiredArraySchema<yup.AnySchema, import("yup/lib/types").AnyObject, any[]>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        points: import("yup/lib/array").RequiredArraySchema<yup.AnySchema, import("yup/lib/types").AnyObject, any[]>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        points: import("yup/lib/array").RequiredArraySchema<yup.AnySchema, import("yup/lib/types").AnyObject, any[]>;
    }>>>;
    routeType: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    gradingSystem: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    grade: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
    verified: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}>>>;
export declare const NewLogsSchema: () => yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    logs: yup.ArraySchema<yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        attempts: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        comment: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        dateSent: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        grade: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeModal: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeTaken: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradingSystem: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeTitle: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeType: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        rating: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        attempts: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        comment: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        dateSent: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        grade: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeModal: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeTaken: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradingSystem: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeTitle: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeType: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        rating: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        attempts: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        comment: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        dateSent: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        grade: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeModal: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeTaken: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradingSystem: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeTitle: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeType: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        rating: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    }>>>, import("yup/lib/types").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        attempts: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        comment: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        dateSent: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        grade: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeModal: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeTaken: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradingSystem: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeTitle: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeType: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        rating: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    }>>[], import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        attempts: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        comment: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        dateSent: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        grade: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeModal: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeTaken: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradingSystem: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeTitle: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeType: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        rating: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    }>>[]>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    logs: yup.ArraySchema<yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        attempts: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        comment: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        dateSent: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        grade: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeModal: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeTaken: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradingSystem: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeTitle: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeType: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        rating: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        attempts: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        comment: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        dateSent: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        grade: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeModal: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeTaken: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradingSystem: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeTitle: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeType: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        rating: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        attempts: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        comment: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        dateSent: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        grade: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeModal: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeTaken: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradingSystem: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeTitle: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeType: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        rating: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    }>>>, import("yup/lib/types").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        attempts: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        comment: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        dateSent: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        grade: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeModal: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeTaken: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradingSystem: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeTitle: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeType: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        rating: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    }>>[], import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        attempts: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        comment: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        dateSent: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        grade: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeModal: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeTaken: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradingSystem: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeTitle: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeType: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        rating: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    }>>[]>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    logs: yup.ArraySchema<yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        attempts: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        comment: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        dateSent: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        grade: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeModal: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeTaken: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradingSystem: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeTitle: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeType: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        rating: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        attempts: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        comment: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        dateSent: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        grade: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeModal: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeTaken: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradingSystem: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeTitle: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeType: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        rating: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        attempts: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        comment: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        dateSent: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        grade: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeModal: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeTaken: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradingSystem: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeTitle: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeType: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        rating: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    }>>>, import("yup/lib/types").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        attempts: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        comment: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        dateSent: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        grade: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeModal: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeTaken: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradingSystem: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeTitle: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeType: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        rating: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    }>>[], import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        attempts: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        comment: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        dateSent: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        grade: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeModal: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradeTaken: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        gradingSystem: yup.StringSchema<string, import("yup/lib/types").AnyObject, string>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeTitle: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeType: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        rating: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        tags: yup.ArraySchema<yup.StringSchema<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    }>>[]>;
}>>>;
export declare const NewListSchema: () => yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    title: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    title: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    title: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
}>>>;
export declare const UpdateListSchema: () => yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    routes: yup.ArraySchema<yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        topoSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        topoSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        topoSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>>, import("yup/lib/types").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        topoSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>[], import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        topoSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>[]>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    routes: yup.ArraySchema<yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        topoSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        topoSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        topoSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>>, import("yup/lib/types").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        topoSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>[], import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        topoSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>[]>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    routes: yup.ArraySchema<yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        topoSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        topoSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        topoSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>>, import("yup/lib/types").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        topoSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>[], import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        cragSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        areaSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        topoSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        routeSlug: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>[]>;
}>>>;
