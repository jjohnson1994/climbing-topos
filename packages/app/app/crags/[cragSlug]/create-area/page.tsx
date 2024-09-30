"use client"

import { yupResolver } from "@hookform/resolvers/yup";
import { NewAreaSchema } from "@climbingtopos/schemas";
import { Crag } from "@climbingtopos/types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation'
import { areas, crags } from "@/app/api";
import { areaTags as tags, rockTypes } from "@climbingtopos/globals";
import { popupError, popupSuccess } from "@/app/helpers/alerts";
import { getCurrentPosition } from "@/app/helpers/geolocation";

const schema = NewAreaSchema();

function CreateArea({ params: { cragSlug } }: { params: { cragSlug: string } }) {
  const router = useRouter();
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [crag, setCrag] = useState<Crag>();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      access: "unknown",
      accessDetails: "",
      approachNotes: "",
      description: "",
      latitude: "",
      longitude: "",
      rockType: "",
      tags: [] as string[],
      title: "",
    },
  });

  const watchTags = watch("tags", []);

  useEffect(() => {
    const getCrag = async () => {
      try {
        const newCrag = await crags.getCragBySlug(cragSlug);
        setCrag(newCrag);
      } catch (error) {
        console.error("Error getting area crag", error);
      }
    };

    getCrag();
  }, [cragSlug]);

  const btnFindMeOnClick = async () => {
    setLocationLoading(true);

    try {
      const location = await getCurrentPosition();
      setValue("latitude", `${location.coords.latitude}`);
      setValue("longitude", `${location.coords.longitude}`);
    } catch (error) {
      console.error("Error loading user location", error);
    } finally {
      setLocationLoading(false);
    }
  };

  const formOnSubmit = handleSubmit(async (formData) => {
    setLoading(true);

    try {
      if (!crag) {
        throw new Error("Cannot create new route, crag not found");
      }

      const { slug: areaSlug } = await areas.createArea({
        ...formData,
        country: crag.osmData.address.country,
        countryCode: crag.osmData.address.country_code,
        county: crag.osmData.address.county,
        cragSlug,
        cragTitle: crag.title,
        state: crag.osmData.address.state,
      });
      await popupSuccess("Area Created!");
      router.push(`/crags/${cragSlug}/areas/${areaSlug}`);
    } catch (error) {
      console.error("Error creating crag", error);
      popupError("Ahh, something has gone wrong...");
    } finally {
      setLoading(false);
    }
  });

  return (
    <section className="section">
      <div className="container box">
        <form
          onSubmit={formOnSubmit}
          style={{ display: "flex", flexDirection: "column" }}
          autoComplete="off"
        >
          <div className="field">
            <label className="label" htmlFor="title">
              Title
            </label>
            <div className="control">
              <input className="input" type="text" {...register("title")} />
            </div>
            <p className="help is-danger">{errors.title?.message}</p>
          </div>

          <div className="field">
            <label className="label" htmlFor="description">
              Description
            </label>
            <div className="control">
              <textarea
                className="textarea"
                {...register("description")}
              ></textarea>
            </div>
            <p className="help is-danger">{errors.description?.message}</p>
          </div>

          <div className="field">
            <label className="label" htmlFor="approachNotes">
              Approach Notes
            </label>
            <div className="control">
              <textarea
                id="approachNotes"
                className="textarea"
                {...register("approachNotes")}
              ></textarea>
            </div>
            <p className="help is-danger">{errors.approachNotes?.message}</p>
          </div>

          <div className="field">
            <label className="label">Tags</label>
            <div className="field is-grouped is-grouped-multiline">
              <div role="group" className="tags">
                {tags.map((tag) => (
                  <label
                    key={tag}
                    className={`
                      tag
                      ${watchTags?.includes(tag) ? "is-primary" : ""}
                    `}
                  >
                    <input
                      type="checkbox"
                      value={tag}
                      {...register("tags")}
                      style={{ display: "none" }}
                    />
                    {tag}
                  </label>
                ))}
              </div>
            </div>
            <p className="help is-danger">{(errors.tags as any)?.message}</p>
          </div>

          <div className="field">
            <label className="label">Rock Type</label>
            <div className="control is-expanded">
              <div className="select is-fullwidth">
                <select {...register("rockType")}>
                  {rockTypes.map((rockType) => (
                    <option key={rockType} value={rockType}>
                      {rockType}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="help is-danger">{errors.rockType?.message}</p>
          </div>

          <div className="field">
            <div className="field">
              <label className="label">Area Location</label>
              <div className="field has-addons">
                <div className="control is-expanded has-icons-right">
                  <input
                    disabled={locationLoading}
                    className="input"
                    type="text"
                    placeholder="Latitude"
                    {...register("latitude")}
                  />
                </div>
                <div className="control is-expanded has-icons-right">
                  <input
                    disabled={locationLoading}
                    className="input"
                    type="text"
                    placeholder="Logitude"
                    {...register("longitude")}
                  />
                </div>
                <div className="control">
                  <button
                    type="button"
                    className={`
                      button
                      ${locationLoading ? "is-loading" : ""}
                    `}
                    onClick={() => btnFindMeOnClick()}
                  >
                    <span className="icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </span>
                    <span>Find Me</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="help is-danger">{errors.latitude?.message}</div>
            <div className="help is-danger">{errors.longitude?.message}</div>
          </div>

          <div className="field">
            <label className="label">Access</label>
            <div className="control">
              <label className="radio">
                <input
                  type="radio"
                  value="unknown"
                  {...register("access")}
                />
                Unknown
              </label>
              <label className="radio">
                <input
                  type="radio"
                  value="permitted"
                  {...register("access")}
                />
                Permitted
              </label>
              <label className="radio">
                <input
                  type="radio"
                  value="restricted"
                  {...register("access")}
                />
                Restricted
              </label>
              <label className="radio">
                <input
                  type="radio"
                  value="banned"
                  {...register("access")}
                />
                Banned
              </label>
            </div>
            <p className="help is-danger"></p>
          </div>

          <div className="field">
            <label className="label" htmlFor="accessDetails">
              Access Details
            </label>
            <div className="control">
              <textarea
                className="textarea"
                {...register("accessDetails")}
              />
            </div>
          </div>

          <div className="field">
            <div className="field is-flex is-justified-end">
              <div className="control">
                <button
                  type="submit"
                  className={`button is-primary ${loading ? "is-loading" : ""}`}
                >
                  <span>Continue</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default CreateArea;
