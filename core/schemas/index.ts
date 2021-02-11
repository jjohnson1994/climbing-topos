import { gradingSystems, cragTags, routeTags, areaTags, rockTypes } from "../globals";

export const NewCragSchema = yup => yup.object().shape({
  accessDetails: yup.string(),
  accessTypeId: yup.string().required("Required"),
  approachDetails: yup.string(),
  carParks: yup.array().of(
    yup.object().shape({
      title: yup.string().required("Required"),
      latitude: yup.number().typeError("Latitude must be a number").moreThan(-90, "Latitude must be a valid latitude").lessThan(90, "Must be a valid latitude"),
      longitude: yup.number().typeError("Longitude must be a number").moreThan(-180, "Longitude must be a valid longitude").lessThan(180, "Must be a valid longitude"),
    })
  ).required("Add at least 1").min(1, "Add at least 1"),
  description: yup.string().required("Required"),
  latitude: yup.number().typeError("Latitiude must be a number").moreThan(-90, "Latitude must be a valid latitude").lessThan(90, "Must be a valid latitude"),
  longitude: yup.number().typeError("Longitude must be a number").moreThan(-180, "Longitude must be a valid longitude").lessThan(180, "Must be a valid longitude"),
  tags: yup.array().min(1, "Select at least 1"),
  rockTypeId: yup.string().required("Required"),
  title: yup.string().required("Required"),
});

export const NewAreaSchema = yup => yup.object().shape({
  approachDetails: yup.string(),
  description: yup.string(),
  cragSlug: yup.string("Required"),
  latitude: yup.number().typeError("Latitiude must be a number").moreThan(-90, "Latitude must be a valid latitude").lessThan(90, "Must be a valid latitude"),
  longitude: yup.number().typeError("Longitude must be a number").moreThan(-180, "Longitude must be a valid longitude").lessThan(180, "Must be a valid longitude"),
  tags: yup.array().min(1, "Select at least 1").of(yup.string()),
  title: yup.string().required("Required"),
});

export const NewTopoSchema = yup => yup.object().shape({
  orientationId: yup.string().required("Required"),
  imageFileName: yup.string().required("Required"),
  image: yup.string(),
  areaSlug: yup.string().required(),
});

export const NewRouteScheme = yup => yup.object().shape({
  description: yup.string(),
  drawing: yup.object()
    .required()
    .shape({
      path: yup.array().required().min(1, "Not enough points in drawing path"),
      linkFrom: yup.object().shape({
        routeSlug: yup.string(),
        x: yup.number(),
        y: yup.number(),
      }),
      linkTo: yup.object().shape({
        routeSlug: yup.string(),
        x: yup.number(),
        y: yup.number(),
      })
    }),
  gradeIndex: yup.string().required("Required"),
  gradingSystemId: yup.string().required("Required"),
  routeTypeId: yup.string().required("Required"),
  tags: yup.array().min(1, "Select at least 1").of(yup.string()),
  title: yup.string().required("Required"),
  topoSlug: yup.string().required("Required")
});

export const NewLogsSchema = yup => yup.object().shape({
  logs: yup.array().of(
    yup.object().shape({
      attempts: yup.string().required("Required"),
      comment: yup.string(),
      dateSent: yup.string().required("Required"),
      gradeTaken: yup.number().required("Required"),
      routeSlug: yup.string().required(),
      stars: yup.number()
        .min(0, "Cannot rate less than 0")
        .max(5, "Canner rate more than 5")
        .required("Required"),
      tags: yup.array().min(1, "Select at least 1").of(yup.string())
    })
  )
});

export const NewListSchema = yup => yup.object().shape({
  title: yup.string().required("Required"),
});

export const UpdateListSchema = yup => yup.object().shape({
  routes: yup.array().of(
    yup.object().shape({
      routeSlug: yup.string().required(),
    })
  ).min(1, "Not routes provided"),
});
