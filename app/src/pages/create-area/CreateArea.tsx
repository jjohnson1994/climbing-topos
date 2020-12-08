import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { areas, globals } from "../../api";
import { popupError, popupSuccess } from "../../helpers/alerts";
import { getCurrentPosition } from '../../helpers/geolocation';
import { Area } from "../../../../core/types";

const schema = yup.object().shape({
  title: yup.string().required("Required"),
  description: yup.string().required("Required"),
  tags: yup.array().min(1, "Select at least 1").of(
    yup.string()
  ),
  latitude: yup.number().typeError("Latitiude must be a number").moreThan(-90, "Latitude must be a valid latitude").lessThan(90, "Must be a valid latitude"),
  longitude: yup.number().typeError("Longitude must be a number").moreThan(-180, "Longitude must be a valid longitude").lessThan(180, "Must be a valid longitude"),
  access: yup.string().required(),
});

function CreateArea() {
  const history = useHistory();
  const { cragSlug } = useParams<{ cragSlug: string }>();
  const [tags, setTags] = useState<string[]>([]);
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { register, setValue, handleSubmit, errors, watch } = useForm<Area>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      title: "",
      description: "",
      tags: [] as string[],
      latitude: "",
      longitude: "",
      access: "unknown",
      accessDetails: "",
      approachNotes: "",
    }
  });

  const watchTags = watch("tags", []);

  useEffect(() => {
    doGetTags();
  }, []);

  const doGetTags = async () => {
    const tags = await globals.getAreaTags();
    setTags(tags);
  }

  const btnFindMeOnClick = async () => {
    setLocationLoading(true);

    try {
      const location = await getCurrentPosition();
      setValue("latitude", `${location.coords.latitude}`);
      setValue("longitude", `${location.coords.longitude}`);
    } catch (error) {
      console.error('Error loading user location', error);
    } finally {
      setLocationLoading(false);
    }
  }

  const formOnSubmit = handleSubmit(async (formData) => {
    setLoading(true);

    try {
      const { slug: areaSlug } = await areas.createArea({ ...formData, cragSlug });
      await popupSuccess("Area Created!");
      history.push(`/crags/${cragSlug}/area/${areaSlug}`);
    } catch (error) {
      console.error('Error creating crag', error);
      popupError("Ahh, something has gone wrong...");
    } finally {
      setLoading(false);
    }
  });

  return (
    <section className="section">
      <div className="container box">
        <form
          onSubmit={ formOnSubmit }
          style={{ display: "flex", flexDirection: "column" }}
          autoComplete="off"
        >
          <div className="field">
            <label className="label" htmlFor="title">Title</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="title"
                ref={ register }
              />
            </div>
            <p className="help is-danger">{ errors.title?.message }</p>
          </div>

          <div className="field">
            <label className="label" htmlFor="description">Description</label>
            <div className="control">
              <textarea
                className="textarea"
                name="description"
                ref={ register }
              ></textarea> 
            </div>
            <p className="help is-danger">{ errors.description?.message }</p>
          </div>

          <div className="field">
            <label className="label" htmlFor="approachNotes">Approach Notes</label>
            <div className="control">
              <textarea
                id="approachNotes"
                className="textarea"
                name="approachNotes"
                ref={ register }
              ></textarea> 
            </div>
            <p className="help is-danger">{ errors.approachNotes?.message }</p>
          </div>

          <div className="field">
            <label className="label">Tags</label>
            <div className="field is-grouped is-grouped-multiline">
              <div role="group" className="tags">
                {tags.map(tag => (
                  <label
                    key={ tag }
                    className={`
                      tag
                      ${watchTags?.includes(tag) ? "is-primary" : ""}
                    `}
                  >
                    <input type="checkbox" name="tags" value={ tag } ref={ register } style={{ display: "none" }} />
                    { tag }
                  </label>
                ))} 
              </div>
            </div>
            <p className="help is-danger">{ (errors.tags as any)?.message }</p>
          </div>

          <div className="field">
            <div className="field">
              <label className="label">Area Location</label>
              <div className="field has-addons">
                <div className="control is-expanded has-icons-right">
                  <input
                    disabled={ locationLoading }
                    className="input"
                    type="text"
                    placeholder="Latitude"
                    name="latitude"
                    ref={ register }
                  />
                </div>
                <div className="control is-expanded has-icons-right">
                  <input
                    disabled={ locationLoading }
                    className="input"
                    type="text"
                    placeholder="Logitude"
                    name="longitude"
                    ref={ register }
                  />
                </div>
                <div className="control">
                  <button
                    type="button"
                    className={`
                      button
                      ${locationLoading ? "is-loading" : ""}
                    `}
                    onClick={ () => btnFindMeOnClick() }
                  >
                    <span className="icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </span>
                    <span>Find Me</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="help is-danger">{ errors.latitude?.message }</div>
            <div className="help is-danger">{ errors.longitude?.message }</div>
          </div>
          
          <div className="field">
            <label className="label">Access</label>
            <div className="control">
              <label className="radio">
                <input
                  type="radio"
                  name="access"
                  value="unknown"
                  ref={ register }
                />
                Unknown
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="access"
                  value="permitted"
                  ref={ register }
                />
                Permitted
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="access"
                  value="restricted"
                  ref={ register }
                />
                Restricted
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="access"
                  value="banned"
                  ref={ register }
                />
                Banned
              </label>
            </div>
            <p className="help is-danger"></p>
          </div>

          <div className="field">
            <label className="label" htmlFor="accessDetails">Access Details</label>
            <div className="control">
              <textarea
                className="textarea"
                name="accessDetails"
                ref={ register }
              /> 
            </div>
          </div>

          <div className="field">
            <div className="field is-flex is-justified-end">
              <div className="control">
                <button type="submit" className={`button is-primary ${loading ? "is-loading" : ""}`}>
                  <span>Continue</span>
                </button>
              </div>
            </div>
            <p className="help has-text-right">Don't worry, your topo won't be make public yet</p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default CreateArea;
