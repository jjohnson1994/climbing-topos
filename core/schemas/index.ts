import {
  gradingSystems,
  cragTags,
  routeTags,
  areaTags,
  rockTypes,
} from "../globals";
import * as yup from "yup";

export * as yup from "yup";

export const NewCragSchema = () =>
  yup
    .object()
    .shape({
      title: yup.string().required("Required"),
      description: yup.string().required("Required"),
      tags: yup
        .array()
        .min(1, "Select at least 1")
        .of(yup.string().oneOf(cragTags))
        .typeError("Invalid Tags"),
      latitude: yup
        .number()
        .typeError("Latitiude must be a number")
        .moreThan(-90, "Latitude must be a valid latitude")
        .lessThan(90, "Must be a valid latitude"),
      longitude: yup
        .number()
        .typeError("Longitude must be a number")
        .moreThan(-180, "Longitude must be a valid longitude")
        .lessThan(180, "Must be a valid longitude"),
      access: yup.string().required(),
      carParks: yup
        .array()
        .of(
          yup.object().shape({
            title: yup.string().required("Required"),
            description: yup.string(),
            latitude: yup
              .number()
              .typeError("Latitude must be a number")
              .moreThan(-90, "Latitude must be a valid latitude")
              .lessThan(90, "Must be a valid latitude"),
            longitude: yup
              .number()
              .typeError("Longitude must be a number")
              .moreThan(-180, "Longitude must be a valid longitude")
              .lessThan(180, "Must be a valid longitude"),
          })
        )
        .required("Add at least 1")
        .min(1, "Add at least 1"),
      accessLink: yup.string().url("Not a valid URL").nullable(),
      acceptTerms: yup.boolean().oneOf([true], "Required"),
    })
    .noUnknown();

export const UpdateCragSchema = () =>
  yup
    .object()
    .shape({
      title: yup.string(),
      description: yup.string(),
      newTags: yup
        .array()
        .of(yup.string().oneOf(cragTags)),
      removeTags: yup
        .array()
        .of(yup.string().oneOf(cragTags)),
      latitude: yup
        .number()
        .typeError("Latitiude must be a number")
        .moreThan(-90, "Latitude must be a valid latitude")
        .lessThan(90, "Must be a valid latitude"),
      longitude: yup
        .number()
        .typeError("Longitude must be a number")
        .moreThan(-180, "Longitude must be a valid longitude")
        .lessThan(180, "Must be a valid longitude"),
      access: yup.string(),
      accessLink: yup.string().url("Not a valid URL").nullable(),
    })
    .noUnknown();

export const NewAreaSchema = () =>
  yup
    .object()
    .shape({
      title: yup.string().required("Required"),
      description: yup.string(),
      tags: yup
        .array()
        .min(1, "Select at least 1")
        .of(yup.string().oneOf(areaTags))
        .typeError("Invalid Tags"),
      latitude: yup
        .number()
        .typeError("Latitiude must be a number")
        .moreThan(-90, "Latitude must be a valid latitude")
        .lessThan(90, "Must be a valid latitude"),
      longitude: yup
        .number()
        .typeError("Longitude must be a number")
        .moreThan(-180, "Longitude must be a valid longitude")
        .lessThan(180, "Must be a valid longitude"),
      access: yup.string().required(),
      rockType: yup
        .string()
        .required("Required")
        .oneOf(rockTypes, "Invalid Rock Type"),
    })
    .noUnknown();

export const UpdateAreaSchema = () =>
  yup
    .object()
    .shape({
      title: yup.string(),
      description: yup.string(),
      addTags: yup
        .array()
        .of(yup.string().oneOf(areaTags))
        .typeError("Invalid Tags"),
      removeTags: yup
        .array()
        .of(yup.string().oneOf(areaTags))
        .typeError("Invalid Tags"),
      latitude: yup
        .number()
        .typeError("Latitiude must be a number")
        .moreThan(-90, "Latitude must be a valid latitude")
        .lessThan(90, "Must be a valid latitude"),
      longitude: yup
        .number()
        .typeError("Longitude must be a number")
        .moreThan(-180, "Longitude must be a valid longitude")
        .lessThan(180, "Must be a valid longitude"),
      access: yup.string(),
      rockType: yup.string().oneOf(rockTypes, "Invalid Rock Type"),
      verified: yup.boolean()
    })
    .noUnknown();

