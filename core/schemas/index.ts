import { gradingSystems, cragTags, routeTags, areaTags, rockTypes } from "../globals";

const validateGrade = (yup, message) => yup.string().required()
  .required("Required")
  .test("valid-grade", message, (value, context) => {
    const gradingSystemTitle = context.options.parent.gradingSystem;
    if (!value || !gradingSystemTitle) {
      return false;
    }

    const gradingSystem = gradingSystems.find(({ title }) => title === gradingSystemTitle)
    if (!gradingSystem) {
      return false;
    }

    const { grades = [] } = gradingSystem;
    return !!grades.includes(value);
  });

export const NewCragSchema = yup => yup.object().shape({
  title: yup.string().required("Required"),
  description: yup.string().required("Required"),
  tags: yup.array().min(1, "Select at least 1").of(
    yup.string().oneOf(cragTags),
    "Invalid Tags"
  ),
  latitude: yup.number().typeError("Latitiude must be a number").moreThan(-90, "Latitude must be a valid latitude").lessThan(90, "Must be a valid latitude"),
  longitude: yup.number().typeError("Longitude must be a number").moreThan(-180, "Longitude must be a valid longitude").lessThan(180, "Must be a valid longitude"),
  access: yup.string().required(),
  carParks: yup.array().of(
    yup.object().shape({
      title: yup.string().required("Required"),
      latitude: yup.number().typeError("Latitude must be a number").moreThan(-90, "Latitude must be a valid latitude").lessThan(90, "Must be a valid latitude"),
      longitude: yup.number().typeError("Longitude must be a number").moreThan(-180, "Longitude must be a valid longitude").lessThan(180, "Must be a valid longitude"),
    })
  ).required("Add at least 1").min(1, "Add at least 1"),
  accessLink: yup.string().url("Not a valid URL").nullable(),
});

export const NewAreaSchema = yup => yup.object().shape({
  title: yup.string().required("Required"),
  description: yup.string(),
  tags: yup.array().min(1, "Select at least 1").of(
    yup.string().oneOf(areaTags),
    "Invalid Tags"
  ),
  latitude: yup.number().typeError("Latitiude must be a number").moreThan(-90, "Latitude must be a valid latitude").lessThan(90, "Must be a valid latitude"),
  longitude: yup.number().typeError("Longitude must be a number").moreThan(-180, "Longitude must be a valid longitude").lessThan(180, "Must be a valid longitude"),
  access: yup.string().required(),
  rockType: yup.string().required("Required").oneOf(rockTypes, "Invalid Rock Type"),
});

export const NewTopoSchema = yup => yup.object().shape({
  orientation: yup.string().required("Required"),
  imageFileName: yup.string().required("Required"),
  image: yup.string(),
  areaSlug: yup.string().required(),
  cragSlug: yup.string().required()
});

export const NewRouteScheme = yup => yup.object().shape({
  title: yup.string().required("Required"),
  description: yup.string(),
  tags: yup.array().min(1, "Select at least 1").of(
    yup.string().oneOf(routeTags),
    "Invalid Tags"
  ),
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
  routeType: yup.string().required("Required"),
  gradingSystem: yup.string().required("Required"),
  grade: yup.string().required("Required"),
  cragSlug: yup.string().required("Required"),
  areaSlug: yup.string().required("Required"),
  topoSlug: yup.string().required("Required")
});

export const NewLogsSchema = yup => yup.object().shape({
  logs: yup.array().of(
    yup.object().shape({
      areaSlug: yup.string().required(),
      attempts: yup.string().required("Required"),
      comment: yup.string(),
      cragSlug: yup.string().required(),
      dateSent: yup.string().required("Required"),
      grade: validateGrade(yup, "Invalid Grade"),
      gradeTaken: validateGrade(yup, "Invalid Grade Taken"),
      gradingSystem: yup.string().oneOf(
        gradingSystems.map(g => g.title),
        "Invalid Grading System"
      ),
      routeSlug: yup.string().required(),
      routeTitle: yup.string().required(),
      routeType: yup.string().required(),
      stars: yup.number()
        .min(0, "Cannot rate less than 0")
        .max(5, "Canner rate more than 5")
        .required(),
      tags: yup.array().min(1, "Select at least 1").of(
        yup.string().oneOf(routeTags),
        "Invalid tags"
      )
    })
  )
});
