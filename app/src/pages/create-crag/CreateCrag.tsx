import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { crags, globals } from "../../api";
import { popupError, popupSuccess } from "../../helpers/alerts";
import { getCurrentPosition } from '../../helpers/geolocation';
import { reverseLookup } from '../../helpers/nominatim';

const schema = yup.object().shape({
  title: yup.string().required("Required"),
  description: yup.string().required("Required"),
  tags: yup.array().min(1, "Select at least 1").of(
    yup.string()
  ),
  latitude: yup.number().typeError("Latitiude must be a number").moreThan(-90, "Latitude must be a valid latitude").lessThan(90, "Must be a valid latitude"),
  longitude: yup.number().typeError("Longitude must be a number").moreThan(-180, "Longitude must be a valid longitude").lessThan(180, "Must be a valid longitude"),
  access: yup.string().required(),
  carParks: yup.array().of(
    yup.object().shape({
      title: yup.string().required("Required"),
      latitude: yup.number().typeError("Latitude must be a number").moreThan(-90, "Latitude must be a valid latitude").lessThan(90, "Must be a valid latitude"),
      longitude: yup.number().typeError("Longitude must be a number").moreThan(-180, "Longitude must be a valid longitude").lessThan(180, "Must be a valid longitude")
    })
  ).min(2, "Add at least 1"),
  accessLink: yup.string().url().nullable()
});

type CarPark = {
  title: string;
  latitude: string;
  longitude: string;
}

function CreateCrag() {
  const [carParkLocationLoadingIndex, setCarParkLocationLoadingIndex] = useState(-1);
  const [cragTags, setCragTags] = useState<string[]>([]);
  const [cragLocationLoading, setCragLocationLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { register, control, setValue, getValues, handleSubmit, errors, watch } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      title: "",
      description: "",
      tags: [] as string[],
      latitude: "",
      longitude: "",
      carParks: [] as CarPark[],
      access: "unknown",
      accessLink: "",
      accessDetails: ""
    }
  });

  const { fields: carParks, append: appendCarPark, remove: removeCarPark, insert: insertCarPark } = useFieldArray({
    control,
    name: "carParks"
  });

  const watchTags = watch("tags", []);

  useEffect(() => {
    doGetTags();
  }, []);

  const doGetTags = async () => {
    const cragTags = await globals.getCragTags();
    setCragTags(cragTags);
  }

  const btnCragLocationFindMeOnClick = async () => {
    setCragLocationLoading(true);

    try {
      const location = await getCurrentPosition();
      setValue("latitude", `${location.coords.latitude}`);
      setValue("longitude", `${location.coords.longitude}`);
    } catch (error) {
      console.error('Error loading user location', error);
    } finally {
      setCragLocationLoading(false);
    }
  }

  const getCragNominatim = async (latitude: string, longitude: string) => {
    try {
      const osmData = await reverseLookup(latitude, longitude);
      setValue("osmData", osmData);
    } catch(error) {
      console.error("Error getting OSM Data for crag", error);
    }
  }

  const btnAddCarParkOnClick = () => {
    appendCarPark({
      title: "",
      latitude: "",
      longitude: ""
    });
  }

  const btnRemoveCarParkOnClick = (index: number) => {
    removeCarPark(index);
  }

  const btnCarParkFindMeOnClick = async (index: number) => {
    setCarParkLocationLoadingIndex(index);
    const location = await getCurrentPosition();
    const newCarPark = {
      ...carParks[index],
      latitude: `${location.coords.latitude}`,
      longitude: `${location.coords.longitude}`,
    };

    removeCarPark(index);
    insertCarPark(index, newCarPark);

    setCarParkLocationLoadingIndex(-1);
  }

  const formOnSubmit = handleSubmit(async (formData) => {
    console.log(formData);
    try {
      const osmData = await getCragNominatim(formData.latitude, formData.longitude);
      await crags.createCrag({ ...formData, osmData });
      popupSuccess("Crag Created!");
    } catch (error) {
      console.error('Error creating crag', error);
      popupError("Ahh, something has gone wrong...");
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
            <label className="label">Tags</label>
            <div className="field is-grouped is-grouped-multiline">
              <div role="group" className="tags">
                {cragTags.map(tag => (
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
              <label className="label">Crag Location</label>
              <div className="field has-addons">
                <div className="control is-expanded has-icons-right">
                  <input
                    disabled={ cragLocationLoading }
                    className="input"
                    type="number"
                    placeholder="Latitude"
                    name="latitude"
                    ref={ register }
                  />
                </div>
                <div className="control is-expanded has-icons-right">
                  <input
                    disabled={ cragLocationLoading }
                    className="input"
                    type="number"
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
                      ${cragLocationLoading ? "is-loading" : ""}
                    `}
                    onClick={ () => btnCragLocationFindMeOnClick() }
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
            <label className="label">Parking Location</label>
            {carParks.map((_carPark, index) => (
              <div className="field" key={ index }>
                <div className="field has-addons">
                  <div className="control is-expanded has-icons-right">
                    <input
                      type="text"
                      placeholder="Name"
                      className="input"
                      name={`carParks[${index}].title`}
                      ref={ register }
                    />
                  </div>
                  {carParks.length && (
                    <div className="control">
                      <button
                        type="button"
                        className="button is-outlined"
                        onClick={ () => btnRemoveCarParkOnClick(index) }
                      >
                        <span className="icon">
                          <i className="fas fa-trash-alt"></i>
                        </span>
                      </button>
                    </div>
                  )}
                </div>
                <p className="help is-danger">{ errors.carParks?.[index]?.title?.message }</p>
                <div className="field has-addons">
                  <div className="control is-expanded has-icons-right">
                    <input
                      className="input"
                      type="text"
                      placeholder="Latitude"
                      name={`carParks[${index}].latitude`}
                      ref={ register }
                    />
                  </div>
                  <div className="control is-expanded has-icons-right">
                    <input
                      className="input"
                      type="text"
                      placeholder="Longitude"
                      name={`carParks[${index}].longitude`}
                      ref={ register }
                    />
                  </div>
                  <div className="control">
                    <button
                      type="button"
                      className={`
                        button
                        ${carParkLocationLoadingIndex === index ? "is-loading" : ""}
                      `}
                      onClick={ () => btnCarParkFindMeOnClick(index) }
                    >
                      <span className="icon">
                        <i className="fas fa-map-marker-alt"></i>
                      </span>
                      <span>Find Me</span>
                    </button>
                  </div>
                </div>
                <div className="help is-danger">{ errors.carParks?.[index]?.latitude?.message }</div>
                <div className="help is-danger">{ errors.carParks?.[index]?.longitude?.message }</div>
              </div>
            ))}
          </div>

          <div className="field">
            <div className="control">
              <button className="button" type="button" onClick={ btnAddCarParkOnClick }>
                <span className="icon is-small">
                  <i className="fas fa-plus"></i>
                </span>
                <span>Add Car Park</span>
              </button>
            </div>
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
            <label className="label" htmlFor="accessLink">Access Details Link</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="accessLink"
                ref={ register }
              />
            </div>
            <p className="help is-danger">{ errors.accessLink?.message }</p>
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

export default CreateCrag