export const NewTopoSchema = () =>
  yup
    .object()
    .shape({
      orientation: yup.string().required("Required"),
      imageFileName: yup.string().required("Required"),
      image: yup.string(),
      areaSlug: yup.string().required(),
      cragSlug: yup.string().required(),
    })
    .noUnknown();

export const UpdateTopoSchema = () =>
  yup
    .object()
    .shape({
      orientation: yup.string(),
      imageFileName: yup.string(),
      image: yup.string(),
      verified: yup.boolean()
    })
    .noUnknown();

export const NewRouteScheme = () =>
  yup
    .object()
    .shape({
      title: yup.string().required("Required"),
      description: yup.string(),
      tags: yup
        .array()
        .min(1, "Select at least 1")
        .of(yup.string().oneOf(routeTags))
        .typeError("Invalid Tags"),
      drawing: yup
        .object()
        .required()
        .shape({
          points: yup
            .array()
            .required()
            .min(1, "Not enough points in drawing path"),
        }),
      routeType: yup.string().required("Required"),
      gradingSystem: yup.string().required("Required"),
      grade: yup.string().required("Required"),
      cragSlug: yup.string().required("Required"),
      areaSlug: yup.string().required("Required"),
      topoSlug: yup.string().required("Required"),
    })
    .noUnknown();

export const UpdateRouteScheme = () =>
  yup
    .object()
    .shape({
      title: yup.string(),
      description: yup.string(),
      newTags: yup
        .array()
        .of(yup.string().oneOf(routeTags))
        .typeError("Invalid Tags"),
      removeTags: yup
        .array()
        .of(yup.string().oneOf(routeTags))
        .typeError("Invalid Tags"),
      drawing: yup
        .object()
        .shape({
          points: yup
            .array()
            .required()
            .min(1, "Not enough points in drawing path"),
        }),
      routeType: yup.string(),
      gradingSystem: yup.string(),
      grade: yup.string(),
      verified: yup.boolean()
    })
    .noUnknown();

export const NewLogsSchema = () =>
  yup
    .object()
    .shape({
      logs: yup.array().of(
        yup.object().shape({
          areaSlug: yup.string().required(),
          attempts: yup.string().required("Required"),
          comment: yup.string(),
          cragSlug: yup.string().required(),
          dateSent: yup.string().required("Required"),
          grade: yup.number().required("Required"),
          gradeModal: yup.number().required("Required"),
          gradeTaken: yup.number().required("Required"),
          gradingSystem: yup.string().oneOf(
            gradingSystems.map((g) => g.title),
            "Invalid Grading System"
          ),
          routeSlug: yup.string().required(),
          routeTitle: yup.string().required(),
          routeType: yup.string().required(),
          rating: yup
            .number()
            .min(0, "Cannot rate less than 0")
            .max(5, "Cannot rate more than 5")
            .required(),
          tags: yup
            .array()
            .of(yup.string().oneOf(routeTags))
            .typeError("Invalid Tags"),
        })
      ),
    })
    .noUnknown();

export const NewListSchema = () =>
  yup
    .object()
    .shape({
      title: yup.string().required("Required"),
    })
    .noUnknown();

export const UpdateListSchema = () =>
  yup
    .object()
    .shape({
      routes: yup
        .array()
        .of(
          yup.object().shape({
            cragSlug: yup.string().required(),
            areaSlug: yup.string().required(),
            topoSlug: yup.string().required(),
            routeSlug: yup.string().required(),
          })
        )
        .min(1, "Not routes provided"),
    })
    .noUnknown();
