import { gradingSystems, routeTags } from "../globals";

console.log(`/(${gradingSystems.map(g => g.title).join(")|(")})/`);

export const NewLogsSchema = yup => yup.object().shape({
  logs: yup.array().of(
    yup.object().shape({
      areaSlug: yup.string(),
      attempts: yup.string().required("Required"),
      comment: yup.string(),
      cragSlug: yup.string(),
      dateSent: yup.string().required("Required"),
      grade: yup.string(),
      gradeTaken: yup.string().required("Required"),
      gradingSystem: yup.string().matches(
        new RegExp(`/()|(${gradingSystems.map(g => g.title).join(")|(")})/g`),
        "Invalid Grading System"
      ),
      routeSlug: yup.string(),
      routeTitle: yup.string(),
      routeType: yup.string(),
      stars: yup.string(),
      tags: yup.array().min(1, "Select at least 1").of(
        yup.string().matches(new RegExp(`/${routeTags.join("|")}/`), "Invalid tags")
      ),
    })
  )
});
