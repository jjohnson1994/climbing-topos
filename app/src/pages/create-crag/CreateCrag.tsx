import { useAuth0 } from "@auth0/auth0-react";
import { yupResolver } from '@hookform/resolvers/yup';
import { NewCragSchema } from "core/schemas";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import * as yup from "yup";
import { crags, globals } from "../../api";
import { useGlobals } from "../../api/globals";
import { popupError, popupSuccess } from "../../helpers/alerts";
import { getCurrentPosition } from '../../helpers/geolocation';
import { reverseLookup } from '../../helpers/nominatim';

const schema = NewCragSchema(yup);

type CarPark = {
  title: string;
  latitude: string;
  longitude: string;
  description: string;
}

function CreateCrag() {
  const history = useHistory();
  const { getAccessTokenSilently } = useAuth0();
  const { accessTypes, cragTags, rockTypes } = useGlobals();
  const [carParkLocationLoadingIndex, setCarParkLocationLoadingIndex] = useState(-1);
  const [cragLocationLoading, setCragLocationLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { register, control, setValue, handleSubmit, errors, watch } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      accessDetails: "",
      accessTypeId: "",
      approachDetails: "",
      carParks: [{
        description: "",
        latitude: "",
        longitude: "",
        title: "",
      }] as CarPark[],
      description: "",
      latitude: "",
      longitude: "",
      rockTypeId: "",
      tags: [] as string[],
      title: "",
    }
  });

  const {
    fields: carParks,
    append: appendCarPark,
    remove: removeCarPark,
    insert: insertCarPark
  } = useFieldArray({
    control,
    name: "carParks"
  });

  const watchTags = watch("tags", []);

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
    const osmData = await reverseLookup(latitude, longitude);
    return osmData;
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
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      const osmData = await getCragNominatim(formData.latitude, formData.longitude);
      const { slug } = await crags.createCrag({ ...formData, osmData }, token);
      await popupSuccess("Crag Created!");
      history.push(`/crags/${slug}`);
    } catch (error) {
      console.error('Error creating crag', error);

      if (error.error === "Unable to geocode") {
        popupError("Could not find geolocation data! Check the Crag location coordinates are correct and try again");
      } else {
        popupError("Ahh, something has gone wrong...");
      }
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
                ref={ register() }
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
            <label className="label">Rock Type</label>
            <div className="control is-expanded">
              <div className="select is-fullwidth">
                <select name="rockTypeId" ref={ register }>
                  <option key="" value="">Select One</option>
                  {rockTypes.map(rockType => (
                    <option key={ rockType.id } value={ rockType.id }>{ rockType.title }</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="help is-danger">{ errors.rockTypeId?.message }</p>
          </div>

          <div className="field">
            <label className="label" htmlFor="approachDetails">Approach Notes</label>
            <div className="control">
              <textarea
                id="approachDetails"
                className="textarea"
                name="approachDetails"
                ref={ register }
              ></textarea> 
            </div>
            <p className="help is-danger">{ errors.approachDetails?.message }</p>
          </div>

          <div className="field">
            <label className="label">Tags</label>
            <div className="field is-grouped is-grouped-multiline">
              <div role="group" className="tags">
                {cragTags.map(tag => (
                  <label
                    key={ tag.id }
                    className={`
                      tag
                      is-capitalized
                      ${watchTags.includes(`${tag.id}`) ? "is-primary" : ""}
                    `}
                  >
                    <input type="checkbox" name="tags" value={ tag.id } ref={ register } style={{ display: "none" }} />
                    { tag.title }
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
                    type="text"
                    placeholder="Latitude"
                    name="latitude"
                    ref={ register }
                  />
                </div>
                <div className="control is-expanded has-icons-right">
                  <input
                    disabled={ cragLocationLoading }
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
                      ref={ register({}) }
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
                <div className="field">
                  <div className="control">
                    <textarea
                      placeholder="Description"
                      className="textarea"
                      name={`carParks[${index}].description`}
                      ref={ register }
                    ></textarea> 
                  </div>
                </div>
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
            {/**
              <div className="help is-danger">{ errors.carParks?.message }</div>
            */}
          </div>

          <div className="field">
            <label className="label">Access</label>
            <div className="control is-expanded">
              <div className="select is-fullwidth">
                <select name="accessTypeId" ref={ register }>
                  <option key="" value="">Select One</option>
                  {accessTypes.map(accessType => (
                    <option key={ accessType.id } value={ accessType.id }>{ accessType.title }</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="help is-danger">{ errors.accessTypeId?.message }</p>
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
                  <span>Create Crag</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default CreateCrag
